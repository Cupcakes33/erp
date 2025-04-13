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
  console.log("[instructionQueries] useInstructions 훅 호출됨");
  
  const queryFn = async () => {
    console.log("[instructionQueries] queryFn 실행 - fetchInstructions 호출 직전");
    try {
      const data = await fetchInstructions();
      console.log("[instructionQueries] fetchInstructions 반환 데이터:", data);
      return data;
    } catch (error) {
      console.error("[instructionQueries] fetchInstructions 에러:", error);
      throw error;
    }
  };
  
  return useQuery({
    queryKey: [QUERY_KEYS.INSTRUCTIONS],
    queryFn: queryFn,
    staleTime: 0, // 항상 stale 상태로 유지하여 데이터 재요청이 가능하게 함
    cacheTime: 1000, // 캐시 유지 시간을 최소화 (1초)
    retry: 3,
    refetchOnMount: 'always', // 컴포넌트 마운트 시 항상 새로고침
    refetchOnWindowFocus: true, // 창이 포커스될 때 새로고침
    onError: (error) => {
      console.error("[instructionQueries] 지시 목록 가져오기 에러:", error);
    },
    onSuccess: (data) => {
      console.log("[instructionQueries] 지시 목록 가져오기 성공:", data);
    }
  });
};

/**
 * 특정 지시 정보를 가져오는 쿼리 훅
 * @param {string} id 지시 ID
 * @returns {Object} 쿼리 결과 객체
 */
export const useInstruction = (id) => {
  console.log("[instructionQueries] useInstruction 훅 호출됨, id:", id);
  
  const queryFn = async () => {
    console.log("[instructionQueries] instruction queryFn 실행 - fetchInstructionById 호출 직전");
    try {
      const data = await fetchInstructionById(id);
      console.log("[instructionQueries] fetchInstructionById 반환 데이터:", data);
      return data;
    } catch (error) {
      console.error("[instructionQueries] fetchInstructionById 에러:", error);
      throw error;
    }
  };
  
  return useQuery({
    queryKey: [QUERY_KEYS.INSTRUCTION, id],
    queryFn: queryFn,
    staleTime: 0, // 항상 stale 상태로 유지하여 데이터 재요청이 가능하게 함
    cacheTime: 1000, // 캐시 유지 시간을 최소화 (1초)
    retry: 3,
    refetchOnMount: 'always', // 컴포넌트 마운트 시 항상 새로고침
    refetchOnWindowFocus: true, // 창이 포커스될 때 새로고침
    enabled: !!id, // id가 있을 때만 쿼리 실행
    onError: (error) => {
      console.error(`[instructionQueries] 지시 ID ${id} 가져오기 에러:`, error);
    },
    onSuccess: (data) => {
      console.log(`[instructionQueries] 지시 ID ${id} 가져오기 성공:`, data);
    },
  });
};

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
