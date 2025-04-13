import { create } from 'zustand';

// 지시 관리 Zustand 스토어 (UI 상태 관리용)
const useInstructionStore = create((set) => ({
  // UI 상태
  filterOptions: {
    status: 'all',
    priority: 'all',
    favorite: false,
    keyword: '',
    startDate: null,
    endDate: null,
  },
  
  // 뷰 상태
  viewMode: 'list', // 'list', 'table', 'kanban'
  
  // 정렬 상태
  sortBy: {
    field: 'createdAt',
    direction: 'desc',
  },
  
  // 필터 설정 변경
  setFilterOptions: (options) => set((state) => ({
    filterOptions: {
      ...state.filterOptions,
      ...options,
    }
  })),
  
  // 뷰 모드 변경
  setViewMode: (viewMode) => set({ viewMode }),
  
  // 정렬 설정 변경
  setSortBy: (sortBy) => set({ sortBy }),
  
  // 필터 초기화
  resetFilters: () => set({
    filterOptions: {
      status: 'all',
      priority: 'all',
      favorite: false,
      keyword: '',
      startDate: null,
      endDate: null,
    }
  }),
}));

export default useInstructionStore; 