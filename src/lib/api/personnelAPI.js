import axios from 'axios';

// API 기본 URL 설정 (실제 환경에서는 .env 파일에서 가져와야 함)
const API_URL = import.meta.env.VITE_API_URL || '/api';

// 모의 데이터 - 실제 API 연동 전까지 사용
const mockWorkers = [
  { id: 1, name: '홍길동', birthDate: '1980-05-15', phone: '010-1234-5678', position: '반장', status: '재직' },
  { id: 2, name: '김철수', birthDate: '1985-10-20', phone: '010-2345-6789', position: '작업자', status: '재직' },
  { id: 3, name: '이영희', birthDate: '1990-03-25', phone: '010-3456-7890', position: '작업자', status: '재직' },
  { id: 4, name: '박민수', birthDate: '1975-12-10', phone: '010-4567-8901', position: '작업자', status: '퇴사' },
  { id: 5, name: '정재영', birthDate: '1982-07-30', phone: '010-5678-9012', position: '반장', status: '퇴사' },
];

// mockAPI 지연 시간 설정 (ms)
const MOCK_DELAY = 500;

/**
 * 모든 작업자 목록을 가져오는 함수
 * @returns {Promise<Array>} 작업자 배열
 */
export const fetchWorkers = async () => {
  // 디버깅을 위한 로그
  console.log("[personnelAPI] fetchWorkers 함수 호출됨");
  
  // 강제로 모의 데이터 사용
  console.log("[personnelAPI] mock 데이터 사용 - mockWorkers:", mockWorkers);
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = [...mockWorkers]; // 배열 복사본 생성
      console.log("[personnelAPI] 반환할 데이터:", result);
      resolve(result);
    }, 500);
  });
  
  // 아래 코드는 실행되지 않음
  try {
    const response = await axios.get(`${API_URL}/personnel`);
    return response.data;
  } catch (error) {
    console.error('작업자 목록 가져오기 실패:', error);
    throw error;
  }
};

/**
 * 특정 작업자 정보를 가져오는 함수
 * @param {number} id 작업자 ID
 * @returns {Promise<Object>} 작업자 정보
 */
export const fetchWorkerById = async (id) => {
  // 디버깅을 위한 로그
  console.log("[personnelAPI] fetchWorkerById 함수 호출됨, id:", id);
  
  // 강제로 모의 데이터 사용
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Number로 변환 (id가 문자열로 전달될 수 있음)
      const numId = typeof id === 'string' ? parseInt(id, 10) : id;
      const worker = mockWorkers.find(w => w.id === numId);
      console.log("[personnelAPI] 찾은 작업자 데이터:", worker);
      if (worker) {
        resolve({ ...worker });
      } else {
        console.error("[personnelAPI] 작업자를 찾을 수 없음, id:", id);
        reject(new Error('작업자를 찾을 수 없습니다.'));
      }
    }, 500);
  });
  
  // 아래 코드는 실행되지 않음
  try {
    const response = await axios.get(`${API_URL}/personnel/${id}`);
    return response.data;
  } catch (error) {
    console.error(`작업자 ID ${id} 가져오기 실패:`, error);
    throw error;
  }
};

/**
 * 새 작업자를 생성하는 함수
 * @param {Object} workerData 작업자 데이터
 * @returns {Promise<Object>} 생성된 작업자 정보
 */
export const createWorker = async (workerData) => {
  // 디버깅을 위한 로그
  console.log("[personnelAPI] createWorker 함수 호출됨, 데이터:", workerData);
  
  // 강제로 모의 데이터 사용
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = Math.max(...mockWorkers.map(w => w.id)) + 1;
      const newWorker = {
        id: newId,
        ...workerData
      };
      mockWorkers.push(newWorker);
      console.log("[personnelAPI] 새 작업자 생성됨:", newWorker);
      resolve({ ...newWorker });
    }, 500);
  });
  
  // 아래 코드는 실행되지 않음
  try {
    const response = await axios.post(`${API_URL}/personnel`, workerData);
    return response.data;
  } catch (error) {
    console.error('작업자 생성 실패:', error);
    throw error;
  }
};

/**
 * 작업자 정보를 수정하는 함수
 * @param {number} id 작업자 ID
 * @param {Object} workerData 업데이트할 작업자 데이터
 * @returns {Promise<Object>} 수정된 작업자 정보
 */
export const updateWorker = async (id, workerData) => {
  // 디버깅을 위한 로그
  console.log("[personnelAPI] updateWorker 함수 호출됨, id:", id, "데이터:", workerData);
  
  // 강제로 모의 데이터 사용
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Number로 변환 (id가 문자열로 전달될 수 있음)
      const numId = typeof id === 'string' ? parseInt(id, 10) : id;
      const index = mockWorkers.findIndex(w => w.id === numId);
      if (index !== -1) {
        mockWorkers[index] = { ...mockWorkers[index], ...workerData };
        console.log("[personnelAPI] 작업자 업데이트됨:", mockWorkers[index]);
        resolve({ ...mockWorkers[index] });
      } else {
        console.error("[personnelAPI] 작업자를 찾을 수 없음, id:", id);
        reject(new Error('작업자를 찾을 수 없습니다.'));
      }
    }, 500);
  });
  
  // 아래 코드는 실행되지 않음
  try {
    const response = await axios.put(`${API_URL}/personnel/${id}`, workerData);
    return response.data;
  } catch (error) {
    console.error(`작업자 ID ${id} 수정 실패:`, error);
    throw error;
  }
};

/**
 * 작업자 상태를 변경하는 함수 (재직/퇴사)
 * @param {number} id 작업자 ID
 * @returns {Promise<Object>} 수정된 작업자 정보
 */
export const toggleWorkerStatus = async (id) => {
  // 디버깅을 위한 로그
  console.log("[personnelAPI] toggleWorkerStatus 함수 호출됨, id:", id);
  
  // 강제로 모의 데이터 사용
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Number로 변환 (id가 문자열로 전달될 수 있음)
      const numId = typeof id === 'string' ? parseInt(id, 10) : id;
      const index = mockWorkers.findIndex(w => w.id === numId);
      if (index !== -1) {
        const newStatus = mockWorkers[index].status === '재직' ? '퇴사' : '재직';
        mockWorkers[index] = { ...mockWorkers[index], status: newStatus };
        console.log("[personnelAPI] 작업자 상태 변경됨:", mockWorkers[index]);
        resolve({ ...mockWorkers[index] });
      } else {
        console.error("[personnelAPI] 작업자를 찾을 수 없음, id:", id);
        reject(new Error('작업자를 찾을 수 없습니다.'));
      }
    }, 500);
  });
  
  // 아래 코드는 실행되지 않음
  try {
    const worker = await fetchWorkerById(id);
    const newStatus = worker.status === '재직' ? '퇴사' : '재직';
    const response = await axios.patch(`${API_URL}/personnel/${id}/status`, { status: newStatus });
    return response.data;
  } catch (error) {
    console.error(`작업자 ID ${id} 상태 변경 실패:`, error);
    throw error;
  }
}; 