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

// 상태와 우선순위 매핑 객체
const STATUS_MAP = {
  RECEIVED: { label: "접수", color: "yellow" },
  IN_PROGRESS: { label: "작업중", color: "blue" },
  COMPLETED: { label: "완료", color: "green" },
  CANCELED: { label: "취소", color: "red" },
  CONFIRMED: { label: "확정", color: "purple" },
};

const PRIORITY_MAP = {
  HIGH: { label: "높음", color: "red" },
  MEDIUM: { label: "중간", color: "yellow" },
  LOW: { label: "낮음", color: "green" },
};

const InstructionList = () => {
  const navigate = useNavigate();
  const [filterParams, setFilterParams] = useState({
    status: "",
    page: 1,
    size: 10,
  });

  const {
    data: instructionData = {
      instruction: [],
      totalCount: 0,
      totalPage: 0,
      currentPage: 1,
    },
    isLoading,
    error,
  } = useInstructions(filterParams);

  // 실제 지시 배열 추출
  const instructions = instructionData.instruction || [];

  // 디버깅을 위한 데이터 로그
  console.log("[InstructionList] 지시 데이터:", instructions);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
  });

  // 테이블에 표시할 컬럼 선택 상태
  const [visibleColumns, setVisibleColumns] = useState([
    "id",
    "title",
    "priority",
    "status",
    "location",
    "manager",
    "receiver",
    "createdAt",
    "dueDate",
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });

    // API 필터링을 위한 상태 업데이트
    if (name === "status") {
      setFilterParams({
        ...filterParams,
        status: value,
        page: 1, // 필터 변경 시 첫 페이지로 돌아가기
      });
    }
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

  // 긴 텍스트 자르기 유틸리티 함수
  const truncateText = (text, length = 20) => {
    if (!text) return "";
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  // 필터링된 지시 목록 (검색어 및 우선순위에 대한 클라이언트 측 필터링)
  const filteredInstructions = instructions.filter((instruction) => {
    const matchesPriority = filters.priority
      ? instruction.priority === filters.priority
      : true;
    const matchesSearch = filters.search
      ? instruction.title
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        String(instruction.id)
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        instruction.location
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        instruction.address
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        instruction.manager
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        instruction.receiver
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        instruction.channel
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        instruction.description
          ?.toLowerCase()
          .includes(filters.search.toLowerCase())
      : true;

    return matchesPriority && matchesSearch;
  });

  // 상태에 따른 배경색 클래스 반환
  const getStatusClass = (status) => {
    const statusInfo = STATUS_MAP[status] || { color: "gray" };
    return `bg-${statusInfo.color}-100 text-${statusInfo.color}-800`;
  };

  // 우선순위에 따른 배경색 클래스 반환
  const getPriorityClass = (priority) => {
    const priorityInfo = PRIORITY_MAP[priority] || { color: "gray" };
    return `bg-${priorityInfo.color}-100 text-${priorityInfo.color}-800`;
  };

  // 즐겨찾기 표시 함수
  const renderFavorite = (value) => {
    return value ? "⭐" : "";
  };

  // 모든 가능한 컬럼 정의
  const allColumns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-medium text-blue-600">{row.getValue("id")}</span>
      ),
    },
    {
      accessorKey: "title",
      header: "제목",
      cell: ({ row }) => truncateText(row.getValue("title"), 25),
    },
    {
      accessorKey: "priority",
      header: "우선순위",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClass(
            row.getValue("priority")
          )}`}
        >
          {PRIORITY_MAP[row.getValue("priority")]?.label ||
            row.getValue("priority")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
            row.getValue("status")
          )}`}
        >
          {STATUS_MAP[row.getValue("status")]?.label || row.getValue("status")}
        </span>
      ),
    },
    { accessorKey: "createdAt", header: "생성일" },
    { accessorKey: "dueDate", header: "마감일" },
    {
      accessorKey: "location",
      header: "위치",
      cell: ({ row }) => truncateText(row.getValue("location"), 15),
    },
    {
      accessorKey: "address",
      header: "주소",
      cell: ({ row }) => truncateText(row.getValue("address"), 20),
    },
    {
      accessorKey: "description",
      header: "내용",
      cell: ({ row }) => truncateText(row.getValue("description"), 30),
    },
    {
      accessorKey: "manager",
      header: "관리자",
      cell: ({ row }) => truncateText(row.getValue("manager"), 10),
    },
    {
      accessorKey: "receiver",
      header: "담당자",
      cell: ({ row }) => truncateText(row.getValue("receiver"), 10),
    },
    { accessorKey: "channel", header: "접수 채널" },
  ];

  // 필터링된 컬럼
  const filteredColumns = allColumns.filter((column) =>
    visibleColumns.includes(column.accessorKey)
  );

  const handlePageChange = (newPage) => {
    setFilterParams({
      ...filterParams,
      page: newPage,
    });
  };

  const statusOptions = [
    { value: "", label: "모든 상태" },
    ...Object.entries(STATUS_MAP).map(([value, { label }]) => ({
      value,
      label,
    })),
  ];

  const priorityOptions = [
    { value: "", label: "모든 우선순위" },
    ...Object.entries(PRIORITY_MAP).map(([value, { label }]) => ({
      value,
      label,
    })),
  ];

  const columnOptions = allColumns.map((column) => ({
    value: column.accessorKey,
    label: column.header,
  }));

  const handleVisibleColumnsChange = (e) => {
    const { value } = e.target;
    setVisibleColumns((prev) =>
      prev.includes(value)
        ? prev.filter((col) => col !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">지시 목록</h1>

      {/* 필터 및 버튼 영역 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 mb-6">
        <div className="md:col-span-8">
          <FormCard className="shadow-sm">
            <div className="flex flex-wrap gap-2">
              <div className="w-full md:w-auto">
                <FormSelect
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  options={statusOptions}
                  placeholder="상태 필터"
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-auto">
                <FormSelect
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                  options={priorityOptions}
                  placeholder="우선순위 필터"
                  className="w-full"
                />
              </div>
              <div className="flex-grow">
                <div className="relative">
                  <FormInput
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="검색..."
                    className="w-full pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </FormCard>
        </div>
        <div className="md:col-span-4">
          <FormCard className="shadow-sm">
            <div className="flex flex-wrap gap-2 justify-end">
              <FormButton
                variant="primary"
                onClick={handleAddClick}
                className="flex-grow md:flex-grow-0"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                등록
              </FormButton>
              <FormButton
                variant="outline"
                onClick={handleImportClick}
                className="flex-grow md:flex-grow-0"
              >
                <FileUp className="w-5 h-5 mr-2" />
                가져오기
              </FormButton>
              <FormButton
                variant="outline"
                onClick={handleExportClick}
                className="flex-grow md:flex-grow-0"
              >
                <FileDown className="w-5 h-5 mr-2" />
                내보내기
              </FormButton>
            </div>
          </FormCard>
        </div>
      </div>

      {/* 컬럼 선택 영역 */}
      <FormCard className="mb-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            표시할 컬럼 선택:
          </p>
          <div className="flex flex-wrap gap-2">
            {columnOptions.map((option) => (
              <label
                key={option.value}
                className="inline-flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                  checked={visibleColumns.includes(option.value)}
                  onChange={() =>
                    handleVisibleColumnsChange({
                      target: { value: option.value },
                    })
                  }
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </FormCard>

      {/* 데이터 테이블 */}
      <FormCard className="shadow-md">
        <DataTable
          columns={filteredColumns}
          data={filteredInstructions}
          isLoading={isLoading}
          error={error}
          onRowClick={handleRowClick}
          pagination={{
            currentPage: instructionData.currentPage || 1,
            totalPages: instructionData.totalPage || 1,
            onPageChange: handlePageChange,
          }}
          emptyMessage="지시 데이터가 없습니다."
          errorMessage="지시 목록을 불러오는 데 실패했습니다."
        />
      </FormCard>
    </div>
  );
};

export default InstructionList;
