import axios from 'axios'
import api from './index'

// API 기본 URL 설정 (실제 환경에서는 .env 파일에서 가져와야 함)
const API_URL = import.meta.env.VITE_API_URL || '/api'

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
    
    const response = await axios.get(`${API_URL}/instruction`, { params: apiParams });
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
    const response = await axios.get(`${API_URL}/instruction/${id}`);
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
    const response = await axios.get(`${API_URL}/instruction/${requestId}/detail`, { signal });
    
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
    const response = await axios.post(`${API_URL}/instruction`, instructionData);
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
    const response = await axios.put(`${API_URL}/instruction/${id}`, instructionData);
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
    const response = await axios.put(`${API_URL}/instruction/${id}`, updatedData);
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
    const response = await axios.post(`${API_URL}/instruction/${id}/favorite`);
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
    const response = await axios.delete(`${API_URL}/instruction/${id}`);
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
    const response = await axios.post(`${API_URL}/instruction/${id}/confirm`);
    return response.data;
  } catch (error) {
    console.error(`지시 ID ${id} 확정 실패:`, error);
    throw error;
  }
}

/**
 * 특정 지시에 속한 공종 목록 조회 API
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
    
    // 지시 ID 추가
    apiParams.instruction = instructionId;
    
    const response = await axios.get(`${API_URL}/process`, { params: apiParams });
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
    const response = await axios.get(`${API_URL}/process/${id}`);
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
    const response = await axios.post(`${API_URL}/process?instruction=${instructionId}`, processData);
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
    const response = await axios.put(`${API_URL}/process/${id}`, processData);
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
    const response = await axios.delete(`${API_URL}/process/${id}`);
    return response.data;
  } catch (error) {
    console.error(`공종 ID ${id} 삭제 실패:`, error);
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
    const response = await axios.get(`${API_URL}/task/${id}`);
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
    
    const response = await axios.get(`${API_URL}/task`, { params: apiParams });
    return response.data;
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
    const response = await axios.post(`${API_URL}/task?process=${processId}`, taskData);
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
    const response = await axios.put(`${API_URL}/task/${id}`, taskData);
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
    const response = await axios.delete(`${API_URL}/task/${id}`);
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
    
    const response = await axios.get(`${API_URL}/unit-price`, { params: apiParams });
    return response.data;
  } catch (error) {
    console.error('일위대가 목록 조회 실패:', error);
    throw error;
  }
}
