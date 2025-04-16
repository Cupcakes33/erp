import axios from 'axios';

// API 기본 URL 설정 (실제 환경에서는 .env 파일에서 가져와야 함)
const API_URL = import.meta.env.VITE_API_URL || '/api';

// mockAPI 지연 시간 설정 (ms)
const MOCK_DELAY = 500;

// 모의 데이터 - 실제 API 연동 전까지 사용
const mockWorkers = [
  { 
    id: 1, 
    name: '홍길동', 
    birth: '1980-05-15', 
    phone: '010-1234-5678', 
    position: '반장', 
    status: 'ACTIVE' 
  },
  { 
    id: 2, 
    name: '김철수', 
    birth: '1985-10-20', 
    phone: '010-2345-6789', 
    position: '작업자', 
    status: 'ACTIVE' 
  },
  { 
    id: 3, 
    name: '이영희', 
    birth: '1990-03-25', 
    phone: '010-3456-7890', 
    position: '작업자', 
    status: 'ACTIVE' 
  },
  { 
    id: 4, 
    name: '박민수', 
    birth: '1975-12-10', 
    phone: '010-4567-8901', 
    position: '작업자', 
    status: 'RESIGNED' 
  },
  { 
    id: 5, 
    name: '정재영', 
    birth: '1982-07-30', 
    phone: '010-5678-9012', 
    position: '반장', 
    status: 'RESIGNED' 
  },
  ...Array.from({ length: 95 }, (_, i) => ({
    id: i + 6,
    name: `작업자${i + 6}`,
    birth: `${1970 + Math.floor(Math.random() * 30)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    phone: `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    position: Math.random() > 0.8 ? '반장' : '작업자',
    status: Math.random() > 0.2 ? 'ACTIVE' : 'RESIGNED'
  })),
];

/**
 * 작업자 목록을 조회하는 API
 * @param {Object} params - 검색 및 페이징 파라미터
 * @param {string} params.keyword - 검색어 (이름)
 * @param {string} params.status - 상태 필터 (ACTIVE, RESIGNED)
 * @param {number} params.page - 페이지 번호
 * @param {number} params.size - 페이지 크기
 * @returns {Promise<Object>} 작업자 목록
 */
export const fetchWorkers = async (params = {}) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 검색어 및 상태 기반 필터링
        let filteredData = [...mockWorkers];
        
        if (params.keyword) {
          const keyword = params.keyword.toLowerCase();
          filteredData = filteredData.filter(worker => 
            worker.name.toLowerCase().includes(keyword)
          );
        }
        
        if (params.status) {
          filteredData = filteredData.filter(worker => 
            worker.status === params.status
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
            workerList: {
              worker: paginatedData,
              totalCount: filteredData.length,
              totalPage: Math.ceil(filteredData.length / size),
              currentPage: page
            }
          }
        });
      }, MOCK_DELAY);
    });
  }

  // 실제 API 호출
  try {
    const response = await axios.get(`${API_URL}/worker`, { params });
    return response.data;
  } catch (error) {
    console.error('작업자 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 작업자를 생성하는 API
 * @param {Object} workerData - 작업자 데이터
 * @param {string} workerData.name - 작업자 이름
 * @param {string} workerData.birth - 생년월일 (YYYY-MM-DD)
 * @param {string} workerData.phone - 연락처
 * @param {string} workerData.position - 직책
 * @returns {Promise<Object>} 생성된 작업자 정보
 */
export const createWorker = async (workerData) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 필수 필드 검증
        if (!workerData.worker.name || !workerData.worker.birth || !workerData.worker.phone) {
          reject({
            message: "필수 입력값이 누락되었습니다."
          });
          return;
        }
        
        const newId = Math.max(...mockWorkers.map(w => w.id)) + 1;
        const newWorker = {
          id: newId,
          ...workerData.worker,
          status: 'ACTIVE' // 기본값은 재직 중
        };
        
        mockWorkers.push(newWorker);
        
        resolve({
          message: "요청 성공",
          data: {
            worker: { ...newWorker }
          }
        });
      }, MOCK_DELAY);
    });
  }

  // 실제 API 호출
  try {
    const response = await axios.post(`${API_URL}/worker`, workerData);
    return response.data;
  } catch (error) {
    console.error('작업자 생성 실패:', error);
    throw error;
  }
};

/**
 * 작업자 정보를 수정하는 API
 * @param {number} id - 작업자 ID
 * @param {Object} workerData - 수정할 작업자 데이터
 * @returns {Promise<Object>} 수정된 작업자 정보
 */
export const updateWorker = async (id, workerData) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockWorkers.findIndex(worker => worker.id === Number(id));
        if (index !== -1) {
          // 기존 데이터와 병합
          const updatedWorker = {
            ...mockWorkers[index],
            ...workerData.worker
          };
          
          mockWorkers[index] = updatedWorker;
          
          resolve({
            message: "요청 성공",
            data: {
              worker: { ...updatedWorker }
            }
          });
        } else {
          reject({
            message: "작업자를 찾을 수 없습니다."
          });
        }
      }, MOCK_DELAY);
    });
  }

  // 실제 API 호출
  try {
    const response = await axios.put(`${API_URL}/worker/${id}`, workerData);
    return response.data;
  } catch (error) {
    console.error(`작업자 ID ${id} 수정 실패:`, error);
    throw error;
  }
};

/**
 * 작업자 재직 상태를 변경하는 API
 * @param {number} id - 작업자 ID
 * @param {Object} statusData - 상태 데이터
 * @param {string} statusData.status - 변경할 상태 ('ACTIVE' 또는 'RESIGNED')
 * @returns {Promise<Object>} 수정된 작업자 정보
 */
export const updateWorkerStatus = async (id, statusData) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockWorkers.findIndex(worker => worker.id === Number(id));
        if (index !== -1) {
          // 상태 업데이트
          mockWorkers[index] = {
            ...mockWorkers[index],
            status: statusData.status
          };
          
          resolve({
            message: "요청 성공",
            data: {
              worker: { ...mockWorkers[index] }
            }
          });
        } else {
          reject({
            message: "작업자를 찾을 수 없습니다."
          });
        }
      }, MOCK_DELAY);
    });
  }

  // 실제 API 호출
  try {
    const response = await axios.post(`${API_URL}/worker/${id}/status`, statusData);
    return response.data;
  } catch (error) {
    console.error(`작업자 ID ${id} 상태 변경 실패:`, error);
    throw error;
  }
};

// 기존 API와의 호환성을 위한 함수들

/**
 * 특정 작업자 정보를 가져오는 함수 (호환성 유지)
 * @param {number} id 작업자 ID
 * @returns {Promise<Object>} 작업자 정보
 */
export const fetchWorkerById = async (id) => {
  // 개발 환경에서는 모의 데이터 사용
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Number로 변환 (id가 문자열로 전달될 수 있음)
      const numId = typeof id === 'string' ? parseInt(id, 10) : id;
      const worker = mockWorkers.find(w => w.id === numId);
      
      if (worker) {
        resolve({ 
          message: "요청 성공",
          data: {
            worker: { ...worker }
          }
        });
      } else {
        reject({
          message: "작업자를 찾을 수 없습니다."
        });
      }
    }, MOCK_DELAY);
  });
};

/**
 * 작업자 상태를 변경하는 함수 (호환성 유지)
 * @param {number} id 작업자 ID
 * @returns {Promise<Object>} 수정된 작업자 정보
 */
export const toggleWorkerStatus = async (id) => {
  // 개발 환경에서는 모의 데이터 사용
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Number로 변환 (id가 문자열로 전달될 수 있음)
      const numId = typeof id === 'string' ? parseInt(id, 10) : id;
      const index = mockWorkers.findIndex(w => w.id === numId);
      
      if (index !== -1) {
        const newStatus = mockWorkers[index].status === 'ACTIVE' ? 'RESIGNED' : 'ACTIVE';
        mockWorkers[index] = { ...mockWorkers[index], status: newStatus };
        
        resolve({ 
          message: "요청 성공",
          data: {
            worker: { ...mockWorkers[index] }
          }
        });
      } else {
        reject({
          message: "작업자를 찾을 수 없습니다."
        });
      }
    }, MOCK_DELAY);
  });
}; 