import React from "react";
import { useNavigate } from "react-router-dom";
import { usePersonnelStore } from "../../lib/zustand";
import {
  useWorkers,
  useToggleWorkerStatus,
} from "../../lib/api/personnelQueries";
import Button from "../../components/atoms/Button";
import Table from "../../components/molecules/Table";

/**
 * 인사 관리 목록 페이지
 */
const PersonnelList = () => {
  const navigate = useNavigate();
  const { filterOptions, setFilterOptions } = usePersonnelStore();

  // React Query 훅을 사용하여 작업자 데이터 가져오기
  const { data: workers = [], isLoading, isError, error } = useWorkers();
  const toggleStatusMutation = useToggleWorkerStatus();

  // 상태 필터링
  const filteredWorkers = workers.filter((worker) => {
    return (
      filterOptions.status === "all" || worker.status === filterOptions.status
    );
  });

  // 상세 보기 페이지로 이동
  const handleViewDetails = (workerId) => {
    navigate(`/personnel/${workerId}`);
  };

  // 편집 페이지로 이동
  const handleEdit = (workerId) => {
    navigate(`/personnel/edit/${workerId}`);
  };

  // 상태 변경 처리
  const handleToggleStatus = (workerId) => {
    toggleStatusMutation.mutate(workerId);
  };

  // 새 작업자 추가 페이지로 이동
  const handleAddNew = () => {
    navigate("/personnel/create");
  };

  // 테이블 컬럼 정의
  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "이름", dataIndex: "name" },
    { title: "생년월일", dataIndex: "birthDate" },
    { title: "전화번호", dataIndex: "phone" },
    { title: "직위", dataIndex: "position" },
    {
      title: "상태",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            row.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status === "active" ? "재직중" : "퇴사"}
        </span>
      ),
    },
    {
      title: "작업",
      render: (row) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => handleViewDetails(row.id)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            보기
          </Button>
          <Button
            size="sm"
            onClick={() => handleEdit(row.id)}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            편집
          </Button>
          <Button
            size="sm"
            onClick={() => handleToggleStatus(row.id)}
            className={
              row.status === "active"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }
          >
            {row.status === "active" ? "퇴사 처리" : "재직 처리"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">인사 관리</h1>
        <Button
          onClick={handleAddNew}
          className="bg-blue-500 hover:bg-blue-600"
        >
          새 작업자 추가
        </Button>
      </div>

      {/* 필터 버튼 */}
      <div className="mb-6 flex space-x-2">
        <Button
          onClick={() => setFilterOptions({ status: "all" })}
          className={`${
            filterOptions.status === "all"
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          전체
        </Button>
        <Button
          onClick={() => setFilterOptions({ status: "active" })}
          className={`${
            filterOptions.status === "active"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          재직중
        </Button>
        <Button
          onClick={() => setFilterOptions({ status: "inactive" })}
          className={`${
            filterOptions.status === "inactive"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          퇴사
        </Button>
      </div>

      {/* 로딩 상태나 에러가 있으면 먼저 처리 */}
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* 에러 메시지 표시 */}
      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>데이터를 불러오는 중 오류가 발생했습니다: {error.message}</p>
        </div>
      )}

      {/* 데이터 로드가 완료되면 테이블 표시 */}
      {!isLoading && !isError && (
        <Table
          columns={columns}
          data={filteredWorkers}
          isLoading={isLoading}
          emptyMessage="표시할 작업자가 없습니다."
        />
      )}
    </div>
  );
};

export default PersonnelList;
