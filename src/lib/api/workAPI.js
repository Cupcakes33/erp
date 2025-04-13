import axios from 'axios'

// API 기본 URL 설정 (실제 환경에서는 .env 파일에서 가져와야 함)
const API_URL = import.meta.env.VITE_API_URL || '/api'

// mockAPI 지연 시간 설정 (ms)
const MOCK_DELAY = 500

// 모의 데이터 - 실제 API 연동 전까지 사용
const mockWorks = [
  {
    id: 'W-001',
    typeId: 'TP-001',
    typeName: '아스팔트 포장',
    specification: '두께 50mm',
    unit: '㎡',
    materialCost: 15000,
    laborCost: 25000,
    expenseCost: 5000,
    totalCost: 45000
  },
  {
    id: 'W-002',
    typeId: 'TP-002',
    typeName: '보도블럭 설치',
    specification: '300x300mm',
    unit: '㎡',
    materialCost: 20000,
    laborCost: 30000,
    expenseCost: 3000,
    totalCost: 53000
  },
  {
    id: 'W-003',
    typeId: 'TP-003',
    typeName: '가로등 교체',
    specification: 'LED 100W',
    unit: '개',
    materialCost: 150000,
    laborCost: 50000,
    expenseCost: 10000,
    totalCost: 210000
  },
  {
    id: 'W-004',
    typeId: 'TP-004',
    typeName: '맨홀 정비',
    specification: '직경 600mm',
    unit: '개',
    materialCost: 70000,
    laborCost: 40000,
    expenseCost: 5000,
    totalCost: 115000
  },
  {
    id: 'W-005',
    typeId: 'TP-005',
    typeName: '수도관 교체',
    specification: '직경 100mm',
    unit: 'm',
    materialCost: 25000,
    laborCost: 35000,
    expenseCost: 5000,
    totalCost: 65000
  }
]

/**
 * 모든 작업 목록을 가져오는 함수
 * @returns {Promise<Array>} 작업 배열
 */
export const fetchWorks = async () => {
  // 디버깅을 위한 로그
  console.log("[workAPI] fetchWorks 함수 호출됨");
  
  // 강제로 모의 데이터 사용
  console.log("[workAPI] mock 데이터 사용 - mockWorks:", mockWorks);
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = [...mockWorks]; // 배열 복사본 생성
      console.log("[workAPI] 반환할 데이터:", result);
      resolve(result);
    }, 500);
  });
  
  // 아래 코드는 실행되지 않음
  try {
    const response = await axios.get(`${API_URL}/works`);
    return response.data;
  } catch (error) {
    console.error('작업 목록 가져오기 실패:', error);
    throw error;
  }
}

/**
 * 특정 작업 정보를 가져오는 함수
 * @param {string} id 작업 ID
 * @returns {Promise<Object>} 작업 정보
 */
export const fetchWorkById = async (id) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const work = mockWorks.find(w => w.id === id)
        if (work) {
          resolve({ ...work })
        } else {
          reject(new Error('작업을 찾을 수 없습니다.'))
        }
      }, MOCK_DELAY)
    })
  }

  // 실제 API 호출
  try {
    const response = await axios.get(`${API_URL}/works/${id}`)
    return response.data
  } catch (error) {
    console.error(`작업 ID ${id} 가져오기 실패:`, error)
    throw error
  }
}

/**
 * 새 작업을 생성하는 함수
 * @param {Object} workData 작업 데이터
 * @returns {Promise<Object>} 생성된 작업 정보
 */
export const createWork = async (workData) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = `W-${String(mockWorks.length + 1).padStart(3, '0')}`
        const newWork = {
          id: newId,
          ...workData,
          totalCost: Number(workData.materialCost || 0) + Number(workData.laborCost || 0) + Number(workData.expenseCost || 0)
        }
        mockWorks.push(newWork)
        resolve({ ...newWork })
      }, MOCK_DELAY)
    })
  }

  // 실제 API 호출
  try {
    const response = await axios.post(`${API_URL}/works`, workData)
    return response.data
  } catch (error) {
    console.error('작업 생성 실패:', error)
    throw error
  }
}

/**
 * 작업 정보를 수정하는 함수
 * @param {string} id 작업 ID
 * @param {Object} workData 업데이트할 작업 데이터
 * @returns {Promise<Object>} 수정된 작업 정보
 */
export const updateWork = async (id, workData) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockWorks.findIndex(w => w.id === id)
        if (index !== -1) {
          const updatedWork = {
            ...mockWorks[index],
            ...workData,
            totalCost: 
              Number(workData.materialCost !== undefined ? workData.materialCost : mockWorks[index].materialCost) +
              Number(workData.laborCost !== undefined ? workData.laborCost : mockWorks[index].laborCost) +
              Number(workData.expenseCost !== undefined ? workData.expenseCost : mockWorks[index].expenseCost)
          }
          mockWorks[index] = updatedWork
          resolve({ ...updatedWork })
        } else {
          reject(new Error('작업을 찾을 수 없습니다.'))
        }
      }, MOCK_DELAY)
    })
  }

  // 실제 API 호출
  try {
    const response = await axios.put(`${API_URL}/works/${id}`, workData)
    return response.data
  } catch (error) {
    console.error(`작업 ID ${id} 수정 실패:`, error)
    throw error
  }
}

/**
 * 작업을 삭제하는 함수
 * @param {string} id 작업 ID
 * @returns {Promise<string>} 삭제된 작업 ID
 */
export const deleteWork = async (id) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockWorks.findIndex(w => w.id === id)
        if (index !== -1) {
          mockWorks.splice(index, 1)
          resolve(id)
        } else {
          reject(new Error('작업을 찾을 수 없습니다.'))
        }
      }, MOCK_DELAY)
    })
  }

  // 실제 API 호출
  try {
    await axios.delete(`${API_URL}/works/${id}`)
    return id
  } catch (error) {
    console.error(`작업 ID ${id} 삭제 실패:`, error)
    throw error
  }
}

/**
 * 특정 지시에 포함된 작업 목록을 가져오는 함수
 * @param {string} instructionId 지시 ID
 * @returns {Promise<Array>} 작업 배열
 */
export const fetchWorksByInstruction = async (instructionId) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 실제로는 백엔드에서 필터링하지만, 여기서는 간단한 모의 구현
        const filteredWorks = mockWorks.filter((_, index) => index < 3)
        resolve(filteredWorks)
      }, MOCK_DELAY)
    })
  }

  // 실제 API 호출
  try {
    const response = await axios.get(`${API_URL}/instructions/${instructionId}/works`)
    return response.data
  } catch (error) {
    console.error(`지시 ID ${instructionId}의 작업 목록 가져오기 실패:`, error)
    throw error
  }
}

/**
 * 일일 작업 보고서 추가하는 함수
 * @param {string} workId 작업 ID
 * @param {Object} reportData 보고서 데이터
 * @returns {Promise<Object>} 생성된 보고서 정보
 */
export const addDailyReport = async (workId, reportData) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReport = {
          id: Math.floor(Math.random() * 10000),
          workId,
          ...reportData,
          date: reportData.date || new Date().toISOString().split('T')[0]
        }
        resolve(newReport)
      }, MOCK_DELAY)
    })
  }

  // 실제 API 호출
  try {
    const response = await axios.post(`${API_URL}/works/${workId}/reports`, reportData)
    return response.data
  } catch (error) {
    console.error(`작업 ID ${workId}에 보고서 추가 실패:`, error)
    throw error
  }
}
