import { create } from 'zustand';

// 인사 관리 Zustand 스토어 (UI 상태 관리용)
const usePersonnelStore = create((set) => ({
  // UI 상태
  filterOptions: {
    status: 'all', // 'all', 'active', 'inactive'
    position: 'all', // 'all', '반장', '작업자'
    keyword: '',
  },
  
  // 정렬 상태
  sortBy: {
    field: 'name',
    direction: 'asc',
  },
  
  // 테이블 설정
  tableSettings: {
    visibleColumns: [
      'id',
      'name',
      'birthDate',
      'phone',
      'position',
      'status'
    ],
    pageSize: 10,
    currentPage: 1,
  },
  
  // 필터 설정 변경
  setFilterOptions: (options) => set((state) => ({
    filterOptions: {
      ...state.filterOptions,
      ...options,
    }
  })),
  
  // 정렬 설정 변경
  setSortBy: (sortBy) => set({ sortBy }),
  
  // 테이블 설정 변경
  setTableSettings: (settings) => set((state) => ({
    tableSettings: {
      ...state.tableSettings,
      ...settings,
    }
  })),
  
  // 페이지 변경
  setCurrentPage: (page) => set((state) => ({
    tableSettings: {
      ...state.tableSettings,
      currentPage: page,
    }
  })),
  
  // 페이지 크기 변경
  setPageSize: (size) => set((state) => ({
    tableSettings: {
      ...state.tableSettings,
      pageSize: size,
      currentPage: 1, // 페이지 크기 변경 시 첫 페이지로 이동
    }
  })),
  
  // 보이는 컬럼 설정
  setVisibleColumns: (columns) => set((state) => ({
    tableSettings: {
      ...state.tableSettings,
      visibleColumns: columns,
    }
  })),
  
  // 필터 초기화
  resetFilters: () => set((state) => ({
    filterOptions: {
      status: 'all',
      position: 'all',
      keyword: '',
    },
    tableSettings: {
      ...state.tableSettings,
      currentPage: 1,
    }
  })),
}));

export default usePersonnelStore; 