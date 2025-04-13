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

    return matchesStatus && matchesPriority && matchesSearch;
  });

  // 상태에 따른 배경색 클래스 반환
  const getStatusClass = (status) => {
    switch (status) {
      case "접수":
        return "bg-yellow-100 text-yellow-800";
      case "작업중":
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
          {row.getValue("priority")}
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
          {row.getValue("status")}
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
    { accessorKey: "manager", header: "관리자" },
    { accessorKey: "receiver", header: "담당자" },
    { accessorKey: "channel", header: "접수채널" },
    {
      accessorKey: "description",
      header: "설명",
      cell: ({ row }) => truncateText(row.getValue("description"), 30),
    },
    {
      accessorKey: "works",
      header: "작업번호",
      cell: ({ row }) => {
        const works = row.getValue("works");
        return works ? works.join(", ") : "";
      },
    },
    {
      accessorKey: "favorite",
      header: "즐겨찾기",
      cell: ({ row }) => renderFavorite(row.getValue("favorite")),
    },
    { accessorKey: "paymentRound", header: "결제차수" },
    { accessorKey: "lastModifiedBy", header: "최종수정자" },
    { accessorKey: "lastModifiedAt", header: "최종수정일" },
  ];

  // 현재 화면에 표시할 컬럼들
  const columns = allColumns.filter((column) =>
    visibleColumns.includes(column.accessorKey)
  );

  // 추가 디버깅 로그
  console.log("InstructionList 컴포넌트 columns:", columns);
  console.log("InstructionList 필터링된 데이터:", filteredInstructions);

  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormSelect
            name="status"
            label="상태"
            value={filters.status}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "모든 상태" },
              { value: "접수", label: "접수" },
              { value: "작업중", label: "작업중" },
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
            placeholder="모든 필드에서 검색"
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
