import axios from 'axios'
import api from '.'

/**
 * 지시 목록 조회 API
 * @param {Object} params - 검색 및 페이징 파라미터
 * @param {string} params.status - 상태 필터
 * @param {number} params.page - 페이지 번호
 * @param {number} params.size - 페이지 크기
 * @param {string} params.keyword - 검색 키워드
 * @param {string} params.searchType - 검색 타입 (all, dong, lotNumber)
 * @param {string} params.startDate - 시작 날짜
 * @param {string} params.endDate - 종료 날짜
 * @returns {Promise<Object>} 지시 목록
 */
export const fetchInstructions = async (params = {}) => {
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
    
    // 임시로 id를 2로 고정
    const requestId = 2; // id 대신 고정값 사용
    
    // 실제 API 호출
    const response = await api.get(`/instruction/${requestId}/detail`, { signal });
    
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
 * @param {Object} instructionData 지시 데이터
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
 * @param {Object} instructionData 업데이트할 지시 데이터
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
 * @returns {Promise<Object>} 확정 결과
 */
export const confirmInstruction = async (id) => {
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
 * 공종별 작업 목록 조회 API
 * @param {number} processId 공종 ID
 * @param {Object} params 페이징 파라미터
 * @param {number} params.page 페이지 번호
 * @param {number} params.size 페이지 크기
 * @returns {Promise<Object>} 작업 목록
 */
export const fetchTasksByProcess = async (processId, params = {}) => {
  try {
    // 페이지 번호가 1부터 시작하는 경우 0부터 시작하도록 변환
    const apiParams = { ...params };
    if (apiParams.page) {
      apiParams.page = apiParams.page - 1;
    }
    
    // 공종 ID 추가
    apiParams.process = processId;
    
    const response = await api.get(`/task`, { params: apiParams });
    return response.data;
  } catch (error) {
    console.error(`공종 ID ${processId}의 작업 목록 조회 실패:`, error);
    throw error;
  }
}

export const tempFetchTasksByProcess = async (processId) => {
  try {
    const response = await api.get(`/instruction/${processId}/tasks`)
    return response.data
  } catch (error) {
    console.error(`공종 ID ${processId}의 작업 목록 조회 실패:`, error);
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
 * CSV 파일을 이용한 지시 일괄 등록 API
 * @param {File} csvFile CSV 파일
 * @returns {Promise<Object>} 일괄 등록 결과
 */
export const uploadCsvBulkInstructions = async (csvFile) => {
  try {
    // FormData 객체 생성
    const formData = new FormData();
    formData.append('file', csvFile);
    
    // 파일 전송 요청 헤더
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    
    const response = await api.post(`/instruction/bulk-upload`, formData, config);
    return response.data;
  } catch (error) {
    console.error('CSV 파일 일괄 등록 실패:', error);
    throw error;
  }
}

/**
 * 보수확인서 데이터를 조회하는 API
 * @param {Array<number>} ids 지시 ID 배열
 * @returns {Promise<Object>} 보수확인서 데이터
 */
export const fetchBosuConfirmationData = async (ids) => {
  try {
    // API 요청 대신 더미 데이터 반환
    console.log('선택된 지시 ID 목록:', ids);
    
    // 더미 데이터 생성 - BosuConfirmationPDF 컴포넌트에 맞게 조정
    const dummyData = {
      data: ids.map((id, index) => ({
        id: id.toString(),
        orderNumber: `경북2025-단가-${1000 + index}`,
        orderDate: "2025.02.11",
        name: `우이동 21-${16 + index} ${500 + index}호 방 창가 단열불량 보수`,
        structure: "철근콘크리트조",
        processes: [
          {
            processName: "건축-수장공사",
            endDate: "2025.02.24",
            tasks: [
              {
                code: `3101${50 + index}`,
                name: "실크벽지 도배바탕(합판,석고보드면)",
                spec: "벽면",
                unit: "M2",
                unitCount: 1.5 + index,
                calculationDetails: "보수부위 면적산출",
                unitPriceId: "AB12C",
                materialCost: 15000 + index * 1000,
                materialPrice: 18000 + index * 1200,
                laborCost: 25000 + index * 800,
                laborPrice: 30000 + index * 1000,
                expense: 5000 + index * 300,
                expensePrice: 6000 + index * 400,
                totalCost: 45000 + index * 2100,
                totalPrice: 54000 + index * 2600
              },
              {
                code: `3101${60 + index}`,
                name: "열반사단열재",
                spec: "20mm",
                unit: "M2",
                unitCount: 2.0 + index * 0.5,
                calculationDetails: "단열보강 부위",
                unitPriceId: "CD34E",
                materialCost: 22000 + index * 1500,
                materialPrice: 26400 + index * 1800,
                laborCost: 18000 + index * 1200,
                laborPrice: 21600 + index * 1440,
                expense: 4000 + index * 300,
                expensePrice: 4800 + index * 360, 
                totalCost: 44000 + index * 3000,
                totalPrice: 52800 + index * 3600
              }
            ]
          },
          {
            processName: "마감보수공사",
            endDate: "2025.02.26",
            tasks: [
              {
                code: `3102${70 + index}`,
                name: "걸레받이 설치",
                spec: "목재 12mm",
                unit: "M",
                unitCount: 3.0 + index * 0.3,
                calculationDetails: "벽체 하단부",
                unitPriceId: "EF56G",
                materialCost: 12000 + index * 800,
                materialPrice: 14400 + index * 960,
                laborCost: 15000 + index * 1000,
                laborPrice: 18000 + index * 1200,
                expense: 3000 + index * 200,
                expensePrice: 3600 + index * 240,
                totalCost: 30000 + index * 2000,
                totalPrice: 36000 + index * 2400
              }
            ]
          }
        ],
        // RepairConfirmationPDF용 데이터도 유지
        title: "시설물 보수확인서 제출",
        receiver: "서울주택도시공사 성북주거안심센터장",
        sender: "주식회사 종합종합안전기술연구원",
        repairItems: [
          {
            code: `3101${50 + index}`,
            category: "건축-수장-단열층",
            facility: `다가구매입임대(강북구) 01${20 + index} - 0${500 + index}`,
            repairDate: "2025.02.24",
          },
          {
            code: `3101${60 + index}`,
            category: "건축-수장-도배",
            facility: `다가구매입임대(강북구) 01${20 + index} - 0${500 + index}`,
            repairDate: "2025.02.24",
          },
        ],
        quantityItems: [
          {
            title: `우이동 21-${16 + index} ${500 + index}호 방 창가 단열불량 보수`,
            workName: "실크벽지 도배바탕(합판,석고보드면)-불가포함,초배지미실",
            specification: "벽면",
            unit: "M2",
            quantity: 1 + index,
            marker: "건축No.9",
          },
          {
            title: "",
            workName: "열반사단열재",
            specification: "20mm",
            unit: "M2",
            quantity: 1 + index,
            marker: "노원도봉1신7",
          },
        ],
        printDate: "2025.03.21 09:19",
      })),
      message: "보수확인서 데이터 조회 성공"
    };
    
    console.log('더미 데이터 생성됨:', dummyData);
    
    return dummyData;
  } catch (error) {
    console.error('보수확인서 데이터 조회 실패:', error);
    throw error;
  }
}
