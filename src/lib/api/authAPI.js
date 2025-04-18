import axios from 'axios';
import api from './index';

/**
 * 인증 관련 API 모듈
 * 회원가입, 로그인, 로그아웃, 토큰 재발급 기능 제공
 */

// Mock 데이터 - 개발용
const mockUsers = [
  {
    username: 'admin',
    name: '관리자',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'ROLE_ADMIN'
  },
  {
    username: 'manager1',
    name: '담당자1',
    email: 'manager1@example.com',
    password: 'manager1',
    role: 'ROLE_MANAGER'
  },
  {
    username: 'manager2',
    name: '담당자2',
    email: 'manager2@example.com',
    password: 'manager2',
    role: 'ROLE_MANAGER'
  },
  {
    username: 'user1',
    name: '사용자1',
    email: 'user1@example.com',
    password: 'user1',
    role: 'ROLE_USER'
  },
  {
    username: 'user2',
    name: '사용자2',
    email: 'user2@example.com',
    password: 'user2',
    role: 'ROLE_USER'
  }
];

// Mock 토큰 - 개발용
let mockAuthToken = null;
let mockRefreshToken = null;

// /api가 제거된 url 주소
const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, '');

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
    const response = await api.post('/test/join', userData);
    return response.data;
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw error;
  }
};

/**
 * Mock 회원가입 API
 * @param {Object} userData - 사용자 정보
 * @returns {Promise<Object>} 회원가입 결과
 */
export const mockRegister = async (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 이미 존재하는 사용자인지 확인
      const existingUser = mockUsers.find(user => user.username === userData.username);
      if (existingUser) {
        throw new Error('이미 존재하는 사용자입니다.');
      }

      // 새 사용자 추가
      const newUser = {
        ...userData,
        role: 'ROLE_USER' // 기본 역할
      };
      mockUsers.push(newUser);

      resolve({
        message: '변경되었습니다.',
        data: newUser
      });
    }, 500);
  });
};

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
    const response = await axios.post(`${BASE_URL}/login`, credentials);
    
    // 토큰 저장
    const accessToken = response.headers.authorization;
    if (accessToken) {
      localStorage.setItem('authToken', accessToken);
    }
    
    // 리프레시 토큰 저장
    if (response.data.data?.refreshToken) {
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    
    return response.data;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};

/**
 * 로그아웃 API
 * @returns {Promise<Object>} 로그아웃 결과
 */
export const logout = async () => {
  try {
    // 실제 API 호출
    const response = await api.post('/auth/logout');
    
    // 토큰 제거
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    return response.data;
  } catch (error) {
    console.error('로그아웃 실패:', error);
    
    // 토큰 제거 (에러가 나도 로컬의 토큰은 제거)
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    throw error;
  }
};

/**
 * Mock 로그아웃 API
 * @returns {Promise<Object>} 로그아웃 결과
 */
export const mockLogout = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock 토큰 제거
      mockAuthToken = null;
      mockRefreshToken = null;
      
      // 로컬 스토리지에서 제거
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');

      resolve({
        message: '로그아웃 성공.'
      });
    }, 500);
  });
};

/**
 * 토큰 재발급 API
 * @returns {Promise<Object>} 토큰 재발급 결과
 */
export const reissueToken = async () => {
  try {
    // 실제 API 호출
    const response = await api.post('/auth/reissue');
    
    // 새 토큰 저장
    const accessToken = response.headers.authorization;
    if (accessToken) {
      localStorage.setItem('authToken', accessToken);
    }
    
    return response.data;
  } catch (error) {
    console.error('토큰 재발급 실패:', error);
    
    // 오류 종류에 따라 처리
    if (error.response) {
      const errorMessage = error.response.data?.message;
      if (errorMessage === '리프레쉬 토큰을 찾을 수 없습니다.' || 
          errorMessage === '리프레쉬 토큰이 만료되었습니다.' || 
          errorMessage === '유효하지 않은 리프레쉬 토큰입니다.') {
        // 리프레시 토큰 오류 시 로그아웃 처리
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
      }
    }
    
    throw error;
  }
};

/**
 * Mock 토큰 재발급 API
 * @returns {Promise<Object>} 토큰 재발급 결과
 */
export const mockReissueToken = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        reject({
          message: '리프레쉬 토큰을 찾을 수 없습니다.'
        });
        return;
      }
      
      if (refreshToken !== mockRefreshToken) {
        reject({
          message: '유효하지 않은 리프레쉬 토큰입니다.'
        });
        return;
      }
      
      // 새 토큰 생성
      mockAuthToken = `mock-auth-token-${Date.now()}`;
      localStorage.setItem('authToken', mockAuthToken);

      resolve({
        message: '토큰 재발급 완료'
      });
    }, 500);
  });
};

// 개발 환경에서 Mock API 사용을 위한 설정
const isDevelopment = import.meta.env.DEV;

// 실제 API와 Mock API 중 환경에 맞게 내보내기
export default {
  register: isDevelopment ? mockRegister : register,
  login,
  logout,
  reissueToken: isDevelopment ? mockReissueToken : reissueToken
}; 