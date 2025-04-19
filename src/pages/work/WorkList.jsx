import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUnitPrices } from "../../lib/api/workQueries"
import { DataTable, FormButton, FormInput } from "../../components/molecules"
import { Eye, Pencil, Plus, Search, FileUp, RefreshCw } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"

const WorkList = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // 데이터 상태 관리
  const unitPricesQuery = useUnitPrices()
  const { data: works, isLoading, refetch, error } = unitPricesQuery
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredWorks, setFilteredWorks] = useState([])

  // 컴포넌트 마운트 시 강제로 데이터 로드
  useEffect(() => {
    console.log("[WorkList] 컴포넌트 마운트됨")

    // React Query 캐시 초기화
    queryClient.invalidateQueries({ queryKey: ["works"] })

    // 즉시 데이터 리로드
    refetch().then((result) => {
      console.log("[WorkList] 리페치 결과:", result)
    })
  }, [])

  // works 데이터가 변경될 때마다 필터링 로직 적용
  useEffect(() => {
    console.log("[WorkList] works 변경됨:", works)
    if (works && Array.isArray(works)) {
      console.log("[WorkList] works는 배열이고 길이:", works.length)
      const filtered = works.filter((work) => {
        return (
          searchTerm === "" ||
          (work.id &&
            work.id
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (work.typeId &&
            work.typeId
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (work.typeName &&
            work.typeName
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (work.specification &&
            work.specification
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
        )
      })
      console.log("[WorkList] 필터링된 데이터:", filtered)
      setFilteredWorks(filtered)
    } else {
      console.log("[WorkList] works가 없거나 배열이 아님")
      setFilteredWorks([])
    }
  }, [works, searchTerm])

  const handleNavigateToCreate = () => {
    navigate("/works/create")
  }

  const handleNavigateToImport = () => {
    navigate("/works/import")
  }

  const handleNavigateToDetail = (workId) => {
    navigate(`/works/${workId}`)
  }

  const handleNavigateToEdit = (workId) => {
    navigate(`/works/${workId}/edit`)
  }

  // 강제 리로드 함수
  const handleForceRefetch = () => {
    console.log("[WorkList] 강제 리로드 시작")
    queryClient.invalidateQueries({ queryKey: ["works"] })
    refetch({ force: true }).then((result) => {
      console.log("[WorkList] 강제 리로드 결과:", result)
    })
  }

  // 수동 데이터 설정 함수
  const handleDebugData = () => {
    console.log("[WorkList] 디버그 데이터 설정")
    const mockData = [
      {
        id: "W-001",
        typeId: "TP-001",
        typeName: "아스팔트 포장",
        specification: "두께 50mm",
        unit: "㎡",
        materialCost: 15000,
        laborCost: 25000,
        expenseCost: 5000,
        totalCost: 45000,
      },
      {
        id: "W-002",
        typeId: "TP-002",
        typeName: "보도블럭 설치",
        specification: "300x300mm",
        unit: "㎡",
        materialCost: 20000,
        laborCost: 30000,
        expenseCost: 3000,
        totalCost: 53000,
      },
    ]
    setFilteredWorks(mockData)
    console.log("[WorkList] 수동으로 mock 데이터 설정됨:", mockData)
  }

  // 데이터 테이블 컬럼 정의
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "공종 ID",
      accessorKey: "typeId",
    },
    {
      header: "공종명",
      accessorKey: "typeName",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("typeName")}</div>
      ),
    },
    {
      header: "규격",
      accessorKey: "specification",
    },
    {
      header: "단위",
      accessorKey: "unit",
    },
    {
      header: "재료비",
      accessorKey: "materialCost",
      cell: ({ row }) => (
        <div className="text-right">
          {Number(row.getValue("materialCost")).toLocaleString()}원
        </div>
      ),
    },
    {
      header: "노무비",
      accessorKey: "laborCost",
      cell: ({ row }) => (
        <div className="text-right">
          {Number(row.getValue("laborCost")).toLocaleString()}원
        </div>
      ),
    },
    {
      header: "경비",
      accessorKey: "expenseCost",
      cell: ({ row }) => (
        <div className="text-right">
          {Number(row.getValue("expenseCost")).toLocaleString()}원
        </div>
      ),
    },
    {
      header: "합계",
      accessorKey: "totalCost",
      cell: ({ row }) => (
        <div className="font-medium text-right">
          {Number(row.getValue("totalCost")).toLocaleString()}원
        </div>
      ),
    },
    {
      header: "액션",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNavigateToDetail(row.original.id)
            }}
            className="p-1 text-blue-600 hover:text-blue-800"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNavigateToEdit(row.original.id)
            }}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            <Pencil size={16} />
          </button>
        </div>
      ),
    },
  ]

  // 현재 데이터 상태 표시
  console.log("[WorkList] 렌더링 - filteredWorks:", filteredWorks)

  return (
    <div className="mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">일위대가 관리</h1>
        <div className="flex space-x-2">
          <FormButton
            variant="outline"
            onClick={handleNavigateToImport}
            className="flex items-center"
          >
            <FileUp className="w-4 h-4 mr-2" />
            데이터 가져오기
          </FormButton>
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
                placeholder="ID, 공종ID, 공종명, 규격으로 검색..."
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
            data={filteredWorks || []}
            loading={isLoading}
            onRowClick={(row) => handleNavigateToDetail(row.id)}
            emptyMessage={
              isLoading ? "데이터 로딩 중..." : "등록된 작업이 없습니다."
            }
            title="일위대가 목록"
            subtitle={`전체 ${filteredWorks ? filteredWorks.length : 0}개`}
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
    </div>
  )
}

export default WorkList
