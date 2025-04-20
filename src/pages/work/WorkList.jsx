import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  useUnitPrices,
  useDeleteUnitPrice,
  useUpdateUnitPrice,
} from "../../lib/api/workQueries"
import { DataTable, FormButton, FormInput } from "../../components/molecules"
import { Pencil, Plus, Search, RefreshCw, Trash2 } from "lucide-react"
import { formatNumberKR } from "@/lib/utils/formatterUtils"
import Modal from "../../components/molecules/Modal"

const WorkList = () => {
  const navigate = useNavigate()

  // 데이터 상태 관리
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [rawUnitPrices, setRawUnitPrices] = useState([])
  const [paginationInfo, setPaginationInfo] = useState({})
  const {
    data: unitPrices,
    isLoading,
    refetch,
    error,
  } = useUnitPrices({
    keyword: searchTerm,
    page,
    size,
  })

  const deleteUnitPriceMutation = useDeleteUnitPrice()
  const updateUnitPriceMutation = useUpdateUnitPrice()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [targetDeleteId, setTargetDeleteId] = useState(null)
  const [editTargetId, setEditTargetId] = useState(null)
  const [editForm, setEditForm] = useState({
    type: "",
    code: "",
    name: "",
    spec: "",
    unit: "",
    material_cost: 0,
    labor_cost: 0,
    expense: 0,
  })

  // 삭제 버튼 클릭
  const handleDeleteClick = (id) => {
    setTargetDeleteId(id)
    setDeleteModalOpen(true)
  }

  // 삭제 확인
  const handleConfirmDelete = async () => {
    if (!targetDeleteId) return
    try {
      await deleteUnitPriceMutation.mutateAsync(targetDeleteId)
      setDeleteModalOpen(false)
      setTargetDeleteId(null)
      refetch()
    } catch (e) {
      // 에러 처리 필요시 추가
    }
  }

  // 삭제 취소
  const handleCancelDelete = () => {
    setDeleteModalOpen(false)
    setTargetDeleteId(null)
  }

  // 수정 버튼 클릭
  const handleEditClick = (row) => {
    setEditTargetId(row.id)
    setEditForm({
      type: row.type || "",
      code: row.code || "",
      name: row.name || "",
      spec: row.spec || "",
      unit: row.unit || "",
      material_cost: row.materialCost ?? 0,
      labor_cost: row.laborCost ?? 0,
      expense: row.expense ?? 0,
    })
    setEditModalOpen(true)
  }

  // 수정 폼 핸들러
  const handleEditFormChange = (e) => {
    const { name, value, type } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
  }

  // 수정 확인
  const handleConfirmEdit = async () => {
    if (!editTargetId) return
    try {
      await updateUnitPriceMutation.mutateAsync({
        id: editTargetId,
        unitPriceData: editForm,
      })
      setEditModalOpen(false)
      setEditTargetId(null)
      refetch()
    } catch (e) {
      // 에러 처리 필요시 추가
    }
  }

  // 수정 취소
  const handleCancelEdit = () => {
    setEditModalOpen(false)
    setEditTargetId(null)
  }

  const handleNavigateToCreate = () => {
    navigate("/works/create")
  }

  useEffect(() => {
    setRawUnitPrices(unitPrices?.data?.content)
    setPaginationInfo({
      currentPage: unitPrices?.data?.currentPage,
      hasNext: unitPrices?.data?.hasNext,
      hasPrevious: unitPrices?.data?.hasPrevious,
      size: unitPrices?.data?.size,
      totalElements: unitPrices?.data?.totalElements,
      totalPages: unitPrices?.data?.totalPages,
    })
  }, [unitPrices])

  // 데이터 테이블 컬럼 정의
  const columns = [
    {
      accessorKey: "type",
      header: "구분",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "code",
      header: "코드",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "name",
      header: "공종명",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "spec",
      header: "규격",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "unit",
      header: "단위",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "materialCost",
      header: "재료비",
      cell: (info) => formatNumberKR(info.getValue()) ?? null,
    },
    {
      accessorKey: "laborCost",
      header: "노무비",
      cell: (info) => formatNumberKR(info.getValue()) ?? null,
    },
    {
      accessorKey: "expense",
      header: "경비",
      cell: (info) => formatNumberKR(info.getValue()) ?? null,
    },
    {
      accessorKey: "totalCost",
      header: "합계",
      cell: (info) => formatNumberKR(info.getValue()) ?? null,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleEditClick(row.original)
            }}
            className="p-1 text-blue-600 hover:text-blue-800"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteClick(row.original.id)
            }}
            className="p-1 text-red-600 hover:text-red-800"
            title="삭제"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">일위대가 관리</h1>
        <div className="flex space-x-2">
          <FormButton
            variant="primary"
            onClick={handleNavigateToCreate}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            신규 일위대가
          </FormButton>
        </div>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="flex flex-col gap-4 mb-4 md:flex-row">
            <div className="relative flex-1">
              <FormInput
                type="text"
                placeholder="타입, 코드, 공종명, 규격 등으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="flex gap-2">
              <FormButton
                variant="outline"
                onClick={() => refetch()}
                className="flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                새로고침
              </FormButton>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={rawUnitPrices || []}
            loading={isLoading}
            emptyMessage={
              isLoading ? "데이터 로딩 중..." : "등록된 작업이 없습니다."
            }
            title="일위대가 목록"
            subtitle={`전체 ${
              paginationInfo.totalElements ? paginationInfo.totalElements : 0
            }개`}
            enableSorting={false}
          />

          {/* 데이터 상태 표시 (디버깅용) */}
          {error && (
            <div className="p-4 mt-4 text-red-700 border border-red-300 rounded-md bg-red-50">
              <p className="font-medium">에러 발생:</p>
              <p>{error.message}</p>
            </div>
          )}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        title="일위대가 삭제 확인"
        footer={
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={handleCancelDelete}
            >
              취소
            </button>
            <button
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              onClick={handleConfirmDelete}
              disabled={deleteUnitPriceMutation.isLoading}
            >
              삭제
            </button>
          </div>
        }
      >
        정말로 이 일위대가를 삭제하시겠습니까?
      </Modal>

      {/* 수정 모달 */}
      <Modal
        isOpen={editModalOpen}
        onClose={handleCancelEdit}
        title="일위대가 수정"
        footer={
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={handleCancelEdit}
            >
              취소
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleConfirmEdit}
              disabled={updateUnitPriceMutation.isLoading}
            >
              확인
            </button>
          </div>
        }
      >
        <form className="space-y-2">
          <FormInput
            label="구분"
            name="type"
            value={editForm.type}
            onChange={handleEditFormChange}
            required
          />
          <FormInput
            label="코드"
            name="code"
            value={editForm.code}
            onChange={handleEditFormChange}
            required
          />
          <FormInput
            label="공종명"
            name="name"
            value={editForm.name}
            onChange={handleEditFormChange}
            required
          />
          <FormInput
            label="규격"
            name="spec"
            value={editForm.spec}
            onChange={handleEditFormChange}
          />
          <FormInput
            label="단위"
            name="unit"
            value={editForm.unit}
            onChange={handleEditFormChange}
            required
          />
          <FormInput
            label="재료비"
            name="material_cost"
            type="number"
            value={editForm.material_cost}
            onChange={handleEditFormChange}
            min={0}
            required
          />
          <FormInput
            label="노무비"
            name="labor_cost"
            type="number"
            value={editForm.labor_cost}
            onChange={handleEditFormChange}
            min={0}
            required
          />
          <FormInput
            label="경비"
            name="expense"
            type="number"
            value={editForm.expense}
            onChange={handleEditFormChange}
            min={0}
            required
          />
        </form>
      </Modal>
    </div>
  )
}

export default WorkList
