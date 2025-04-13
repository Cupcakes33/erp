import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  fetchInstructions, 
  fetchInstructionById, 
  createInstruction, 
  updateInstruction,
  updateInstructionStatus,
  toggleInstructionFavorite,
  deleteInstruction
} from './instructionAPI'

// 쿼리 키
export const QUERY_KEYS = {
  INSTRUCTIONS: 'instructions',
  INSTRUCTION: 'instruction',
}

/**
 * 모든 지시 목록을 가져오는 쿼리 훅
 * @returns {Object} 쿼리 결과 객체
 */
export const useInstructions = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.INSTRUCTIONS],
    queryFn: fetchInstructions,
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 fresh로 유지
  })
}

/**
 * 특정 지시 정보를 가져오는 쿼리 훅
 * @param {string} id 지시 ID
 * @returns {Object} 쿼리 결과 객체
 */
export const useInstruction = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INSTRUCTION, id],
    queryFn: () => fetchInstructionById(id),
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 fresh로 유지
    enabled: !!id, // id가 있을 때만 쿼리 실행
  })
}

/**
 * 새 지시를 생성하는 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과 객체
 */
export const useCreateInstruction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createInstruction,
    onSuccess: () => {
      // 성공 시 지시 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSTRUCTIONS] })
    },
  })
}

/**
 * 지시 정보를 수정하는 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과 객체
 */
export const useUpdateInstruction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, instructionData }) => updateInstruction(id, instructionData),
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSTRUCTIONS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSTRUCTION, variables.id] })
    },
  })
}

/**
 * 지시 상태를 변경하는 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과 객체
 */
export const useUpdateInstructionStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }) => updateInstructionStatus(id, status),
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSTRUCTIONS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSTRUCTION, variables.id] })
    },
  })
}

/**
 * 지시 즐겨찾기를 토글하는 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과 객체
 */
export const useToggleInstructionFavorite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleInstructionFavorite,
    onSuccess: (data, id) => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSTRUCTIONS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSTRUCTION, id] })
    },
  })
}

/**
 * 지시를 삭제하는 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과 객체
 */
export const useDeleteInstruction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteInstruction,
    onSuccess: (_, id) => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSTRUCTIONS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSTRUCTION, id] })
    },
  })
}
