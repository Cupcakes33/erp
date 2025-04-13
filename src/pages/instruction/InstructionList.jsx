import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInstructions } from "../../lib/api/instructionQueries";
import Table from "../../components/molecules/Table";
import Button from "../../components/atoms/Button";
import Card from "../../components/atoms/Card";
import Input from "../../components/atoms/Input";
import Select from "../../components/atoms/Select";

const InstructionList = () => {
  const navigate = useNavigate();
  const { data: instructions = [], isLoading, error } = useInstructions();

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleRowClick = (instruction) => {
    navigate(`/instructions/${instruction.id}`);
  };

  const handleCreateClick = () => {
    navigate("/instructions/create");
  };

  // 필터링된 지시 목록
  const filteredInstructions = instructions.filter((instruction) => {
    const matchesStatus = filters.status
      ? instruction.status === filters.status
      : true;
    const matchesPriority = filters.priority
      ? instruction.priority === filters.priority
      : true;
    const matchesSearch = filters.search
      ? instruction.title
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        instruction.id?.toLowerCase().includes(filters.search.toLowerCase()) ||
        instruction.location
          ?.toLowerCase()
          .includes(filters.search.toLowerCase())
      : true;

    return matchesStatus && matchesPriority && matchesSearch;
  });

  const columns = [
    { title: "지시 ID", dataIndex: "id", width: "120px" },
    { title: "제목", dataIndex: "title" },
    { title: "위치", dataIndex: "location" },
    {
      title: "상태",
      dataIndex: "status",
      render: (row) => {
        const statusClasses = {
          대기중: "bg-blue-100 text-blue-800",
          진행중: "bg-yellow-100 text-yellow-800",
          완료: "bg-green-100 text-green-800",
          취소: "bg-red-100 text-red-800",
        };

        return (
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              statusClasses[row.status] || "bg-gray-100"
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      title: "우선순위",
      dataIndex: "priority",
      render: (row) => {
        const priorityClasses = {
          높음: "text-red-600",
          중간: "text-yellow-600",
          낮음: "text-green-600",
        };

        return (
          <span
            className={`font-medium ${priorityClasses[row.priority] || ""}`}
          >
            {row.priority}
          </span>
        );
      },
    },
    { title: "담당자", dataIndex: "assignedTo" },
    { title: "생성일", dataIndex: "createdAt" },
    { title: "마감일", dataIndex: "dueDate" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">지시 관리</h1>
        <Button
          variant="primary"
          onClick={handleCreateClick}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          새 지시 생성
        </Button>
      </div>

      <Card className="p-4 mb-6 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            id="search"
            name="search"
            placeholder="지시 ID, 제목, 위치 검색"
            value={filters.search}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Select
            id="status"
            name="status"
            placeholder="상태 선택"
            value={filters.status}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "모든 상태" },
              { value: "대기중", label: "대기중" },
              { value: "진행중", label: "진행중" },
              { value: "완료", label: "완료" },
              { value: "취소", label: "취소" },
            ]}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Select
            id="priority"
            name="priority"
            placeholder="우선순위 선택"
            value={filters.priority}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "모든 우선순위" },
              { value: "높음", label: "높음" },
              { value: "중간", label: "중간" },
              { value: "낮음", label: "낮음" },
            ]}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>

      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
          {error instanceof Error
            ? error.message
            : "데이터를 불러오는 중 오류가 발생했습니다."}
        </div>
      )}

      <Card className="overflow-hidden bg-white rounded-lg shadow-md">
        <Table
          columns={columns}
          data={filteredInstructions}
          isLoading={isLoading}
          emptyMessage="조회된 지시가 없습니다."
          onRowClick={handleRowClick}
          className="min-w-full divide-y divide-gray-200"
        />
      </Card>
    </div>
  );
};

export default InstructionList;
