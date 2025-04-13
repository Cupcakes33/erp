import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWorkers, fetchWorkerById, createWorker, updateWorker, toggleWorkerStatus } from './personnelAPI';

// 쿼리 키
export const QUERY_KEYS = {
  WORKERS: 'workers',
  WORKER: 'worker',
};

/**
 * 모든 작업자 목록을 가져오는 쿼리 훅
 * @returns {Object} 쿼리 결과 객체
 */
export const useWorkers = () => {
  console.log("[personnelQueries] useWorkers 훅 호출됨");
  
  const queryFn = async () => {
    console.log("[personnelQueries] queryFn 실행 - fetchWorkers 호출 직전");
    try {
      const data = await fetchWorkers();
      console.log("[personnelQueries] fetchWorkers 반환 데이터:", data);
      return data;
    } catch (error) {
      console.error("[personnelQueries] fetchWorkers 에러:", error);
      throw error;
    }
  };
  
  return useQuery({
    queryKey: [QUERY_KEYS.WORKERS],
    queryFn: queryFn,
    staleTime: 0, // 항상 stale 상태로 유지하여 데이터 재요청이 가능하게 함
    cacheTime: 1000, // 캐시 유지 시간을 최소화 (1초)
    retry: 3,
    refetchOnMount: 'always', // 컴포넌트 마운트 시 항상 새로고침
    refetchOnWindowFocus: true, // 창이 포커스될 때 새로고침
    onError: (error) => {
      console.error("[personnelQueries] 작업자 목록 가져오기 에러:", error);
    },
    onSuccess: (data) => {
      console.log("[personnelQueries] 작업자 목록 가져오기 성공:", data);
    }
  });
};

/**
 * 특정 작업자 정보를 가져오는 쿼리 훅
 * @param {number} id 작업자 ID
 * @returns {Object} 쿼리 결과 객체
 */
export const useWorker = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.WORKER, id],
    queryFn: () => fetchWorkerById(id),
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 fresh로 유지
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });
};

/**
 * 새 작업자를 생성하는 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과 객체
 */
export const useCreateWorker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorker,
    onSuccess: () => {
      // 성공 시 작업자 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKERS] });
    },
  });
};

/**
 * 작업자 정보를 수정하는 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과 객체
 */
export const useUpdateWorker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, workerData }) => updateWorker(id, workerData),
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKER, variables.id] });
    },
  });
};

/**
 * 작업자 상태를 변경하는 뮤테이션 훅 (재직/퇴사)
 * @returns {Object} 뮤테이션 결과 객체
 */
export const useToggleWorkerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleWorkerStatus,
    onSuccess: (data, id) => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKER, id] });
    },
  });
}; 