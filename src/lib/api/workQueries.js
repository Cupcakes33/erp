import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchUnitPrices,
  createUnitPrice,
  updateUnitPrice,
  deleteUnitPrice,
} from "./workAPI"

// 쿼리 키
export const QUERY_KEYS = {
  WORKS: "works",
  WORK: "work",
  INSTRUCTION_WORKS: "instruction-works",
  UNIT_PRICES: "unit-prices",
  UNIT_PRICE: "unit-price",
}

/**
 * 일위대가 목록 조회 Query 훅
 * @param {Object} params - 검색 및 페이징 파라미터
 * @returns {Object} useQuery 훅 반환값
 */
export const useUnitPrices = (params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.UNIT_PRICES, params],
    queryFn: () => fetchUnitPrices(params),
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 fresh로 유지
    keepPreviousData: true, // 페이지네이션 시 이전 데이터 유지
  })
}

/**
 * 일위대가 생성 Mutation 훅
 * @returns {Object} useMutation 훅 반환값
 */
export const useCreateUnitPrice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (unitPriceData) => createUnitPrice(unitPriceData),
    onSuccess: () => {
      // 성공 시 일위대가 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNIT_PRICES] })
    },
    onError: (error) => {
      console.error("일위대가 생성 오류:", error)
    },
  })
}

/**
 * 일위대가 수정 Mutation 훅
 * @returns {Object} useMutation 훅 반환값
 */
export const useUpdateUnitPrice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, unitPriceData }) => updateUnitPrice(id, unitPriceData),
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNIT_PRICES] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.UNIT_PRICE, variables.id],
      })
    },
    onError: (error) => {
      console.error("일위대가 수정 오류:", error)
    },
  })
}

/**
 * 일위대가 삭제 Mutation 훅
 * @returns {Object} useMutation 훅 반환값
 */
export const useDeleteUnitPrice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => deleteUnitPrice(id),
    onSuccess: (_, id) => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNIT_PRICES] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNIT_PRICE, id] })
    },
    onError: (error) => {
      console.error("일위대가 삭제 오류:", error)
    },
  })
}
