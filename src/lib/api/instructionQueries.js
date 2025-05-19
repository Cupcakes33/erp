import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  fetchInstructions, 
  fetchInstructionById, 
  createInstruction, 
  updateInstruction,
  updateInstructionStatus,
  toggleInstructionFavorite,
  deleteInstruction,
  confirmInstruction,
  fetchProcessesByInstruction,
  fetchProcessById,
  createProcess,
  updateProcess,
  deleteProcess,
  fetchTaskById,
  fetchTasksByProcess,
  createTask,
  updateTask,
  deleteTask,
  fetchUnitPrices,
  fetchInstructionDetail,
  fetchAllProcesses
} from './instructionAPI'
import React from 'react'

// 쿼리 키
const INSTRUCTIONS_QUERY_KEY = 'instructions';
const INSTRUCTION_DETAIL_QUERY_KEY = 'instruction';
const INSTRUCTION_PDF_DETAIL_QUERY_KEY = 'instruction_pdf_detail';

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
      return data.data;
    }
  });
};

/**
 * 출력용 지시 상세 정보를 조회하는 React Query 훅
 * @param {number} id 지시 ID
 * @returns {UseQueryResult} 쿼리 결과
 */
export const useInstructionDetail = (id) => {
  // controller 참조를 저장할 ref
  const controllerRef = React.useRef(null);
  const queryClient = useQueryClient();

  // 컴포넌트 언마운트 시 실행될 cleanup
  React.useEffect(() => {
    // 컴포넌트가 언마운트될 때 실행
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
    };
  }, []);

  return useQuery({
    queryKey: [INSTRUCTION_PDF_DETAIL_QUERY_KEY, id],
    queryFn: () => fetchInstructionDetail(id),
    enabled: !!id, // ID가 있을 때만 쿼리 실행
    staleTime: 60 * 1000, // 1분 동안 데이터가 신선하게 유지됨
    cacheTime: 5 * 60 * 1000, // 5분 동안 캐시에 유지됨
    select: (data) => {
      // controller 저장
      if (data?.controller) {
        // 이전 controller가 있으면 abort
        if (controllerRef.current) {
          controllerRef.current.abort();
        }
        controllerRef.current = data.controller;
      }
      
      // API 응답 형식에 맞게 데이터 변환
      return data;
    },
    onError: (error) => {
      // 취소된 요청 에러는 무시
      if (error?.name === "CanceledError" || error?.name === "AbortError") {
        console.log("PDF 상세 정보 요청이 취소되었습니다.");
        return;
      }
      console.error("PDF 상세 정보 로드 실패:", error);
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
    mutationFn: ({ id, ...instructionData }) => updateInstruction(id, instructionData),
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

// 공종 관련 쿼리 키
const PROCESSES_QUERY_KEY = 'processes';
const PROCESS_DETAIL_QUERY_KEY = 'process';

/**
 * 특정 지시에 속한 공종 목록을 조회하는 React Query 훅
 * @param {number} instructionId 지시 ID
 * @param {Object} params 페이징 파라미터
 * @returns {UseQueryResult} 쿼리 결과
 */
export const useProcessesByInstruction = (instructionId, params = {}) => {
  return useQuery({
    queryKey: [PROCESSES_QUERY_KEY, instructionId, params],
    queryFn: () => fetchProcessesByInstruction(instructionId, params),
    enabled: !!instructionId, // 지시 ID가 있을 때만 쿼리 실행
    select: (data) => {
      // API 응답 형식에 맞게 데이터 변환
      const content = data?.data?.content || [];
      
      // API가 0부터 시작하는 페이지 인덱스를 사용하므로 UI에서는 1부터 시작하도록 변환
      const currentPage = (data?.data?.currentPage ?? 0) + 1;
      
      return {
        processes: content,
        totalCount: data?.data?.totalElements || 0,
        totalPage: data?.data?.totalPages || 0, 
        currentPage: currentPage,
        size: data?.data?.size || 20,
        hasNext: data?.data?.hasNext || false,
        hasPrevious: data?.data?.hasPrevious || false
      };
    }
  });
};

/**
 * 특정 공종 정보를 조회하는 React Query 훅
 * @param {number} id 공종 ID
 * @returns {UseQueryResult} 쿼리 결과
 */
export const useProcess = (id) => {
  return useQuery({
    queryKey: [PROCESS_DETAIL_QUERY_KEY, id],
    queryFn: () => fetchProcessById(id),
    enabled: !!id, // ID가 있을 때만 쿼리 실행
    select: (data) => {
      // API 응답 형식에 맞게 데이터 변환
      return data.data;
    }
  });
};

/**
 * 모든 공종 목록을 조회하는 React Query 훅
 * @param {number} instructionId 지시 ID (필수)
 * @param {Object} params 페이징 파라미터
 * @returns {UseQueryResult} 쿼리 결과
 */
export const useAllProcesses = (instructionId, params = {}) => {
  return useQuery({
    queryKey: ['allProcesses', instructionId, params],
    queryFn: () => fetchAllProcesses(instructionId, params),
    enabled: !!instructionId, // 지시 ID가 있을 때만 쿼리 실행
    select: (data) => {
      // API 응답 형식에 맞게 데이터 변환
      const content = data?.data?.content || [];
      
      // API가 0부터 시작하는 페이지 인덱스를 사용하므로 UI에서는 1부터 시작하도록 변환
      const currentPage = (data?.data?.currentPage ?? 0) + 1;
      
      return {
        processes: content,
        totalCount: data?.data?.totalElements || 0,
        totalPage: data?.data?.totalPages || 0, 
        currentPage: currentPage,
        size: data?.data?.size || 20,
        hasNext: data?.data?.hasNext || false,
        hasPrevious: data?.data?.hasPrevious || false
      };
    }
  });
};

/**
 * 새 공종을 생성하는 React Query Mutation 훅
 * @returns {UseMutationResult} 뮤테이션 결과
 */
export const useCreateProcess = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ instructionId, ...processData }) => createProcess(instructionId, processData),
    onSuccess: (data, variables) => {
      // 공종 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [PROCESSES_QUERY_KEY, variables.instructionId] });
      // 관련 지시 상세 정보도 무효화 (공종 수가 변경될 수 있으므로)
      queryClient.invalidateQueries({ queryKey: [INSTRUCTION_DETAIL_QUERY_KEY, variables.instructionId] });
    }
  });
};

/**
 * 공종 정보를 수정하는 React Query Mutation 훅
 * @returns {UseMutationResult} 뮤테이션 결과
 */
export const useUpdateProcess = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, instructionId, ...processData }) => updateProcess(id, processData),
    onSuccess: (data, variables) => {
      // 공종 목록 및 상세 정보 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [PROCESSES_QUERY_KEY, variables.instructionId] });
      queryClient.invalidateQueries({ queryKey: [PROCESS_DETAIL_QUERY_KEY, variables.id] });
    }
  });
};

/**
 * 공종을 삭제하는 React Query Mutation 훅
 * @returns {UseMutationResult} 뮤테이션 결과
 */
export const useDeleteProcess = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, instructionId }) => deleteProcess(id),
    onSuccess: (data, variables) => {
      // 공종 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [PROCESSES_QUERY_KEY, variables.instructionId] });
      // 관련 지시 상세 정보도 무효화 (공종 수가 변경될 수 있으므로)
      queryClient.invalidateQueries({ queryKey: [INSTRUCTION_DETAIL_QUERY_KEY, variables.instructionId] });
    }
  });
};

// 작업 관련 쿼리 키
const TASKS_QUERY_KEY = 'tasks';
const TASK_DETAIL_QUERY_KEY = 'task';

/**
 * 특정 공종에 속한 작업 목록을 조회하는 React Query 훅
 * @param {number} processId 공종 ID
 * @param {Object} params 페이징 파라미터
 * @returns {UseQueryResult} 쿼리 결과
 */
export const useTasksByProcess = (processId, params = {}) => {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, processId, params],
    queryFn: () => fetchTasksByProcess(processId, params),
    enabled: !!processId, // 공종 ID가 있을 때만 쿼리 실행
    select: (data) => {
      // API 응답 형식에 맞게 데이터 변환
      const content = data?.data?.content || [];
      
      // API가 0부터 시작하는 페이지 인덱스를 사용하므로 UI에서는 1부터 시작하도록 변환
      const currentPage = (data?.data?.currentPage ?? 0) + 1;
      
      return {
        tasks: content,
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
 * 특정 작업 정보를 조회하는 React Query 훅
 * @param {number} id 작업 ID
 * @returns {UseQueryResult} 쿼리 결과
 */
export const useTask = (id) => {
  return useQuery({
    queryKey: [TASK_DETAIL_QUERY_KEY, id],
    queryFn: () => fetchTaskById(id),
    enabled: !!id, // ID가 있을 때만 쿼리 실행
    select: (data) => {
      // API 응답 형식에 맞게 데이터 변환
      return data.data;
    }
  });
};

/**
 * 새 작업을 생성하는 React Query Mutation 훅
 * @returns {UseMutationResult} 뮤테이션 결과
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ processId, ...taskData }) => createTask(processId, taskData),
    onSuccess: (data, variables) => {
      // 작업 목록 쿼리 무효화 (handleSaveTask에서 전체 목록을 로드하므로 주석 처리)
      // queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY, variables.processId] });
    }
  });
};

/**
 * 작업 정보를 수정하는 React Query Mutation 훅
 * @returns {UseMutationResult} 뮤테이션 결과
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, processId, ...taskData }) => updateTask(id, taskData),
    onSuccess: (data, variables) => {
      // 작업 목록 및 상세 정보 쿼리 무효화 (handleSaveTask에서 전체 목록을 로드하므로 주석 처리)
      // queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY, variables.processId] });
      queryClient.invalidateQueries({ queryKey: [TASK_DETAIL_QUERY_KEY, variables.id] });
    }
  });
};

/**
 * 작업을 삭제하는 React Query Mutation 훅
 * @returns {UseMutationResult} 뮤테이션 결과
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, processId }) => deleteTask(id),
    onSuccess: (data, variables) => {
      // 작업 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY, variables.processId] });
    }
  });
};

// 일위대가 관련 쿼리 키
const UNIT_PRICES_QUERY_KEY = 'unitPrices';

/**
 * 일위대가 목록을 조회하는 React Query 훅
 * @param {Object} params 검색 및 페이징 파라미터
 * @param {string} params.keyword 검색 키워드
 * @param {number} params.page 페이지 번호
 * @param {number} params.size 페이지 크기
 * @returns {UseQueryResult} 쿼리 결과
 */
export const useUnitPrices = (params = {}) => {
  return useQuery({
    queryKey: [UNIT_PRICES_QUERY_KEY, params],
    queryFn: () => fetchUnitPrices(params),
    select: (data) => {
      // API 응답 형식에 맞게 데이터 변환
      const content = data?.data?.content || [];
      
      // API가 0부터 시작하는 페이지 인덱스를 사용하므로 UI에서는 1부터 시작하도록 변환
      const currentPage = (data?.data?.currentPage ?? 0) + 1;
      
      return {
        unitPrices: content,
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
