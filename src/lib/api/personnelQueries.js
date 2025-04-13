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
  return useQuery({
    queryKey: [QUERY_KEYS.WORKERS],
    queryFn: fetchWorkers,
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 fresh로 유지
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