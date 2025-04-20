import React, { useState, useEffect, useRef } from "react"
import usePersonnelStore, { filterWorkers } from "../../lib/zustand/personnel"
import {
  useWorkers,
  useCreateWorker,
  useUpdateWorker,
} from "../../lib/api/personnelQueries"
import {
  DataTable,
  FormButton,
  FormInput,
  FormSelect,
} from "../../components/molecules"
import { PlusCircle, Search } from "lucide-react"
import Modal from "../../components/molecules/Modal"

/**
 * 인사 관리 목록 페이지
 */
const PersonnelList = () => {
  const {
    filterOptions,
    setFilterOptions,
    sortBy,
    setSortBy,
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

  // 모달 상태 관리
  const [modal, setModal] = useState({ type: null, open: false, data: null })
  const [modalName, setModalName] = useState("")
  const [modalStatus, setModalStatus] = useState("active")
  const [modalError, setModalError] = useState("")

  // 모달 열기 핸들러
  const openAddModal = () => {
    setModal({ type: "add", open: true, data: null })
    setModalName("")
    setModalError("")
  }
  const openEditModal = (worker) => {
    setModal({ type: "edit", open: true, data: worker })
    setModalName(worker.name)
    setModalStatus(worker.active ? "active" : "inactive")
    setModalError("")
  }
  const closeModal = () => {
    setModal({ type: null, open: false, data: null })
    setModalError("")
  }

  // 추가/수정 API 연결
  const { mutate: createWorker } = useCreateWorker() // 기존 훅에서 create 함수 분리 필요시 수정
  const { mutate: updateWorker } = useUpdateWorker() // 수정용 훅 분리 필요시 수정

  const handleAdd = (e) => {
    e.preventDefault()
    if (!modalName.trim()) {
      setModalError("이름을 입력하세요.")
      return
    }
    createWorker({ name: modalName }, { onSuccess: closeModal })
  }
  const handleEdit = (e) => {
    e.preventDefault()
    if (!modalName.trim()) {
      setModalError("이름을 입력하세요.")
      return
    }
    // 수정 API 호출
    updateWorker(
      { id: modal.data.id, name: modalName, active: modalStatus === "active" },
      { onSuccess: closeModal },
    )
    // (실제 API에 맞게 수정)
  }

  // 검색 입력값 로컬 상태
  const [searchInput, setSearchInput] = useState(filterOptions.keyword || "")
  const debounceTimer = useRef(null)

  // 검색 input 변경 핸들러 (즉시 반영)
  const handleKeywordChange = (e) => {
    const value = e.target.value
    setSearchInput(value)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      setFilterOptions({ keyword: value, currentPage: 1 })
    }, 500)
  }

  // filterOptions.keyword가 외부에서 바뀔 때 input도 동기화
  useEffect(() => {
    setSearchInput(filterOptions.keyword || "")
  }, [filterOptions.keyword])

  // 컬럼 정의
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      className: "w-16 text-center px-2",
      enableSorting: true,
      sortDescFirst: false,
    },
    {
      accessorKey: "name",
      header: "이름",
      className: "px-2",
      enableSorting: true,
      sortDescFirst: false,
    },
    {
      accessorKey: "active",
      header: "상태",
      className: "px-2",
      enableSorting: true,
      sortDescFirst: false,
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
    {
      id: "edit",
      header: "",
      className: "w-24 text-center px-2 !pr-0",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <button
            type="button"
            className="px-3 py-1 rounded bg-blue-500 text-white text-xs hover:bg-blue-600 transition"
            onClick={(e) => {
              e.stopPropagation()
              openEditModal(row.original)
            }}
          >
            수정
          </button>
        </div>
      ),
      enableSorting: false,
      enableFiltering: false,
    },
  ]

  // 정렬 핸들러
  const handleSortingChange = (sortingState) => {
    console.log("정렬 상태 변경:", sortingState)

    if (sortingState.length === 0) {
      // 정렬이 없는 경우 기본 ID 오름차순으로 설정
      setSortBy({ field: "id", direction: "asc" })
      return
    }

    const column = sortingState[0]
    setSortBy({
      field: column.id,
      direction: column.desc ? "desc" : "asc",
    })

    console.log("정렬 변경:", {
      field: column.id,
      direction: column.desc ? "desc" : "asc",
    })
  }

  // 페이지네이션 핸들러
  const handlePageChange = (nextPage) => {
    setTableSettings({ ...tableSettings, currentPage: nextPage + 1 })
  }

  const handlePageSizeChange = (newSize) => {
    const size = Number(newSize)
    console.log("페이지 크기 변경:", size)
    setTableSettings({
      ...tableSettings,
      pageSize: size,
      currentPage: 1,
    })
  }

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">인사 관리</h1>
        <p className="text-gray-600">작업자 목록 관리</p>
      </div>

      {/* 메인 레이아웃: 왼쪽 테이블, 오른쪽 필터/컨트롤 */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* 데이터 테이블 (왼쪽) */}
        <div className="flex-1">
          <DataTable
            columns={columns}
            data={filtered}
            loading={isLoading}
            emptyMessage={
              isError ? `오류 발생: ${error?.message}` : "작업자가 없습니다."
            }
            onRowClick={openEditModal}
            manualPagination={true}
            pageCount={totalPage}
            pageIndex={tableSettings.currentPage - 1}
            pageSize={tableSettings.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            manualSorting={true}
            onSortingChange={handleSortingChange}
            state={{
              sorting: sortBy.field
                ? [{ id: sortBy.field, desc: sortBy.direction === "desc" }]
                : [],
            }}
          />
        </div>

        {/* 우측: 컨트롤 섹션 */}
        <div className="w-full md:w-80 flex-shrink-0 space-y-6">
          {/* 상태 필터 */}
          <div className="flex space-x-2 mb-2">
            <FormButton
              onClick={() =>
                setFilterOptions({ status: "all", currentPage: 1 })
              }
              variant={filterOptions.status === "all" ? "default" : "outline"}
              className="text-sm"
            >
              전체
            </FormButton>
            <FormButton
              onClick={() =>
                setFilterOptions({ status: "active", currentPage: 1 })
              }
              variant={
                filterOptions.status === "active" ? "default" : "outline"
              }
              className="text-sm"
            >
              재직중
            </FormButton>
            <FormButton
              onClick={() =>
                setFilterOptions({ status: "inactive", currentPage: 1 })
              }
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
                value={searchInput}
                onChange={handleKeywordChange}
              />
            </div>
          </div>
          {/* 작업자 추가 버튼 */}
          <FormButton onClick={openAddModal} className="w-full">
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

      {/* 모달 */}
      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        title={modal.type === "add" ? "작업자 추가" : "작업자 정보 수정"}
      >
        <form onSubmit={modal.type === "add" ? handleAdd : handleEdit}>
          <FormInput
            label="이름"
            value={modalName}
            onChange={(e) => setModalName(e.target.value)}
            required
            autoFocus
          />
          {modal.type === "edit" && (
            <FormSelect
              label="상태"
              value={modalStatus}
              onChange={(e) => setModalStatus(e.target.value)}
              options={[
                { value: "active", label: "재직" },
                { value: "inactive", label: "퇴사" },
              ]}
            />
          )}
          {modalError && (
            <div className="text-red-500 text-sm mb-2">{modalError}</div>
          )}
          <div className="flex justify-end gap-2 mt-6">
            <FormButton type="button" variant="outline" onClick={closeModal}>
              취소
            </FormButton>
            <FormButton type="submit">
              {modal.type === "add" ? "추가" : "저장"}
            </FormButton>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default PersonnelList
