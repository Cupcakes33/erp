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
    status: 'RECEIVED', // 접수 상태
    createdAt: '2023-07-15',
    dueDate: '2023-07-25',
    location: '강북구 수유동',
    dong: '수유동', // 동 필드 추가
    lotNumber: '123-45', // 지번 필드 추가
    address: '서울시 강북구 수유동 123-45',
    manager: '홍길동',
    receiver: '김철수',
    channel: 'PHONE',
    description: '강북구 수유동 일대의 도로 파손이 심각하여 긴급 보수 작업이 필요합니다.', // 세부사항
    workContent: '아스팔트 보수 및 도로 경계석 교체 작업 필요', // 작업내용 필드 추가
    note: '야간 작업 필요', // 비고 필드 추가
    worker: '이영수', // 작업자 필드 추가
    workStatus: '자재 준비 중', // 작업현황 필드 추가
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
    status: 'IN_PROGRESS', // 작업중 상태
    createdAt: '2023-07-16',
    dueDate: '2023-07-30',
    location: '서초구 반포대로',
    dong: '반포동', // 동 필드 추가
    lotNumber: '45-67', // 지번 필드 추가
    address: '서울시 서초구 반포대로 123',
    manager: '이영희',
    receiver: '박민수',
    channel: 'EMAIL',
    description: '서초구 반포대로의 가로등이 노후화되어 교체가 필요합니다.', // 세부사항
    workContent: 'LED 가로등으로 전체 교체 및 전선 정비', // 작업내용 필드 추가
    note: '교통량이 많은 지역으로 안전 조치 필수', // 비고 필드 추가
    worker: '김준호', // 작업자 필드 추가
    workStatus: '가로등 설치 진행 중 (60%)', // 작업현황 필드 추가
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
    status: 'COMPLETED_WORK', // 작업완료 상태 (기존 COMPLETED에서 변경)
    createdAt: '2023-07-10',
    dueDate: '2023-07-20',
    location: '강남구 삼성동',
    dong: '삼성동', // 동 필드 추가
    lotNumber: '78-90', // 지번 필드 추가
    address: '서울시 강남구 삼성동 45-67',
    manager: '정재영',
    receiver: '홍길동',
    channel: 'SYSTEM',
    description: '강남구 삼성동 일대의 보도블럭이 파손되어 보행자 안전을 위협하고 있습니다.', // 세부사항
    workContent: '파손된 보도블럭 교체 및 경계석 재설치', // 작업내용 필드 추가
    note: '민원 다수 접수된 지역으로 신속한 처리 요망', // 비고 필드 추가
    worker: '박성민', // 작업자 필드 추가
    workStatus: '보도블럭 교체 작업 완료, 현장 정리 완료', // 작업현황 필드 추가
    works: [2, 3],
    favorite: false,
    paymentRound: 2,
    lastModifiedBy: '관리자',
    lastModifiedAt: '2023-07-20'
  },
  {
    id: 4,
    title: '송파구 하수도 정비 지시',
    priority: 'HIGH',
    status: 'IN_APPROVAL', // 결재중 상태 추가
    createdAt: '2023-07-05',
    dueDate: '2023-07-15',
    location: '송파구 방이동',
    dong: '방이동', // 동 필드 추가
    lotNumber: '112-5', // 지번 필드 추가
    address: '서울시 송파구 방이동 112-5',
    manager: '김태우',
    receiver: '이지민',
    channel: 'PHONE',
    description: '송파구 방이동 아파트 단지 주변 하수도 역류 문제 발생', // 세부사항
    workContent: '하수관로 준설 및 맨홀 보수 작업', // 작업내용 필드 추가
    note: '우천시 침수 우려 지역으로 신속 처리 요망', // 비고 필드 추가
    worker: '최재혁', // 작업자 필드 추가
    workStatus: '작업 완료 및 결재 제출', // 작업현황 필드 추가
    works: [4, 5],
    favorite: true,
    paymentRound: 3,
    lastModifiedBy: '팀장',
    lastModifiedAt: '2023-07-14'
  },
  {
    id: 5,
    title: '마포구 도로 미끄럼 방지 시설 설치',
    priority: 'LOW',
    status: 'COMPLETED', // 완료 상태
    createdAt: '2023-06-20',
    dueDate: '2023-07-05',
    location: '마포구 성산동',
    dong: '성산동', // 동 필드 추가
    lotNumber: '50-3', // 지번 필드 추가
    address: '서울시 마포구 성산동 50-3',
    manager: '이상철',
    receiver: '김영희',
    channel: 'SYSTEM',
    description: '마포구 성산동 경사로 구간에 미끄럼 방지 시설 필요', // 세부사항
    workContent: '미끄럼 방지 포장 및 안전 표지판 설치', // 작업내용 필드 추가
    note: '겨울철 사고 다발 지역', // 비고 필드 추가
    worker: '장민수', // 작업자 필드 추가
    workStatus: '작업 완료 및 검수 완료', // 작업현황 필드 추가
    works: [6],
    favorite: false,
    paymentRound: 2,
    lastModifiedBy: '부장',
    lastModifiedAt: '2023-07-05'
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
