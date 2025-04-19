import api from "."

/**
 * 작업자 목록을 조회하는 API
 * @returns {Promise<Object>} 작업자 목록
 */
export const fetchWorkers = async () => {
  try {
    const response = await api.get(`/worker`)
    return response.data
  } catch (error) {
    console.error("작업자 목록 조회 실패:", error)
    throw error
  }
}

/**
 * 작업자를 생성하는 API
 * @param {Object} workerData - 작업자 데이터
 * @param {string} workerData.name - 작업자 이름
 * @returns {Promise<Object>} 생성된 작업자 정보
 */
export const createWorker = async (workerData) => {
  try {
    const response = await api.post(`/worker`, workerData)
    return response.data
  } catch (error) {
    console.error("작업자 생성 실패:", error)
    throw error
  }
}

/**
 * 작업자 정보를 수정하는 API
 * @param {number} id - 작업자 ID
 * @param {Object} workerData - 수정할 작업자 데이터
 * @returns {Promise<Object>} 수정된 작업자 정보
 */
export const updateWorker = async (id, workerData) => {
  try {
    const response = await api.put(`/worker/${id}`, workerData)
    return response.data
  } catch (error) {
    console.error(`작업자 ID ${id} 수정 실패:`, error)
    throw error
  }
}
