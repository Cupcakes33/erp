import { create } from "zustand"

// 작업자 리스트 필터링/정렬 유틸 함수
export function filterWorkers(
  workers,
  {
    keyword = "",
    status = "all",
    sortBy = { field: "id", direction: "asc" },
    pageSize = 10,
    currentPage = 1,
  },
) {
  // 원본 데이터 복사
  let filtered = [...workers]

  // 상태 필터
  if (status !== "all") {
    filtered = filtered.filter((worker) => {
      if (status === "active") return worker.active === true
      if (status === "inactive") return worker.active === false
      return true
    })
  }

  // 검색어 필터 (이름/상태)
  if (keyword) {
    const lower = keyword.toLowerCase()
    filtered = filtered.filter(
      (worker) => worker.name?.toLowerCase().includes(lower),
      // 필요시 다른 필드 추가
    )
  }

  // 정렬 로직 완전 재작성
  filtered.sort((a, b) => {
    // 정렬 필드에 따라 다른 비교 로직 적용
    if (sortBy.field === "id") {
      // ID 정렬: 숫자로 변환하여 비교
      const aId = parseInt(a.id, 10) || 0
      const bId = parseInt(b.id, 10) || 0
      return sortBy.direction === "asc" ? aId - bId : bId - aId
    } 
    else if (sortBy.field === "active") {
      // 상태 정렬: 불리언 값 비교 (true가 먼저 오도록)
      if (a.active === b.active) {
        // 상태가 같으면 ID로 정렬
        const aId = parseInt(a.id, 10) || 0
        const bId = parseInt(b.id, 10) || 0
        return aId - bId
      }
      return sortBy.direction === "asc" 
        ? (a.active === true ? -1 : 1) 
        : (a.active === true ? 1 : -1)
    }
    else if (sortBy.field === "name") {
      // 이름 정렬: 문자열 비교
      const aName = a.name || ""
      const bName = b.name || ""
      const comparison = aName.localeCompare(bName)
      return sortBy.direction === "asc" ? comparison : -comparison
    }
    else {
      // 기타 필드: 일반 비교
      const aValue = a[sortBy.field] ?? ""
      const bValue = b[sortBy.field] ?? ""
      
      // 문자열 비교
      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue)
        return sortBy.direction === "asc" ? comparison : -comparison
      }
      
      // 숫자 비교
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortBy.direction === "asc" ? aValue - bValue : bValue - aValue
      }
      
      // 기타 타입 비교
      if (aValue < bValue) return sortBy.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortBy.direction === "asc" ? 1 : -1
      
      // 값이 같으면 ID로 정렬 (보조 정렬)
      const aId = parseInt(a.id, 10) || 0
      const bId = parseInt(b.id, 10) || 0
      return aId - bId
    }
  })

  // 페이지네이션
  const totalCount = filtered.length
  const totalPage = Math.max(1, Math.ceil(totalCount / pageSize))
  
  // 현재 페이지가 유효한지 확인하고 조정
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPage)
  
  const paged = filtered.slice(
    (validCurrentPage - 1) * pageSize,
    validCurrentPage * pageSize,
  )
  
  console.log("페이지네이션 정보:", {
    총데이터수: totalCount,
    총페이지수: totalPage,
    현재페이지: validCurrentPage,
    페이지크기: pageSize,
    페이지데이터수: paged.length,
    첫번째ID: paged[0]?.id,
    정렬기준: sortBy,
  })
  
  return { paged, totalCount, totalPage }
}

// 인사 관리 Zustand 스토어 (UI 상태 관리용)
const usePersonnelStore = create((set) => ({
  // UI 상태
  filterOptions: {
    status: "all", // 'all', 'active', 'inactive'
    position: "all", // 'all', '반장', '작업자'
    keyword: "",
  },

  // 정렬 상태
  sortBy: {
    field: "name",
    direction: "asc",
  },

  // 테이블 설정
  tableSettings: {
    visibleColumns: ["id", "name", "birthDate", "phone", "position", "status"],
    pageSize: 10,
    currentPage: 1,
  },

  // 필터 설정 변경
  setFilterOptions: (options) =>
    set((state) => ({
      filterOptions: {
        ...state.filterOptions,
        ...options,
      },
    })),

  // 정렬 설정 변경
  setSortBy: (sortBy) => set({ sortBy }),

  // 테이블 설정 변경
  setTableSettings: (settings) =>
    set((state) => ({
      tableSettings: {
        ...state.tableSettings,
        ...settings,
      },
    })),

  // 페이지 변경
  setCurrentPage: (page) =>
    set((state) => ({
      tableSettings: {
        ...state.tableSettings,
        currentPage: page,
      },
    })),

  // 페이지 크기 변경
  setPageSize: (size) =>
    set((state) => ({
      tableSettings: {
        ...state.tableSettings,
        pageSize: size,
        currentPage: 1, // 페이지 크기 변경 시 첫 페이지로 이동
      },
    })),

  // 보이는 컬럼 설정
  setVisibleColumns: (columns) =>
    set((state) => ({
      tableSettings: {
        ...state.tableSettings,
        visibleColumns: columns,
      },
    })),

  // 필터 초기화
  resetFilters: () =>
    set((state) => ({
      filterOptions: {
        status: "all",
        position: "all",
        keyword: "",
      },
      tableSettings: {
        ...state.tableSettings,
        currentPage: 1,
      },
    })),
}))

export default usePersonnelStore
