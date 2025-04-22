import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchWorkers, createWorker, updateWorker } from "./personnelAPI"

// 쿼리 키 상수
const WORKERS_QUERY_KEY = "workers"

/**
 * 작업자 목록을 가져오는 React Query 훅
 * @returns {UseQueryResult} 쿼리 결과
 */
export const useWorkers = (params = {}) => {
  return useQuery({
    queryKey: [WORKERS_QUERY_KEY, params],
    queryFn: () => fetchWorkers(params),
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
    onSuccess: (data, variables, context) => {
      // 작업자 목록 및 상세 정보 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [WORKERS_QUERY_KEY] })
      queryClient.invalidateQueries({
        queryKey: [WORKERS_QUERY_KEY, variables.id],
      })
    },
  })
}
