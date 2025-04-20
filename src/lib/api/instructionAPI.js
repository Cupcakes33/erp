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
    const response = await axios.post(`${API_URL}/instruction/${id}/status`, statusData);
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
