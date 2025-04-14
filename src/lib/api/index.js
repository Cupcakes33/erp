import axios from 'axios'

// API 기본 설정
const API_URL = import.meta.env.VITE_API_URL || '/api'

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터 - 인증 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 - 오류 처리
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 인증 오류 (401) 처리
    if (error.response && error.response.status === 401) {
      // 인증 관련 오류 처리 - 로그인 페이지로 리다이렉트 등
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 기본 Axios 인스턴스 내보내기
export default api

// API 함수 내보내기 (필요시 추가)
export * from './personnelAPI'
export * from './workAPI'
export * from './instructionAPI'
export * from './authAPI'
export * from './userAPI'
