import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userAPI from './userAPI';

/**
 * 사용자 관련 React Query 커스텀 훅 모듈
 */

// 쿼리 키 상수
const USER_PROFILE_KEY = ['user', 'profile'];

/**
 * 마이페이지 정보 조회 Query 훅
 * @returns {Object} useQuery 훅 반환값
 */
export const useMyProfile = () => {
  return useQuery({
    queryKey: USER_PROFILE_KEY,
    queryFn: () => userAPI.getMyProfile(),
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 데이터 사용
    retry: 1, // 1번까지 재시도
    onError: (error) => {
      console.error('프로필 조회 오류:', error);
    }
  });
};

/**
 * 프로필 수정 Mutation 훅
 * @returns {Object} useMutation 훅 반환값
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (profileData) => userAPI.updateProfile(profileData),
    onSuccess: () => {
      // 성공 시 마이페이지 정보 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEY });
    },
    onError: (error) => {
      console.error('프로필 수정 오류:', error);
    }
  });
};

/**
 * 비밀번호 변경 Mutation 훅
 * @returns {Object} useMutation 훅 반환값
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (passwordData) => userAPI.changePassword(passwordData),
    onError: (error) => {
      console.error('비밀번호 변경 오류:', error);
    }
  });
};

/**
 * 비밀번호 초기화 Mutation 훅
 * @returns {Object} useMutation 훅 반환값
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (resetData) => userAPI.resetPassword(resetData),
    onError: (error) => {
      console.error('비밀번호 초기화 오류:', error);
    }
  });
}; 