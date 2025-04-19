import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import usePersonnelStore, { filterWorkers } from "../../lib/zustand/personnel"
import {
  useWorkers,
  useToggleWorkerStatus,
} from "../../lib/api/personnelQueries"
import {
  DataTable,
  FormButton,
  FormInput,
  FormSelect,
} from "../../components/molecules"
import { PlusCircle, Search } from "lucide-react"

/**
 * 인사 관리 목록 페이지
 */
const PersonnelList = () => {
  const navigate = useNavigate()
  const {
    filterOptions,
    setFilterOptions,
    sortBy,
    tableSettings,
    setTableSettings,
    setCurrentPage,
    setPageSize,
  } = usePersonnelStore()

  // 원본 데이터 fetch (파라미터 없이 전체 데이터만 받아옴)
  const {
    data: workersData = { data: [] },
    isLoading,
    isError,
    error,
  } = useWorkers() // 파라미터 제거
  const toggleStatusMutation = useToggleWorkerStatus()

  // 상태 관리: 원본/가공/페이지네이션
  const [rawWorkers, setRawWorkers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPage, setTotalPage] = useState(1)

  // 원본 데이터 useEffect로 상태에 반영
  useEffect(() => {
    setRawWorkers(workersData.data || [])
  }, [workersData])

  // 필터링/정렬/페이지네이션 useEffect
  useEffect(() => {
    const { paged, totalCount, totalPage } = filterWorkers(rawWorkers, {
      keyword: filterOptions.keyword,
      status: filterOptions.status,
      sortBy,
      pageSize: tableSettings.pageSize,
      currentPage: tableSettings.currentPage,
    })
    setFiltered(paged)
    setTotalCount(totalCount)
    setTotalPage(totalPage)
  }, [
    rawWorkers,
    filterOptions,
    sortBy,
    tableSettings.pageSize,
    tableSettings.currentPage,
  ])

  // 상태 영문 → 한글 변환 함수
  const getStatusKor = (active) => (active ? "재직" : "퇴사")

  // 작업자 추가 페이지로 이동
  const handleAddNew = () => {
    navigate("/personnel/create")
  }

  // 작업자 상태 토글 (재직/퇴사)
  const handleToggleStatus = (workerId, e) => {
    e.stopPropagation()
    toggleStatusMutation.mutate(workerId)
  }

  // 작업자 상세 보기 페이지로 이동
  const handleRowClick = (worker) => {
    navigate(`/personnel/${worker.id}`)
  }

  // 컬럼 정의
  const columns = [
    { accessorKey: "id", header: "ID", className: "w-16 text-center" },
    { accessorKey: "name", header: "이름" },
    {
      accessorKey: "active",
      header: "상태",
      cell: ({ row }) => {
        const status = getStatusKor(row.original.active)
        const statusColor =
          status === "재직"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        return (
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
          >
            {status}
          </span>
        )
      },
    },
  ]

  // 페이지네이션 핸들러
  const handlePageChange = (nextPage) => {
    setTableSettings({ ...tableSettings, currentPage: nextPage })
  }
  const handlePageSizeChange = (e) => {
    setTableSettings({
      ...tableSettings,
      pageSize: Number(e.target.value),
      currentPage: 1,
    })
  }

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">작업자 목록</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <DataTable
            columns={columns}
            data={filtered}
            loading={isLoading}
            emptyMessage="작업자 정보가 없습니다."
            onRowClick={handleRowClick}
            enableGlobalFilter={false}
          />
        </div>
        {/* 우측: 컨트롤 섹션 */}
        <div className="w-full md:w-80 flex-shrink-0 space-y-6">
          {/* 상태 필터 */}
          <div className="flex space-x-2 mb-2">
            <FormButton
              onClick={() => setFilterOptions({ status: "all" })}
              variant={filterOptions.status === "all" ? "default" : "outline"}
              className="text-sm"
            >
              전체
            </FormButton>
            <FormButton
              onClick={() => setFilterOptions({ status: "active" })}
              variant={
                filterOptions.status === "active" ? "default" : "outline"
              }
              className="text-sm"
            >
              재직중
            </FormButton>
            <FormButton
              onClick={() => setFilterOptions({ status: "inactive" })}
              variant={
                filterOptions.status === "inactive" ? "default" : "outline"
              }
              className="text-sm"
            >
              퇴사
            </FormButton>
          </div>
          {/* 검색창 */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <FormInput
                type="text"
                className="pl-10"
                placeholder="이름으로 검색..."
                value={filterOptions.keyword}
                onChange={(e) =>
                  setFilterOptions({ keyword: e.target.value, currentPage: 1 })
                }
              />
            </div>
          </div>
          {/* 작업자 추가 버튼 */}
          <FormButton onClick={handleAddNew} className="w-full">
            <PlusCircle className="w-4 h-4 mr-2" />
            작업자 추가
          </FormButton>
          {/* 에러 메시지 표시 */}
          {isError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>데이터를 불러오는 중 오류가 발생했습니다: {error.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonnelList
