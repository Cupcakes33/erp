import axios from 'axios'
import api from '.'

/**
 * 지시 목록 조회 API
 * @param {Object} params - 검색 및 페이징 파라미터
 * @param {string} [params.center] - 센터 필터 (예: '강동', '성북')
 * @param {string} [params.status] - 상태 필터
 * @param {number} [params.page] - 페이지 번호 (0-based)
 * @param {number} [params.size] - 페이지 크기
 * @param {string} [params.keyword] - 검색 키워드 (지시 ID 등으로 검색 시 사용)
 * @returns {Promise<Object>} 지시 목록
 */
export const fetchInstructions = async (params = {}) => {
  try {
    // 페이지 번호가 1부터 시작하는 경우 0부터 시작하도록 변환
    const apiParams = { ...params };
    if (apiParams.page && apiParams.page > 0) { // API는 0-based page index를 기대
      apiParams.page = apiParams.page - 1;
    }
    
    // 불필요한 빈 파라미터 제거
    Object.keys(apiParams).forEach(key => {
      if (apiParams[key] === '' || apiParams[key] === null || apiParams[key] === undefined) {
        delete apiParams[key];
      }
    });
    
    const response = await api.get(`/instruction`, { params: apiParams });
    return response.data;
  } catch (error) {
    console.error('지시 목록 조회 실패:', error);
    throw error;
  }
}

/**
 * 특정 지시 정보를 조회하는 API
 * @param {number} id 지시 ID
 * @returns {Promise<Object>} 지시 정보
 */
export const fetchInstructionById = async (id) => {
  try {
    const response = await api.get(`/instruction/${id}`);
    // API 응답이 { data: { 지시객체 }, message: "조회 성공" } 형태로 변경됨
    return response.data;
  } catch (error) {
    console.error(`지시 ID ${id} 조회 실패:`, error);
    throw error;
  }
}

/**
 * 출력용 지시 상세 정보 조회 API
 * @param {number} id 지시 ID
 * @returns {Promise<Object>} 출력용 지시 상세 정보
 */
export const fetchInstructionDetail = async (id) => {
  // AbortController를 사용하여 요청 취소 기능 구현
  const controller = new AbortController();
  const signal = controller.signal;
  
  try {
    // 요청이 이미 취소되었는지 확인
    if (signal.aborted) {
      throw new axios.Cancel('Operation canceled by the user.');
    }
    
    // 실제 전달받은 ID 사용
    const response = await api.get(`/instruction/${id}/detail`, { signal });
    
    // AbortController 반환하여 컴포넌트에서 요청 취소 가능하도록 함
    return {
      ...response.data,
      controller
    };
  } catch (error) {
    // 요청이 취소된 경우 에러 무시
    if (axios.isCancel(error) || error.name === 'CanceledError' || error.name === 'AbortError') {
      console.log('요청이 취소됨:', error.message);
      // 애러가 발생해도 controller를 전달하여 정리할 수 있도록 함
      return { 
        data: null, 
        message: "요청 취소됨", 
        controller,
        canceled: true 
      };
    }
    
    console.error(`지시 ID ${id} 출력용 상세 정보 조회 실패:`, error);
    // 에러가 발생해도 controller를 함께 반환하여 cleanup 가능하게 함
    return { 
      data: null, 
      message: error.message, 
      controller,
      error: true
    };
  }
}

/**
 * 새 지시를 생성하는 API
 * @param {Object} instructionData 지시 데이터. `channel` 필드가 있다면 문자열 타입이어야 합니다. `center` 필드 (센터명, 문자열 타입)를 포함할 수 있습니다.
 * @returns {Promise<Object>} 생성된 지시 정보
 */
export const createInstruction = async (instructionData) => {
  try {
    const response = await api.post(`/instruction`, instructionData);
    return response.data;
  } catch (error) {
    console.error('지시 생성 실패:', error);
    throw error;
  }
}

/**
 * 지시 정보를 수정하는 API
 * @param {number} id 지시 ID
 * @param {Object} instructionData 업데이트할 지시 데이터. `channel` 필드가 있다면 문자열 타입이어야 합니다. `paymentId` 필드 (회차 ID, 숫자 타입)를 포함할 수 있습니다.
 * @returns {Promise<Object>} 수정된 지시 정보
 */
export const updateInstruction = async (id, instructionData) => {
  try {
    const response = await api.put(`/instruction/${id}`, instructionData);
    return response.data;
  } catch (error) {
    console.error(`지시 ID ${id} 수정 실패:`, error);
    throw error;
  }
}

/**
 * 지시 상태를 변경하는 API
 * @param {number} id 지시 ID
 * @param {string} status 새 상태
 * @returns {Promise<Object>} 수정된 지시 정보
 */
export const updateInstructionStatus = async (id, statusData) => {
  try {
    // 먼저 현재 지시 정보를 가져옵니다
    const currentInstruction = await fetchInstructionById(id);
    const instructionData = currentInstruction.data;
    
    // 현재 지시 정보에서 상태만 업데이트합니다
    const updatedData = {
      ...instructionData,
      status: statusData.status
    };
    
    // 업데이트된 데이터로 PUT 요청을 보냅니다
    const response = await api.put(`/instruction/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`지시 ID ${id} 상태 변경 실패:`, error);
    throw error;
  }
}

/**
 * 지시 즐겨찾기 상태를 토글하는 API
 * @param {number} id 지시 ID
 * @returns {Promise<Object>} 수정된 지시 정보
 */
export const toggleInstructionFavorite = async (id) => {
  try {
    const response = await api.post(`/instruction/${id}/favorite`);
    return response.data;
  } catch (error) {
    console.error(`지시 ID ${id} 즐겨찾기 토글 실패:`, error);
    throw error;
  }
}

/**
 * 지시를 삭제하는 API
 * @param {number} id 지시 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteInstruction = async (id) => {
  try {
    const response = await api.delete(`/instruction/${id}`);
    return response.data;
  } catch (error) {
    console.error(`지시 ID ${id} 삭제 실패:`, error);
    throw error;
  }
}

/**
 * 지시 확정(기성에 반영) API
 * @param {number} id 지시 ID
 * @param {string} completedBy 완료자(종료처리자) 이름
 * @returns {Promise<Object>} 확정 결과
 */
export const confirmInstruction = async (id) => {
  console.log(id)
  try {
    const response = await api.post(`/instruction/${id}/confirm`);
    return response.data;
  } catch (error) {
    console.error(`지시 ID ${id} 확정 실패:`, error);
    throw error;
  }
}

/**
 * 지시별 공종 목록 조회 API
 * @param {number} instructionId 지시 ID
 * @param {Object} params 페이징 파라미터
 * @param {number} params.page 페이지 번호
 * @param {number} params.size 페이지 크기
 * @returns {Promise<Object>} 공종 목록
 */
export const fetchProcessesByInstruction = async (instructionId, params = {}) => {
  try {
    // 페이지 번호가 1부터 시작하는 경우 0부터 시작하도록 변환
    const apiParams = { ...params };
    if (apiParams.page) {
      apiParams.page = apiParams.page - 1;
    }
    
    // 불필요한 빈 파라미터 제거
    Object.keys(apiParams).forEach(key => {
      if (apiParams[key] === '' || apiParams[key] === null || apiParams[key] === undefined) {
        delete apiParams[key];
      }
    });
    
    const response = await api.get(`/process?instruction=${instructionId}`, { params: apiParams });
    return response.data;
  } catch (error) {
    console.error(`지시 ID ${instructionId}의 공종 목록 조회 실패:`, error);
    throw error;
  }
}

/**
 * 특정 공종 정보 조회 API
 * @param {number} id 공종 ID
 * @returns {Promise<Object>} 공종 정보
 */
export const fetchProcessById = async (id) => {
  try {
    const response = await api.get(`/process/${id}`);
    return response.data;
  } catch (error) {
    console.error(`공종 ID ${id} 조회 실패:`, error);
    throw error;
  }
}

/**
 * 새 공종 생성 API
 * @param {number} instructionId 지시 ID
 * @param {Object} processData 공종 데이터
 * @returns {Promise<Object>} 생성된 공종 정보
 */
export const createProcess = async (instructionId, processData) => {
  try {
    const response = await api.post(`/process?instruction=${instructionId}`, processData);
    return response.data;
  } catch (error) {
    console.error('공종 생성 실패:', error);
    throw error;
  }
}

/**
 * 공종 정보 수정 API
 * @param {number} id 공종 ID
 * @param {Object} processData 업데이트할 공종 데이터
 * @returns {Promise<Object>} 수정된 공종 정보
 */
export const updateProcess = async (id, processData) => {
  try {
    const response = await api.put(`/process/${id}`, processData);
    return response.data;
  } catch (error) {
    console.error(`공종 ID ${id} 수정 실패:`, error);
    throw error;
  }
}

/**
 * 공종 삭제 API
 * @param {number} id 공종 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteProcess = async (id) => {
  try {
    const response = await api.delete(`/process/${id}`);
    return response.data;
  } catch (error) {
    console.error(`공종 ID ${id} 삭제 실패:`, error);
    throw error;
  }
}

/**
 * 모든 공종 목록 조회 API
 * @param {number} instructionId 지시 ID (필수)
 * @param {Object} params 페이징 파라미터
 * @param {number} params.page 페이지 번호
 * @param {number} params.size 페이지 크기
 * @returns {Promise<Object>} 공종 목록
 */
export const fetchAllProcesses = async (instructionId, params = {}) => {
  try {
    // 페이지 번호가 1부터 시작하는 경우 0부터 시작하도록 변환
    const apiParams = { ...params };
    if (apiParams.page) {
      apiParams.page = apiParams.page - 1;
    }
    
    // 불필요한 빈 파라미터 제거
    Object.keys(apiParams).forEach(key => {
      if (apiParams[key] === '' || apiParams[key] === null || apiParams[key] === undefined) {
        delete apiParams[key];
      }
    });
    
    const response = await api.get(`/process`, { 
      params: { 
        instruction: instructionId,
        ...apiParams 
      } 
    });
    return response.data;
  } catch (error) {
    console.error(`지시 ID ${instructionId}의 공종 목록 조회 실패:`, error);
    throw error;
  }
}

/**
 * 특정 작업 정보 조회 API
 * @param {number} id 작업 ID
 * @returns {Promise<Object>} 작업 정보
 */
export const fetchTaskById = async (id) => {
  try {
    const response = await api.get(`/task/${id}`);
    return response.data;
  } catch (error) {
    console.error(`작업 ID ${id} 조회 실패:`, error);
    throw error;
  }
}

/**
 * 지시 ID별 작업 목록 조회 API
 * @param {number} instructionId 지시 ID
 * @param {Object} params 페이징 파라미터
 * @param {number} [params.page] - 페이지 번호 (0-based index)
 * @param {number} [params.size] - 페이지 크기
 * @returns {Promise<Object>} 작업 목록 응답. 응답 객체 내 작업 배열의 각 작업 객체는 processId를 포함합니다. (예: { content: [{id: 1, name: '작업1', processId: 10, ...}, ...], ... })
 */
export const fetchTasksByInstructionId = async (instructionId, params = {}) => {
  try {
    // 페이지 번호가 1부터 시작하는 경우 0부터 시작하도록 변환
    const apiParams = { ...params };
    if (apiParams.page && apiParams.page > 0) { // API는 0-based page index를 기대
      apiParams.page = apiParams.page - 1;
    }
    delete apiParams.size; // size 파라미터 제거

    // 불필요한 빈 파라미터 제거
    Object.keys(apiParams).forEach(key => {
      if (apiParams[key] === '' || apiParams[key] === null || apiParams[key] === undefined) {
        delete apiParams[key];
      }
    });

    const response = await api.get(`/instruction/${instructionId}/tasks`, { params: apiParams });
    return response.data;
  } catch (error) {
    console.error(`지시 ID ${instructionId}의 작업 목록 조회 실패:`, error);
    throw error;
  }
}

/**
 * 새 작업 생성 API
 * @param {number} processId 공종 ID
 * @param {Object} taskData 작업 데이터
 * @param {number} taskData.unitPriceId 단가 ID
 * @param {number} taskData.unitCount 수량
 * @param {string} taskData.calculationDetails 산출 내역
 * @returns {Promise<Object>} 생성된 작업 정보
 */
export const createTask = async (processId, taskData) => {
  try {
    const response = await api.post(`/task?process=${processId}`, taskData);
    return response.data;
  } catch (error) {
    console.error('작업 생성 실패:', error);
    throw error;
  }
}

/**
 * 작업 정보 수정 API
 * @param {number} id 작업 ID
 * @param {Object} taskData 업데이트할 작업 데이터
 * @param {number} taskData.unitCount 수량
 * @param {string} taskData.calculationDetails 산출 내역
 * @returns {Promise<Object>} 수정된 작업 정보
 */
export const updateTask = async (id, taskData) => {
  try {
    const response = await api.put(`/task/${id}`, taskData);
    return response.data;
  } catch (error) {
    console.error(`작업 ID ${id} 수정 실패:`, error);
    throw error;
  }
}

/**
 * 작업 삭제 API
 * @param {number} id 작업 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/task/${id}`);
    return response.data;
  } catch (error) {
    console.error(`작업 ID ${id} 삭제 실패:`, error);
    throw error;
  }
}

/**
 * 일위대가 목록 조회 API
 * @param {Object} params 검색 및 페이징 파라미터
 * @param {string} params.keyword 검색 키워드
 * @param {number} params.page 페이지 번호
 * @param {number} params.size 페이지 크기
 * @returns {Promise<Object>} 일위대가 목록
 */
export const fetchUnitPrices = async (params = {}) => {
  try {
    // 페이지 번호가 1부터 시작하는 경우 0부터 시작하도록 변환
    const apiParams = { ...params };
    if (apiParams.page) {
      apiParams.page = apiParams.page - 1;
    }
    
    // 불필요한 빈 파라미터 제거
    Object.keys(apiParams).forEach(key => {
      if (apiParams[key] === '' || apiParams[key] === null || apiParams[key] === undefined) {
        delete apiParams[key];
      }
    });
    
    const response = await api.get(`/unit-price`, { params: apiParams });
    return response.data;
  } catch (error) {
    console.error('일위대가 목록 조회 실패:', error);
    throw error;
  }
}

/**
 * CSV 파일을 이용한 지시 일괄 등록 API (multipart/form-data 사용)
 * @param {File} csvFile CSV 파일
 * @returns {Promise<Object>} 일괄 등록 결과
 */
export const uploadCsvBulkInstructions = async (csvFile) => {
  try {
    const formData = new FormData();
    formData.append('file', csvFile);

    const response = await api.post(`/instruction/file`, formData);
    return response.data;
  } catch (error) {
    console.error('CSV 파일 일괄 등록 실패:', error);
    throw error;
  }
}

/**
 * 보수확인서 데이터를 조회하는 API
 * @param {Array<number>} ids 지시 ID 배열
 * @returns {Promise<Array<Object>>} 각 지시에 대한 상세 데이터 객체의 배열 (성공한 요청들만 해당)
 */
export const fetchBosuConfirmationData = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    console.warn('fetchBosuConfirmationData: 유효한 ID 배열이 제공되지 않았습니다.');
    return [];
  }

  try {
    const requests = ids.map(id =>
      api.get(`/instruction/${id}/detail`).catch(error => {
        // 개별 요청 실패 시 에러를 로깅하고 null 또는 특정 에러 객체를 반환하여 Promise.allSettled와 유사하게 처리
        console.error(`Error fetching detail for instruction ID ${id}:`, error);
        return { error, id, status: 'failed' }; // 실패 상태와 ID를 함께 반환
      })
    );

    const results = await Promise.all(requests);

    const successfulData = [];
    results.forEach(result => {
      // 성공적인 응답이고, API 응답 구조에 data.data가 있다고 가정
      if (result && result.data && result.data.data && result.status !== 'failed') {
        successfulData.push(result.data.data);
      } else if (result && result.status === 'failed') {
        // 이미 위에서 에러 로깅됨, 추가 작업이 필요하면 여기에 구현
        console.warn(`Skipping data for instruction ID ${result.id} due to fetch failure.`);
      }
    });

    return successfulData; // 성공적으로 가져온 데이터의 배열만 반환

  } catch (error) {
    // Promise.all 자체에서 발생하는 예외 (네트워크 문제 등 전체 프로미스 체인 실패 시)
    console.error('Error in fetchBosuConfirmationData during Promise.all:', error);
    throw error; // 또는 빈 배열 반환 등 에러 정책에 따라 처리
  }
}

/**
 * 센터명을 기준으로 계약 목록을 조회하는 API
 * @param {string} center - 센터명 (예: "강동", "성북")
 * @returns {Promise<Object>} 계약 목록
 */
export const fetchContractsByCenter = async (center) => {
  try {
    const response = await api.get('/contract', { params: { center } });
    return response.data;
  } catch (error) {
    console.error(`센터 [${center}] 계약 목록 조회 실패:`, error);
    throw error;
  }
}

/**
 * 계약 ID를 기준으로 회차 목록을 조회하는 API
 * @param {number} contractId - 계약 ID
 * @returns {Promise<Object>} 회차 목록
 */
export const getPaymentsByContract = (contractId) => {
  return api.get(`/payment?contractId=${contractId}`);
};

/**
 * 모든 결제 정보 가져오기 (이름 변경 및 수정)
 * @returns {Promise<Object>} 모든 결제 정보
 */
export const getAllPayments = () => api.get("/payment");

/**
 * 계약(회차) 정보 가져오기 (단일)
 * @param {number} id 결제 ID
 * @returns {Promise<Object>} 결제 정보
 */
export const getPayment = (id) => api.get(`/payment/${id}`);

/**
 * 작업자 목록 조회 API
 * @param {Object} params - 쿼리 파라미터 (예: { active: true })
 * @returns {Promise<Object>} 작업자 목록
 */
export const fetchWorkers = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (typeof params.active !== 'undefined') query.append('active', params.active);
    const response = await api.get(`/worker${query.toString() ? `?${query.toString()}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('작업자 목록 조회 실패:', error);
    throw error;
  }
};
