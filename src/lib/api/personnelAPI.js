import api from "."

/**
 * 작업자 목록을 조회하는 API
 * @returns {Promise<Object>} 작업자 목록
 */
export const fetchWorkers = async () => {
  try {
    const response = await api.get(`/worker`)
    console.log("response???", response)
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

/**
 * 작업자 재직 상태를 변경하는 API
 * @param {number} id - 작업자 ID
 * @param {Object} statusData - 상태 데이터
 * @param {string} statusData.status - 변경할 상태 ('ACTIVE' 또는 'RESIGNED')
 * @returns {Promise<Object>} 수정된 작업자 정보
 */
export const updateWorkerStatus = async (id, statusData) => {
  try {
    const response = await api.post(`/worker/${id}/status`, statusData)
    return response.data
  } catch (error) {
    console.error(`작업자 ID ${id} 상태 변경 실패:`, error)
    throw error
  }
}

/**
 * 특정 작업자 정보를 가져오는 함수 (호환성 유지)
 * @param {number} id 작업자 ID
 * @returns {Promise<Object>} 작업자 정보
 */
export const fetchWorkerById = async (id) => {
  try {
    const response = await api.get(`/worker/${id}`)
    return response.data
  } catch (error) {
    console.error(`작업자 ID ${id} 조회 실패:`, error)
    throw error
  }
}

/**
 * 작업자 상태를 변경하는 함수 (호환성 유지)
 * @param {number} id 작업자 ID
 * @returns {Promise<Object>} 수정된 작업자 정보
 */
export const toggleWorkerStatus = async (id) => {
  try {
    const response = await api.post(`/worker/${id}/status`, {
      status: "ACTIVE",
    })
    return response.data
  } catch (error) {
    console.error(`작업자 ID ${id} 상태 변경 실패:`, error)
    throw error
  }
}
