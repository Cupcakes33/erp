import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  fetchInstructions, 
  fetchInstructionById, 
  createInstruction, 
  updateInstruction,
  updateInstructionStatus,
  toggleInstructionFavorite,
  deleteInstruction,
  confirmInstruction
} from './instructionAPI'

// 쿼리 키
const INSTRUCTIONS_QUERY_KEY = 'instructions';
const INSTRUCTION_DETAIL_QUERY_KEY = 'instruction';

/**
 * 지시 목록을 조회하는 React Query 훅
 * @param {Object} params - 검색 및 페이징 파라미터
 * @param {string} params.status - 상태 필터 
 * @param {number} params.page - 페이지 번호
 * @param {number} params.size - 페이지 크기
 * @returns {UseQueryResult} 쿼리 결과
 */
export const useInstructions = (params = {}) => {
  return useQuery({
    queryKey: [INSTRUCTIONS_QUERY_KEY, params],
    queryFn: () => fetchInstructions(params),
    select: (data) => {
      // API 응답 형식에 맞게 데이터 변환
      const content = data?.data?.content || [];
      
      // API가 0부터 시작하는 페이지 인덱스를 사용하므로 UI에서는 1부터 시작하도록 변환
      const currentPage = (data?.data?.currentPage ?? 0) + 1;
      
      return {
        instruction: content,
        totalCount: data?.data?.totalElements || 0,
        totalPage: data?.data?.totalPages || 0, 
        currentPage: currentPage,
        size: data?.data?.size || 10,
        hasNext: data?.data?.hasNext || false,
        hasPrevious: data?.data?.hasPrevious || false
      };
    }
  });
};

/**
 * 특정 지시 정보를 조회하는 React Query 훅
 * @param {number} id 지시 ID
 * @returns {UseQueryResult} 쿼리 결과
 */
export const useInstruction = (id) => {
  return useQuery({
    queryKey: [INSTRUCTION_DETAIL_QUERY_KEY, id],
    queryFn: () => fetchInstructionById(id),
    enabled: !!id, // ID가 있을 때만 쿼리 실행
    select: (data) => {
      // API 응답 형식에 맞게 데이터 변환
      return data;
    }
  });
};

/**
 * 새 지시를 생성하는 React Query Mutation 훅
 * @returns {UseMutationResult} 뮤테이션 결과
 */
export const useCreateInstruction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (instructionData) => createInstruction(instructionData),
    onSuccess: () => {
      // 지시 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [INSTRUCTIONS_QUERY_KEY] });
    }
  });
};

/**
 * 지시 정보를 수정하는 React Query Mutation 훅
 * @returns {UseMutationResult} 뮤테이션 결과
 */
export const useUpdateInstruction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, instructionData }) => updateInstruction(id, { instruction: instructionData }),
    onSuccess: (data, variables) => {
      // 지시 목록 및 상세 정보 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [INSTRUCTIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [INSTRUCTION_DETAIL_QUERY_KEY, variables.id] });
    }
  });
};

/**
 * 지시 상태를 변경하는 React Query Mutation 훅
 * @returns {UseMutationResult} 뮤테이션 결과
 */
export const useUpdateInstructionStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }) => updateInstructionStatus(id, { status }),
    onSuccess: (data, variables) => {
      // 지시 목록 및 상세 정보 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [INSTRUCTIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [INSTRUCTION_DETAIL_QUERY_KEY, variables.id] });
    }
  });
};

/**
 * 지시 즐겨찾기를 토글하는 React Query Mutation 훅
 * @returns {UseMutationResult} 뮤테이션 결과
 */
export const useToggleInstructionFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => toggleInstructionFavorite(id),
    onSuccess: (data, variables) => {
      // 지시 목록 및 상세 정보 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [INSTRUCTIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [INSTRUCTION_DETAIL_QUERY_KEY, variables] });
    }
  });
};

/**
 * 지시를 삭제하는 React Query Mutation 훅
 * @returns {UseMutationResult} 뮤테이션 결과
 */
export const useDeleteInstruction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => deleteInstruction(id),
    onSuccess: (data, variables) => {
      // 지시 목록 및 상세 정보 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [INSTRUCTIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [INSTRUCTION_DETAIL_QUERY_KEY, variables] });
    }
  });
};

/**
 * 지시를 확정하는 React Query Mutation 훅
 * @returns {UseMutationResult} 뮤테이션 결과
 */
export const useConfirmInstruction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => confirmInstruction(id),
    onSuccess: (data, variables) => {
      // 지시 목록 및 상세 정보 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [INSTRUCTIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [INSTRUCTION_DETAIL_QUERY_KEY, variables] });
    }
  });
};
