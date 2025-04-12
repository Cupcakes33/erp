import axios from 'axios'

// 실제 백엔드 API 연동 시 사용할 기본 설정
const api = axios.create({
  baseURL: '/api', // 실제 API 서버 URL로 변경 필요
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터 - 모든 요청에 인증 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 - 인증 오류 처리
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 인증 오류 시 로그아웃 처리
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 인증 관련 API 함수
export const authAPI = {
  // 로그인
  login: async (credentials) => {
    // 백엔드 연동 전 임시 로직
    if (credentials.username === 'admin' && credentials.password === 'password') {
      const mockResponse = {
        user: {
          id: 1,
          username: 'admin',
          name: '관리자',
          role: 'admin'
        },
        token: 'mock-jwt-token'
      }
      
      // 실제 구현 시 아래 코드 사용
      // const response = await api.post('/auth/login', credentials)
      // return response.data
      
      return mockResponse
    } else {
      throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.')
    }
  },
  
  // 로그아웃
  logout: async () => {
    // 백엔드 연동 전 임시 로직
    localStorage.removeItem('token')
    
    // 실제 구현 시 아래 코드 사용
    // await api.post('/auth/logout')
    
    return true
  },
  
  // 사용자 정보 조회
  getProfile: async () => {
    // 백엔드 연동 전 임시 로직
    const mockUser = {
      id: 1,
      username: 'admin',
      name: '관리자',
      role: 'admin',
      email: 'admin@example.com',
      department: '관리부서'
    }
    
    // 실제 구현 시 아래 코드 사용
    // const response = await api.get('/auth/profile')
    // return response.data
    
    return mockUser
  },
  
  // 사용자 정보 업데이트
  updateProfile: async (profileData) => {
    // 백엔드 연동 전 임시 로직
    const mockUpdatedUser = {
      ...profileData,
      id: 1,
      username: 'admin',
      role: 'admin'
    }
    
    // 실제 구현 시 아래 코드 사용
    // const response = await api.put('/auth/profile', profileData)
    // return response.data
    
    return mockUpdatedUser
  }
}

export default api
