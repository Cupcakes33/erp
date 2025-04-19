import api from "."

/**
 * 일위대가 목록을 조회하는 API
 * @param {Object} params - 검색 및 페이징 파라미터
 * @param {string} params.keyword - 검색어 (공종명)
 * @param {number} params.page - 페이지 번호
 * @param {number} params.size - 페이지 크기
 * @returns {Promise<Object>} 일위대가 목록
 */
export const fetchUnitPrices = async (params = {}) => {
  try {
    const response = await api.get(`/unit-price`, { params })
    return response.data
  } catch (error) {
    console.error("일위대가 목록 조회 실패:", error)
    throw error
  }
}

/**
 * 일위대가 상세 정보를 조회하는 API
 * @param {number} id - 일위대가 ID
 * @returns {Promise<Object>} 일위대가 상세 정보
 */
export const fetchUnitPriceById = async (id) => {
  try {
    const response = await api.get(`/unit-price/${id}`)
    return response.data
  } catch (error) {
    console.error(`일위대가 ID ${id} 조회 실패:`, error)
    throw error
  }
}

/**
 * 일위대가를 생성하는 API
 * @param {Object} unitPriceData - 일위대가 데이터
 * @returns {Promise<Object>} 생성된 일위대가 정보
 */
export const createUnitPrice = async (unitPriceData) => {
  try {
    const response = await api.post(`/unit-price/`, unitPriceData)
    return response.data
  } catch (error) {
    console.error("일위대가 생성 실패:", error)
    throw error
  }
}

/**
 * 일위대가를 수정하는 API
 * @param {number} id - 일위대가 ID
 * @param {Object} unitPriceData - 수정할 일위대가 데이터
 * @returns {Promise<Object>} 수정된 일위대가 정보
 */
export const updateUnitPrice = async (id, unitPriceData) => {
  try {
    const response = await api.put(`/unit-price/${id}`, unitPriceData)
    return response.data
  } catch (error) {
    console.error(`일위대가 ID ${id} 수정 실패:`, error)
    throw error
  }
}

/**
 * 일위대가를 삭제하는 API
 * @param {number} id - 일위대가 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteUnitPrice = async (id) => {
  try {
    const response = await api.delete(`/unit-price/${id}`)
    return response.data
  } catch (error) {
    console.error(`일위대가 ID ${id} 삭제 실패:`, error)
    throw error
  }
}
