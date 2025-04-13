import axios from 'axios'
import api from './index'

// API 기본 URL 설정 (실제 환경에서는 .env 파일에서 가져와야 함)
const API_URL = import.meta.env.VITE_API_URL || '/api'

// mockAPI 지연 시간 설정 (ms)
const MOCK_DELAY = 500

// 모의 데이터 - 실제 API 연동 전까지 사용
const mockInstructions = [
  {
    id: 'INS-2023-0001',
    title: '강북구 도로 보수 지시',
    priority: '높음',
    status: '접수',
    createdAt: '2023-07-15',
    dueDate: '2023-07-25',
    location: '강북구 수유동',
    address: '서울시 강북구 수유동 123-45',
    manager: '홍길동',
    receiver: '김철수',
    channel: '전화',
    description: '강북구 수유동 일대의 도로 파손이 심각하여 긴급 보수 작업이 필요합니다.',
    works: ['W-001', 'W-002'],
    favorite: false,
    paymentRound: '1',
    lastModifiedBy: '관리자',
    lastModifiedAt: '2023-07-15'
  },
  {
    id: 'INS-2023-0002',
    title: '서초구 가로등 교체 지시',
    priority: '중간',
    status: '작업중',
    createdAt: '2023-07-16',
    dueDate: '2023-07-30',
    location: '서초구 반포대로',
    address: '서울시 서초구 반포대로 123',
    manager: '이영희',
    receiver: '박민수',
    channel: '이메일',
    description: '서초구 반포대로의 가로등이 노후화되어 교체가 필요합니다.',
    works: ['W-001'],
    favorite: true,
    paymentRound: '1',
    lastModifiedBy: '담당자',
    lastModifiedAt: '2023-07-16'
  },
  {
    id: 'INS-2023-0003',
    title: '강남구 보도블럭 교체 지시',
    priority: '중간',
    status: '완료',
    createdAt: '2023-07-10',
    dueDate: '2023-07-20',
    location: '강남구 삼성동',
    address: '서울시 강남구 삼성동 45-67',
    manager: '정재영',
    receiver: '홍길동',
    channel: '시스템',
    description: '강남구 삼성동 일대의 보도블럭이 파손되어 보행자 안전을 위협하고 있습니다.',
    works: ['W-002', 'W-003'],
    favorite: false,
    paymentRound: '2',
    lastModifiedBy: '관리자',
    lastModifiedAt: '2023-07-20'
  }
]

/**
 * 모든 지시 목록을 가져오는 함수
 * @returns {Promise<Array>} 지시 배열
 */
export const fetchInstructions = async () => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockInstructions])
      }, MOCK_DELAY)
    })
  }

  // 실제 API 호출
  try {
    const response = await axios.get(`${API_URL}/instructions`)
    return response.data
  } catch (error) {
    console.error('지시 목록 가져오기 실패:', error)
    throw error
  }
}

/**
 * 특정 지시 정보를 가져오는 함수
 * @param {string} id 지시 ID
 * @returns {Promise<Object>} 지시 정보
 */
export const fetchInstructionById = async (id) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const instruction = mockInstructions.find(i => i.id === id)
        if (instruction) {
          resolve({ ...instruction })
        } else {
          reject(new Error('지시를 찾을 수 없습니다.'))
        }
      }, MOCK_DELAY)
    })
  }

  // 실제 API 호출
  try {
    const response = await axios.get(`${API_URL}/instructions/${id}`)
    return response.data
  } catch (error) {
    console.error(`지시 ID ${id} 가져오기 실패:`, error)
    throw error
  }
}

/**
 * 새 지시를 생성하는 함수
 * @param {Object} instructionData 지시 데이터
 * @returns {Promise<Object>} 생성된 지시 정보
 */
export const createInstruction = async (instructionData) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = `INS-2023-${String(mockInstructions.length + 1).padStart(4, '0')}`
        const newInstruction = {
          id: newId,
          createdAt: new Date().toISOString().split('T')[0],
          lastModifiedAt: new Date().toISOString().split('T')[0],
          lastModifiedBy: '관리자',
          favorite: false,
          ...instructionData
        }
        mockInstructions.push(newInstruction)
        resolve({ ...newInstruction })
      }, MOCK_DELAY)
    })
  }

  // 실제 API 호출
  try {
    const response = await axios.post(`${API_URL}/instructions`, instructionData)
    return response.data
  } catch (error) {
    console.error('지시 생성 실패:', error)
    throw error
  }
}

/**
 * 지시 정보를 수정하는 함수
 * @param {string} id 지시 ID
 * @param {Object} instructionData 업데이트할 지시 데이터
 * @returns {Promise<Object>} 수정된 지시 정보
 */
export const updateInstruction = async (id, instructionData) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockInstructions.findIndex(i => i.id === id)
        if (index !== -1) {
          mockInstructions[index] = { 
            ...mockInstructions[index], 
            ...instructionData,
            lastModifiedAt: new Date().toISOString().split('T')[0]
          }
          resolve({ ...mockInstructions[index] })
        } else {
          reject(new Error('지시를 찾을 수 없습니다.'))
        }
      }, MOCK_DELAY)
    })
  }

  // 실제 API 호출
  try {
    const response = await axios.put(`${API_URL}/instructions/${id}`, instructionData)
    return response.data
  } catch (error) {
    console.error(`지시 ID ${id} 수정 실패:`, error)
    throw error
  }
}

/**
 * 지시 상태를 변경하는 함수
 * @param {string} id 지시 ID
 * @param {string} status 새 상태
 * @returns {Promise<Object>} 수정된 지시 정보
 */
export const updateInstructionStatus = async (id, status) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockInstructions.findIndex(i => i.id === id)
        if (index !== -1) {
          mockInstructions[index] = { 
            ...mockInstructions[index], 
            status,
            lastModifiedAt: new Date().toISOString().split('T')[0]
          }
          resolve({ ...mockInstructions[index] })
        } else {
          reject(new Error('지시를 찾을 수 없습니다.'))
        }
      }, MOCK_DELAY)
    })
  }

  // 실제 API 호출
  try {
    const response = await axios.patch(`${API_URL}/instructions/${id}/status`, { status })
    return response.data
  } catch (error) {
    console.error(`지시 ID ${id} 상태 변경 실패:`, error)
    throw error
  }
}

/**
 * 지시 즐겨찾기 토글 함수
 * @param {string} id 지시 ID
 * @returns {Promise<Object>} 수정된 지시 정보
 */
export const toggleInstructionFavorite = async (id) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockInstructions.findIndex(i => i.id === id)
        if (index !== -1) {
          const newFavorite = !mockInstructions[index].favorite
          mockInstructions[index] = { 
            ...mockInstructions[index], 
            favorite: newFavorite,
            lastModifiedAt: new Date().toISOString().split('T')[0]
          }
          resolve({ ...mockInstructions[index] })
        } else {
          reject(new Error('지시를 찾을 수 없습니다.'))
        }
      }, MOCK_DELAY)
    })
  }

  // 실제 API 호출
  try {
    const response = await axios.patch(`${API_URL}/instructions/${id}/favorite`)
    return response.data
  } catch (error) {
    console.error(`지시 ID ${id} 즐겨찾기 변경 실패:`, error)
    throw error
  }
}

/**
 * 지시를 삭제하는 함수
 * @param {string} id 지시 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteInstruction = async (id) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockInstructions.findIndex(i => i.id === id)
        if (index !== -1) {
          const deletedInstruction = { ...mockInstructions[index] }
          mockInstructions.splice(index, 1)
          resolve(deletedInstruction)
        } else {
          reject(new Error('지시를 찾을 수 없습니다.'))
        }
      }, MOCK_DELAY)
    })
  }

  // 실제 API 호출
  try {
    const response = await axios.delete(`${API_URL}/instructions/${id}`)
    return response.data
  } catch (error) {
    console.error(`지시 ID ${id} 삭제 실패:`, error)
    throw error
  }
}
