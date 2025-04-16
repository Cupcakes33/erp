import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePersonnelStore } from "../../lib/zustand";
import {
  useWorkers,
  useToggleWorkerStatus,
} from "../../lib/api/personnelQueries";
import {
  DataTable,
  FormButton,
  FormInput,
  FormSelect,
} from "../../components/molecules";
import { PlusCircle, Search, Edit, Eye, UserCheck, UserX } from "lucide-react";

/**
 * 인사 관리 목록 페이지
 */
const PersonnelList = () => {
  const navigate = useNavigate();
  const { filterOptions, setFilterOptions } = usePersonnelStore();
  const {
    data: workersData = { worker: [] },
    isLoading,
    isError,
    error,
  } = useWorkers();
  const toggleStatusMutation = useToggleWorkerStatus();
  const [searchTerm, setSearchTerm] = useState("");

  // 실제 작업자 배열 추출
  const workers = workersData.worker || [];

  // 디버깅을 위한 데이터 로그
  console.log("[PersonnelList] 작업자 데이터:", workers);

  // 상태 영문 → 한글 변환 함수
  const getStatusKor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "재직";
      case "RESIGNED":
        return "퇴사";
      default:
        return status;
    }
  };

  // 필터링 적용 (상태 필터 + 검색어)
  const filteredWorkers = workers
    .map((worker) => ({
      ...worker,
      statusKor: getStatusKor(worker.status),
    }))
    .filter((worker) => {
      // '재직'/'퇴사' 상태를 사용하도록 필터링 로직 수정
      const matchesStatus =
        filterOptions.status === "all" ||
        (filterOptions.status === "active" && worker.statusKor === "재직") ||
        (filterOptions.status === "inactive" && worker.statusKor === "퇴사");

      const matchesSearch =
        searchTerm === "" ||
        worker.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.statusKor?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });

  // 작업자 추가 페이지로 이동
  const handleAddNew = () => {
    navigate("/personnel/create");
  };

  // 작업자 상태 토글 (재직/퇴사)
  const handleToggleStatus = (workerId, e) => {
    e.stopPropagation();
    toggleStatusMutation.mutate(workerId);
  };

  // 작업자 상세 보기 페이지로 이동
  const handleRowClick = (worker) => {
    navigate(`/personnel/${worker.id}`);
  };

  // 모든 가능한 컬럼 정의 (id, 이름, 상태)
  const allColumns = [
    { accessorKey: "id", header: "ID", className: "w-16 text-center" },
    { accessorKey: "name", header: "이름" },
    {
      accessorKey: "statusKor",
      header: "상태",
      cell: ({ row }) => {
        let statusColor;
        const status = row.getValue("statusKor");
        switch (status) {
          case "재직":
            statusColor = "bg-green-100 text-green-800";
            break;
          case "퇴사":
            statusColor = "bg-red-100 text-red-800";
            break;
          default:
            statusColor = "bg-gray-100 text-gray-800";
        }
        return (
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  // 현재 화면에 표시할 컬럼들 (id, 이름, 상태)
  const columns = allColumns;

  return (
    <div className="mx-auto px-4 py-6">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">작업자 목록</h1>
      </div>
      {/* 2분할 레이아웃 */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* 좌측: 테이블 */}
        <div className="flex-1">
          <DataTable
            columns={columns}
            data={filteredWorkers}
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
                placeholder="이름, 상태로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
  );
};

export default PersonnelList;
