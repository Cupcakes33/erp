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
import { PlusCircle, Search, Edit, Eye } from "lucide-react";

/**
 * 인사 관리 목록 페이지
 */
const PersonnelList = () => {
  const navigate = useNavigate();
  const { filterOptions, setFilterOptions } = usePersonnelStore();
  const { data: workers = [], isLoading, isError, error } = useWorkers();
  const toggleStatusMutation = useToggleWorkerStatus();
  const [searchTerm, setSearchTerm] = useState("");

  // 필터링 적용 (상태 필터 + 검색어)
  const filteredWorkers = workers.filter((worker) => {
    const matchesStatus =
      filterOptions.status === "all" || worker.status === filterOptions.status;
    const matchesSearch =
      searchTerm === "" ||
      worker.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // 작업자 추가 페이지로 이동
  const handleAddNew = () => {
    navigate("/personnel/create");
  };

  // 작업자 편집 페이지로 이동
  const handleEdit = (workerId) => {
    navigate(`/personnel/${workerId}/edit`);
  };

  // 작업자 상태 토글 (재직/퇴사)
  const handleToggleStatus = (workerId) => {
    toggleStatusMutation.mutate(workerId);
  };

  // 작업자 상세 보기 페이지로 이동
  const handleRowClick = (worker) => {
    navigate(`/personnel/${worker.id}`);
  };

  // 테이블 컬럼 정의
  const columns = [
    { header: "ID", accessor: "id", className: "w-16" },
    { header: "이름", accessor: "name" },
    { header: "생년월일", accessor: "birthDate" },
    { header: "연락처", accessor: "phone" },
    { header: "직급", accessor: "position" },
    {
      header: "상태",
      accessor: "status",
      cell: (row) => {
        let statusColor;
        switch (row.status) {
          case "active":
            statusColor = "bg-green-100 text-green-800";
            break;
          case "inactive":
            statusColor = "bg-red-100 text-red-800";
            break;
          default:
            statusColor = "bg-gray-100 text-gray-800";
        }
        return (
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
          >
            {row.status === "active" ? "재직중" : "퇴사"}
          </span>
        );
      },
    },
    {
      header: "액션",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/personnel/${row.id}`);
            }}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="상세보기"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/personnel/${row.id}/edit`);
            }}
            className="p-1 text-gray-600 hover:text-gray-800"
            title="수정하기"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">작업자 목록</h1>
        <FormButton onClick={handleAddNew}>
          <PlusCircle className="w-4 h-4 mr-2" />
          작업자 추가
        </FormButton>
      </div>

      {/* 필터 버튼 */}
      <div className="mb-4 flex space-x-2">
        <FormButton
          onClick={() => setFilterOptions({ status: "all" })}
          variant={filterOptions.status === "all" ? "default" : "outline"}
          className="text-sm"
        >
          전체
        </FormButton>
        <FormButton
          onClick={() => setFilterOptions({ status: "active" })}
          variant={filterOptions.status === "active" ? "default" : "outline"}
          className="text-sm"
        >
          재직중
        </FormButton>
        <FormButton
          onClick={() => setFilterOptions({ status: "inactive" })}
          variant={filterOptions.status === "inactive" ? "default" : "outline"}
          className="text-sm"
        >
          퇴사
        </FormButton>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <FormInput
            type="text"
            className="pl-10"
            placeholder="이름, 직급, 연락처로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 에러 메시지 표시 */}
      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>데이터를 불러오는 중 오류가 발생했습니다: {error.message}</p>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredWorkers}
        loading={isLoading}
        emptyMessage="작업자 정보가 없습니다."
        onRowClick={handleRowClick}
        title="작업자 목록"
        subtitle={`전체 ${filteredWorkers.length}명`}
      />
    </div>
  );
};

export default PersonnelList;
