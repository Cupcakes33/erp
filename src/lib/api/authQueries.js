import { useMutation } from '@tanstack/react-query';
import authAPI from './authAPI';

/**
 * 인증 관련 React Query 커스텀 훅 모듈
 */

/**
 * 회원가입 Mutation 훅
 * @returns {Object} useMutation 훅 반환값
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: (userData) => authAPI.register(userData),
    onError: (error) => {
      console.error('회원가입 오류:', error);
    }
  });
};

/**
 * 로그인 Mutation 훅
 * @returns {Object} useMutation 훅 반환값
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials) => authAPI.login(credentials),
    onSuccess: (data) => {
      // 로그인 성공 시 필요한 추가 작업을 여기에 구현
      console.log('로그인 성공');
    },
    onError: (error) => {
      console.error('로그인 오류:', error);
    }
  });
};

/**
 * 로그아웃 Mutation 훅
 * @returns {Object} useMutation 훅 반환값
 */
export const useLogout = () => {
  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      // 로그아웃 성공 시 필요한 추가 작업을 여기에 구현
      console.log('로그아웃 성공');
      
      // React Query 캐시 초기화나 리다이렉트 등의 작업이 필요할 수 있음
    },
    onError: (error) => {
      console.error('로그아웃 오류:', error);
    }
  });
};

/**
 * 토큰 재발급 Mutation 훅
 * @returns {Object} useMutation 훅 반환값
 */
export const useReissueToken = () => {
  return useMutation({
    mutationFn: () => authAPI.reissueToken(),
    onSuccess: () => {
      console.log('토큰 재발급 성공');
    },
    onError: (error) => {
      console.error('토큰 재발급 오류:', error);
      
      // 재발급 실패 시, 로그인 페이지로 리다이렉트 등의 처리가 필요할 수 있음
      if (error.response && error.response.status === 401) {
        // 인증 오류 발생 시 처리
      }
    }
  });
}; 