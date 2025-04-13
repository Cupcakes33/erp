import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInstructions } from "../../lib/api/instructionQueries";
import {
  DataTable,
  FormButton,
  FormCard,
  FormInput,
  FormSelect,
} from "../../components/molecules";
import { PlusCircle, Search, FileDown, FileUp } from "lucide-react";

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

  const handleAddClick = () => {
    navigate("/instructions/create");
  };

  const handleImportClick = () => {
    navigate("/instructions/import");
  };

  const handleExportClick = () => {
    navigate("/instructions/export");
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

  // 상태에 따른 배경색 클래스 반환
  const getStatusClass = (status) => {
    switch (status) {
      case "대기중":
        return "bg-yellow-100 text-yellow-800";
      case "진행중":
        return "bg-blue-100 text-blue-800";
      case "완료":
        return "bg-green-100 text-green-800";
      case "취소":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 우선순위에 따른 배경색 클래스 반환
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "높음":
        return "bg-red-100 text-red-800";
      case "중간":
        return "bg-yellow-100 text-yellow-800";
      case "낮음":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 테이블 컬럼 정의
  const columns = [
    { header: "ID", accessor: "id", className: "font-medium text-blue-600" },
    { header: "제목", accessor: "title" },
    { header: "위치", accessor: "location" },
    {
      header: "상태",
      accessor: "status",
      cell: (row) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
            row.status
          )}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "우선순위",
      accessor: "priority",
      cell: (row) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClass(
            row.priority
          )}`}
        >
          {row.priority}
        </span>
      ),
    },
    { header: "생성일", accessor: "createdAt" },
    { header: "마감일", accessor: "dueDate" },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">지시 목록</h1>
        <div className="flex space-x-2">
          <FormButton variant="outline" onClick={handleExportClick} size="sm">
            <FileDown className="w-4 h-4 mr-2" />
            내보내기
          </FormButton>
          <FormButton variant="outline" onClick={handleImportClick} size="sm">
            <FileUp className="w-4 h-4 mr-2" />
            가져오기
          </FormButton>
          <FormButton onClick={handleAddClick}>
            <PlusCircle className="w-4 h-4 mr-2" />
            지시 추가
          </FormButton>
        </div>
      </div>

      <FormCard className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormSelect
            name="status"
            label="상태"
            value={filters.status}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "모든 상태" },
              { value: "대기중", label: "대기중" },
              { value: "진행중", label: "진행중" },
              { value: "완료", label: "완료" },
              { value: "취소", label: "취소" },
            ]}
          />
          <FormSelect
            name="priority"
            label="우선순위"
            value={filters.priority}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "모든 우선순위" },
              { value: "높음", label: "높음" },
              { value: "중간", label: "중간" },
              { value: "낮음", label: "낮음" },
            ]}
          />
          <FormInput
            name="search"
            label="검색"
            placeholder="제목, ID 또는 위치로 검색"
            value={filters.search}
            onChange={handleFilterChange}
            prefix={<Search className="w-4 h-4 text-gray-400" />}
          />
        </div>
      </FormCard>

      <DataTable
        columns={columns}
        data={filteredInstructions}
        loading={isLoading}
        onRowClick={handleRowClick}
        emptyMessage="지시 정보가 없습니다."
      />
    </div>
  );
};

export default InstructionList;
