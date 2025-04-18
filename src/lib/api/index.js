import axios from 'axios';
import { reissueToken } from './authAPI';

// API 기본 설정
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 요청 인터셉터 - 인증 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 파트 - 오류 처리 및 자동 토큰 재발급
let isRefreshing = false;
let failedQueue = [];

// 토큰 갱신 프로세스 도중 api 요청이 계속될 경우 해당 요청들을 쌓아뒀다가 처리
function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

// 1. accessToken이 만료된 상태에서 여러 API 요청 → 모두 401 에러
// 2. 첫 번째 요청만 토큰 재발급 시도, 나머지는 큐에 대기
// 3. 토큰 재발급 성공 → 큐에 있던 요청들 모두 새 토큰으로 재시도
// 4. 토큰 재발급 실패 → 큐에 있던 요청들 모두 실패 처리, 로그인 페이지로 이동
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // 인증 오류 (401) 처리
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        // reissueToken 함수 활용
        const res = await reissueToken();
        // accessToken 저장은 reissueToken 내부에서 이미 처리됨
        // 필요시 res에서 accessToken을 꺼내 originalRequest에 할당
        const newAccessToken = res?.accessToken || localStorage.getItem('authToken');
        if (newAccessToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        }
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    } else if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // 일반적은 401(인증 만료) 처리
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

// 기본 Axios 인스턴스 내보내기
export default api;

// API 함수 내보내기 (필요시 추가)
export * from './personnelAPI';
export * from './workAPI';
export * from './instructionAPI';
export * from './authAPI';
export * from './userAPI';
