import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  fetchWorkers,
  fetchWorkerById,
  createWorker,
  updateWorker,
  updateWorkerStatus,
  toggleWorkerStatus,
} from "./personnelAPI"

// 쿼리 키 상수
const WORKERS_QUERY_KEY = "workers"
const WORKER_DETAIL_QUERY_KEY = "workerDetail"

/**
 * 작업자 목록을 가져오는 React Query 훅
 * @param {Object} params - 검색 및 페이징 파라미터
 * @param {string} params.keyword - 검색어 (이름)
 * @param {string} params.status - 상태 필터 (ACTIVE, RESIGNED)
 * @param {number} params.page - 페이지 번호
 * @param {number} params.size - 페이지 크기
 * @returns {UseQueryResult} 쿼리 결과
 */
export const useWorkers = (params = {}) => {
  return useQuery({
    queryKey: [WORKERS_QUERY_KEY, params],
    queryFn: () => fetchWorkers(params),
  })
}

/**
 * 특정 작업자 정보를 가져오는 React Query 훅
 * @param {number} id - 작업자 ID
 * @returns {UseQueryResult} 쿼리 결과
 */
export const useWorkerDetail = (id) => {
  return useQuery({
    queryKey: [WORKER_DETAIL_QUERY_KEY, id],
    queryFn: () => fetchWorkerById(id),
    enabled: !!id, // ID가 있을 때만 쿼리 실행
    select: (data) => {
      // API 응답 형식에 맞게 데이터 변환
      return data?.data?.worker || null
    },
  })
}

/**
 * 새 작업자를 생성하는 React Query Mutation 훅
 * @returns {UseMutationResult} 뮤테이션 결과
 */
export const useCreateWorker = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (workerData) => createWorker(workerData),
    onSuccess: () => {
      // 작업자 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [WORKERS_QUERY_KEY] })
    },
  })
}

/**
 * 작업자 정보를 수정하는 React Query Mutation 훅
 * @returns {UseMutationResult} 뮤테이션 결과
 */
export const useUpdateWorker = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (workerData) => {
      console.log("workerData???", workerData)
      return updateWorker(workerData.id, {
        name: workerData.name,
        active: workerData.active,
      })
    },
    onSuccess: (data, variables) => {
      // 작업자 목록 및 상세 정보 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [WORKERS_QUERY_KEY] })
      queryClient.invalidateQueries({
        queryKey: [WORKER_DETAIL_QUERY_KEY, variables.id],
      })
    },
  })
}

/**
 * 작업자 상태를 변경하는 React Query Mutation 훅
 * @returns {UseMutationResult} 뮤테이션 결과
 */
export const useUpdateWorkerStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }) => updateWorkerStatus(id, { status }),
    onSuccess: (data, variables) => {
      // 작업자 목록 및 상세 정보 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [WORKERS_QUERY_KEY] })
      queryClient.invalidateQueries({
        queryKey: [WORKER_DETAIL_QUERY_KEY, variables.id],
      })
    },
  })
}

/**
 * 작업자 상태를 토글하는 React Query Mutation 훅 (호환성 유지)
 * @returns {UseMutationResult} 뮤테이션 결과
 */
export const useToggleWorkerStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => toggleWorkerStatus(id),
    onSuccess: (data, variables) => {
      // 작업자 목록 및 상세 정보 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [WORKERS_QUERY_KEY] })
      queryClient.invalidateQueries({
        queryKey: [WORKER_DETAIL_QUERY_KEY, variables],
      })
    },
  })
}
