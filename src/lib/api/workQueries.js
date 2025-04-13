import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  fetchWorks, 
  fetchWorkById, 
  createWork, 
  updateWork,
  deleteWork,
  fetchWorksByInstruction,
  addDailyReport
} from './workAPI'

// 쿼리 키
export const QUERY_KEYS = {
  WORKS: 'works',
  WORK: 'work',
  INSTRUCTION_WORKS: 'instruction-works',
};

/**
 * 모든 작업 목록을 가져오는 쿼리 훅
 * @returns {Object} 쿼리 결과 객체
 */
export const useWorks = () => {
  console.log("[workQueries] useWorks 훅 호출됨");
  
  const queryFn = async () => {
    console.log("[workQueries] queryFn 실행 - fetchWorks 호출 직전");
    try {
      const data = await fetchWorks();
      console.log("[workQueries] fetchWorks 반환 데이터:", data);
      return data;
    } catch (error) {
      console.error("[workQueries] fetchWorks 에러:", error);
      throw error;
    }
  };
  
  return useQuery({
    queryKey: [QUERY_KEYS.WORKS],
    queryFn: queryFn,
    staleTime: 0, // 항상 stale 상태로 유지하여 데이터 재요청이 가능하게 함
    cacheTime: 1000, // 캐시 유지 시간을 최소화 (1초)
    retry: 3,
    refetchOnMount: 'always', // 컴포넌트 마운트 시 항상 새로고침
    refetchOnWindowFocus: true, // 창이 포커스될 때 새로고침
    onError: (error) => {
      console.error("[workQueries] 작업 목록 가져오기 에러:", error);
    },
    onSuccess: (data) => {
      console.log("[workQueries] 작업 목록 가져오기 성공:", data);
    },
  });
};

/**
 * 특정 작업 정보를 가져오는 쿼리 훅
 * @param {string} id 작업 ID
 * @returns {Object} 쿼리 결과 객체
 */
export const useWork = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.WORK, id],
    queryFn: () => fetchWorkById(id),
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 fresh로 유지
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });
};

/**
 * 새 작업을 생성하는 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과 객체
 */
export const useCreateWork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWork,
    onSuccess: () => {
      // 성공 시 작업 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKS] });
    },
  });
};

/**
 * 작업 정보를 수정하는 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과 객체
 */
export const useUpdateWork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, workData }) => updateWork(id, workData),
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORK, variables.id] });
      // 이 작업이 속한 지시의 작업 목록도 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSTRUCTION_WORKS] });
    },
  });
};

/**
 * 작업을 삭제하는 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과 객체
 */
export const useDeleteWork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWork,
    onSuccess: (id) => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORK, id] });
      // 이 작업이 속한 지시의 작업 목록도 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSTRUCTION_WORKS] });
    },
  });
};

/**
 * 일일 작업 보고서 추가하는 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과 객체
 */
export const useAddDailyReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workId, reportData }) => addDailyReport(workId, reportData),
    onSuccess: (data, variables) => {
      // 성공 시 작업 상세 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORK, variables.workId] });
    },
  });
};

/**
 * 특정 지시에 포함된 작업 목록을 가져오는 쿼리 훅
 * @param {string} instructionId 지시 ID
 * @returns {Object} 쿼리 결과 객체
 */
export const useWorksByInstruction = (instructionId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INSTRUCTION_WORKS, instructionId],
    queryFn: () => fetchWorksByInstruction(instructionId),
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 fresh로 유지
    enabled: !!instructionId, // instructionId가 있을 때만 쿼리 실행
  });
};
