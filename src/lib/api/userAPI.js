import api from "./index"

/**
 * 사용자 관련 API 모듈
 * 마이페이지 조회, 프로필 수정, 비밀번호 변경, 비밀번호 초기화 기능 제공
 */

/**
 * 마이페이지 조회 API
 * @returns {Promise<Object>} 사용자 정보
 */
export const getMyProfile = async () => {
  try {
    // 실제 API 호출
    const response = await api.get("/users/me")
    return response.data
  } catch (error) {
    console.error("마이페이지 조회 실패:", error)
    throw error
  }
}

/**
 * 이름 수정 API
 * @param {Object} profileData - 수정할 프로필 정보
 * @param {string} profileData.name - 사용자 이름
 * @returns {Promise<Object>} 수정된 프로필 정보
 */
export const updateProfile = async (profileData) => {
  try {
    // 실제 API 호출
    const response = await api.patch("/users/name", { ...profileData })
    return response.data
  } catch (error) {
    console.error("프로필 수정 실패:", error)
    throw error
  }
}

/**
 * 비밀번호 변경 API
 * @param {Object} passwordData - 비밀번호 정보
 * @param {string} passwordData.oldPassword - 현재 비밀번호
 * @param {string} passwordData.newPassword - 새 비밀번호
 * @returns {Promise<Object>} 비밀번호 변경 결과
 */
export const changePassword = async (passwordData) => {
  try {
    // 실제 API 호출
    const response = await api.patch("/users/password", { ...passwordData })
    return response.data
  } catch (error) {
    console.error("비밀번호 변경 실패:", error)
    throw error
  }
}

/**
 * 비밀번호 초기화 API
 * @param {Object} resetData - 비밀번호 초기화 정보
 * @param {string} resetData.username - 사용자 아이디
 * @returns {Promise<Object>} 비밀번호 초기화 결과
 */
export const resetPassword = async (resetData) => {
  try {
    // 실제 API 호출
    const response = await api.post("/users/password/reset", resetData)
    return response.data
  } catch (error) {
    console.error("비밀번호 초기화 실패:", error)
    throw error
  }
}

// 실제 API와 Mock API 중 환경에 맞게 내보내기
export default {
  getMyProfile,
  updateProfile,
  changePassword,
  resetPassword,
}
