import axios from 'axios'
import api from './index'

// API 기본 URL 설정 (실제 환경에서는 .env 파일에서 가져와야 함)
const API_URL = import.meta.env.VITE_API_URL || '/api'

// mockAPI 지연 시간 설정 (ms)
const MOCK_DELAY = 500

// 모의 데이터 - 실제 API 연동 전까지 사용
const mockInstructions = [
  {
    id: 1,
    title: '강북구 도로 보수 지시',
    priority: 'HIGH',
    status: 'RECEIVED',
    createdAt: '2023-07-15',
    dueDate: '2023-07-25',
    location: '강북구 수유동',
    address: '서울시 강북구 수유동 123-45',
    manager: '홍길동',
    receiver: '김철수',
    channel: 'PHONE',
    description: '강북구 수유동 일대의 도로 파손이 심각하여 긴급 보수 작업이 필요합니다.',
    works: [1, 2],
    favorite: false,
    paymentRound: 1,
    lastModifiedBy: '관리자',
    lastModifiedAt: '2023-07-15'
  },
  {
    id: 2,
    title: '서초구 가로등 교체 지시',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: '2023-07-16',
    dueDate: '2023-07-30',
    location: '서초구 반포대로',
    address: '서울시 서초구 반포대로 123',
    manager: '이영희',
    receiver: '박민수',
    channel: 'EMAIL',
    description: '서초구 반포대로의 가로등이 노후화되어 교체가 필요합니다.',
    works: [1],
    favorite: true,
    paymentRound: 1,
    lastModifiedBy: '담당자',
    lastModifiedAt: '2023-07-16'
  },
  {
    id: 3,
    title: '강남구 보도블럭 교체 지시',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    createdAt: '2023-07-10',
    dueDate: '2023-07-20',
    location: '강남구 삼성동',
    address: '서울시 강남구 삼성동 45-67',
    manager: '정재영',
    receiver: '홍길동',
    channel: 'SYSTEM',
    description: '강남구 삼성동 일대의 보도블럭이 파손되어 보행자 안전을 위협하고 있습니다.',
    works: [2, 3],
    favorite: false,
    paymentRound: 2,
    lastModifiedBy: '관리자',
    lastModifiedAt: '2023-07-20'
  }
]

/**
 * 지시 목록 조회 API
 * @param {Object} params - 검색 및 페이징 파라미터
 * @param {string} params.status - 상태 필터
 * @param {number} params.page - 페이지 번호
 * @param {number} params.size - 페이지 크기
 * @returns {Promise<Object>} 지시 목록
 */
export const fetchInstructions = async (params = {}) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 상태 기반 필터링
        let filteredData = [...mockInstructions];
        
        if (params.status) {
          filteredData = filteredData.filter(instruction => 
            instruction.status === params.status
          );
        }
        
        // 페이징 처리
        const page = params.page || 1;
        const size = params.size || 10;
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        
        resolve({
          message: "요청 성공",
          data: {
            instructionList: {
              instruction: paginatedData,
              totalCount: filteredData.length,
              totalPage: Math.ceil(filteredData.length / size),
              currentPage: page
            }
          }
        });
      }, MOCK_DELAY);
    });
  }

  // 실제 API 호출 (주석 처리)
  /* 
  try {
    const response = await axios.get(`${API_URL}/instruction`, { params });
    return response.data;
  } catch (error) {
    console.error('지시 목록 조회 실패:', error);
    throw error;
  }
  */
}

/**
 * 특정 지시 정보를 조회하는 API
 * @param {number} id 지시 ID
 * @returns {Promise<Object>} 지시 정보
 */
export const fetchInstructionById = async (id) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const instruction = mockInstructions.find(i => i.id === Number(id));
        if (instruction) {
          resolve({
            message: "요청 성공",
            data: {
              instruction: { ...instruction }
            }
          });
        } else {
          reject({
            message: "지시를 찾을 수 없습니다."
          });
        }
      }, MOCK_DELAY);
    });
  }

  // 실제 API 호출 (주석 처리)
  /*
  try {
    const response = await axios.get(`${API_URL}/instruction/${id}`);
    return response.data;
  } catch (error) {
    console.error(`지시 ID ${id} 조회 실패:`, error);
    throw error;
  }
  */
}

/**
 * 새 지시를 생성하는 API
 * @param {Object} instructionData 지시 데이터
 * @returns {Promise<Object>} 생성된 지시 정보
 */
export const createInstruction = async (instructionData) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = mockInstructions.length + 1;
        const newInstruction = {
          id: newId,
          createdAt: new Date().toISOString().split('T')[0],
          lastModifiedAt: new Date().toISOString().split('T')[0],
          lastModifiedBy: '관리자',
          favorite: false,
          ...instructionData.instruction
        };
        
        mockInstructions.push(newInstruction);
        
        resolve({
          message: "요청 성공",
          data: {
            instruction: { ...newInstruction }
          }
        });
      }, MOCK_DELAY);
    });
  }

  // 실제 API 호출 (주석 처리)
  /*
  try {
    const response = await axios.post(`${API_URL}/instruction`, instructionData);
    return response.data;
  } catch (error) {
    console.error('지시 생성 실패:', error);
    throw error;
  }
  */
}

/**
 * 지시 정보를 수정하는 API
 * @param {number} id 지시 ID
 * @param {Object} instructionData 업데이트할 지시 데이터
 * @returns {Promise<Object>} 수정된 지시 정보
 */
export const updateInstruction = async (id, instructionData) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockInstructions.findIndex(i => i.id === Number(id));
        if (index !== -1) {
          mockInstructions[index] = { 
            ...mockInstructions[index], 
            ...instructionData.instruction,
            lastModifiedAt: new Date().toISOString().split('T')[0]
          };
          
          resolve({
            message: "요청 성공",
            data: {
              instruction: { ...mockInstructions[index] }
            }
          });
        } else {
          reject({
            message: "지시를 찾을 수 없습니다."
          });
        }
      }, MOCK_DELAY);
    });
  }

  // 실제 API 호출 (주석 처리)
  /*
  try {
    const response = await axios.put(`${API_URL}/instruction/${id}`, instructionData);
    return response.data;
  } catch (error) {
    console.error(`지시 ID ${id} 수정 실패:`, error);
    throw error;
  }
  */
}

/**
 * 지시 상태를 변경하는 API
 * @param {number} id 지시 ID
 * @param {string} status 새 상태
 * @returns {Promise<Object>} 수정된 지시 정보
 */
export const updateInstructionStatus = async (id, statusData) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockInstructions.findIndex(i => i.id === Number(id));
        if (index !== -1) {
          mockInstructions[index] = { 
            ...mockInstructions[index], 
            status: statusData.status,
            lastModifiedAt: new Date().toISOString().split('T')[0]
          };
          
          resolve({
            message: "요청 성공",
            data: {
              instruction: { ...mockInstructions[index] }
            }
          });
        } else {
          reject({
            message: "지시를 찾을 수 없습니다."
          });
        }
      }, MOCK_DELAY);
    });
  }

  // 실제 API 호출 (주석 처리)
  /*
  try {
    const response = await axios.post(`${API_URL}/instruction/${id}/status`, statusData);
    return response.data;
  } catch (error) {
    console.error(`지시 ID ${id} 상태 변경 실패:`, error);
    throw error;
  }
  */
}

/**
 * 지시 즐겨찾기 상태를 토글하는 API
 * @param {number} id 지시 ID
 * @returns {Promise<Object>} 수정된 지시 정보
 */
export const toggleInstructionFavorite = async (id) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockInstructions.findIndex(i => i.id === Number(id));
        if (index !== -1) {
          mockInstructions[index] = { 
            ...mockInstructions[index], 
            favorite: !mockInstructions[index].favorite,
            lastModifiedAt: new Date().toISOString().split('T')[0]
          };
          
          resolve({
            message: "요청 성공",
            data: {
              instruction: { ...mockInstructions[index] }
            }
          });
        } else {
          reject({
            message: "지시를 찾을 수 없습니다."
          });
        }
      }, MOCK_DELAY);
    });
  }

  // 실제 API 호출 (주석 처리)
  /*
  try {
    const response = await axios.post(`${API_URL}/instruction/${id}/favorite`);
    return response.data;
  } catch (error) {
    console.error(`지시 ID ${id} 즐겨찾기 토글 실패:`, error);
    throw error;
  }
  */
}

/**
 * 지시를 삭제하는 API
 * @param {number} id 지시 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteInstruction = async (id) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockInstructions.findIndex(i => i.id === Number(id));
        if (index !== -1) {
          mockInstructions.splice(index, 1);
          
          resolve({
            message: "요청 성공",
            data: {}
          });
        } else {
          reject({
            message: "지시를 찾을 수 없습니다."
          });
        }
      }, MOCK_DELAY);
    });
  }

  // 실제 API 호출 (주석 처리)
  /*
  try {
    const response = await axios.delete(`${API_URL}/instruction/${id}`);
    return response.data;
  } catch (error) {
    console.error(`지시 ID ${id} 삭제 실패:`, error);
    throw error;
  }
  */
}

/**
 * 지시 확정(기성에 반영) API
 * @param {number} id 지시 ID
 * @returns {Promise<Object>} 확정 결과
 */
export const confirmInstruction = async (id) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockInstructions.findIndex(i => i.id === Number(id));
        if (index !== -1) {
          mockInstructions[index] = { 
            ...mockInstructions[index], 
            status: 'CONFIRMED',
            lastModifiedAt: new Date().toISOString().split('T')[0]
          };
          
          resolve({
            message: "요청 성공",
            data: {
              instruction: { ...mockInstructions[index] }
            }
          });
        } else {
          reject({
            message: "지시를 찾을 수 없습니다."
          });
        }
      }, MOCK_DELAY);
    });
  }

  // 실제 API 호출 (주석 처리)
  /*
  try {
    const response = await axios.post(`${API_URL}/instruction/${id}/confirm`);
    return response.data;
  } catch (error) {
    console.error(`지시 ID ${id} 확정 실패:`, error);
    throw error;
  }
  */
}
