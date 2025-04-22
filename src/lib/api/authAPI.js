import axios from "axios"
import api from "./index"

/**
 * 인증 관련 API 모듈
 * 회원가입, 로그인, 로그아웃, 토큰 재발급 기능 제공
 */

// /api가 제거된 url 주소
const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, "")

/**
 * 회원가입 API
 * @param {Object} userData - 사용자 정보
 * @param {string} userData.username - 사용자 아이디
 * @param {string} userData.name - 사용자 이름
 * @param {string} userData.email - 사용자 이메일
 * @param {string} userData.password - 사용자 비밀번호
 * @returns {Promise<Object>} 회원가입 결과
 */
export const register = async (userData) => {
  try {
    // 실제 API 호출
    const response = await api.post("/users/join", userData)
    return response.data
  } catch (error) {
    console.error("회원가입 실패:", error)
    throw error
  }
}

/**
 * 로그인 API
 * @param {Object} credentials - 로그인 정보
 * @param {string} credentials.username - 사용자 아이디
 * @param {string} credentials.password - 사용자 비밀번호
 * @returns {Promise<Object>} 로그인 결과
 */
export const login = async (credentials) => {
  try {
    // 실제 API 호출
    const response = await axios.post(`${BASE_URL}/login`, credentials, {
      withCredentials: true,
    })

    // 토큰 저장
    let accessToken = response.headers.authorization
    if (accessToken && accessToken.startsWith("Bearer ")) {
      accessToken = accessToken.replace(/^Bearer /, "")
    }
    if (accessToken) {
      localStorage.setItem("authToken", accessToken)
    }

    return response.data
  } catch (error) {
    console.error("로그인 실패:", error)
    throw error
  }
}

/**
 * 로그아웃 API
 * @returns {Promise<Object>} 로그아웃 결과
 */
export const logout = async () => {
  try {
    // 실제 API 호출
    const token = localStorage.getItem("authToken")
    const response = await axios.post(
      `${BASE_URL}/logout`,
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: token ? token : undefined,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error("로그아웃 실패:", error)
    throw error
  } finally {
    localStorage.removeItem("authToken")
    window.location.href = "/react-app/#/login"
  }
}

/**
 * 토큰 재발급 API
 * @returns {Promise<Object>} 토큰 재발급 결과
 */
export const reissueToken = async () => {
  try {
    // 실제 API 호출
    const response = await api.post("/auth/reissue")

    // 새 토큰 저장
    let accessToken = response.headers.authorization
    if (accessToken && accessToken.startsWith("Bearer ")) {
      accessToken = accessToken.replace(/^Bearer /, "")
    }
    return response.data
  } catch (error) {
    console.error("토큰 재발급 실패:", error)

    // 오류 종류에 따라 처리
    if (error.response) {
      const errorMessage = error.response.data?.message
      if (
        errorMessage === "리프레쉬 토큰을 찾을 수 없습니다." ||
        errorMessage === "리프레쉬 토큰이 만료되었습니다." ||
        errorMessage === "유효하지 않은 리프레쉬 토큰입니다."
      ) {
        // 리프레시 토큰 오류 시 로그아웃 처리
        localStorage.removeItem("authToken")
      }
    }

    throw error
  }
}

// 실제 API와 Mock API 중 환경에 맞게 내보내기
export default {
  register,
  login,
  logout,
  reissueToken,
}
