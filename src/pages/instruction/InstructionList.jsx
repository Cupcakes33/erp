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
import {
  PlusCircle,
  Search,
  FileDown,
  FileUp,
  Calendar,
  Filter,
  Settings,
  X,
  Upload,
  Download,
  ListFilter,
  Table,
  File,
  Bookmark,
} from "lucide-react";

// 상태와 우선순위 매핑 객체 (5단계 상태로 업데이트)
const STATUS_MAP = {
  RECEIVED: { label: "접수", color: "yellow" },
  IN_PROGRESS: { label: "작업중", color: "blue" },
  COMPLETED_WORK: { label: "작업완료", color: "green" },
  IN_APPROVAL: { label: "결재중", color: "orange" },
  COMPLETED: { label: "완료", color: "purple" },
  CANCELED: { label: "취소", color: "red" }, // 선택적 상태로 유지
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

  // 모달 상태 관리
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [exportFormat, setExportFormat] = useState("excel");

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
    searchType: "all", // 검색 유형 (all, dong, lotNumber)
    startDate: "", // 시작 날짜
    endDate: "", // 종료 날짜
    dateField: "createdAt", // 날짜 필드 (createdAt, dueDate)
  });

  // 테이블에 표시할 컬럼 선택 상태 (새로운 필드 추가)
  const [visibleColumns, setVisibleColumns] = useState([
    "id",
    "title",
    "priority",
    "status",
    "location",
    "dong",
    "lotNumber",
    "manager",
    "receiver",
    "createdAt",
    "dueDate",
    "lastModifiedBy", // 마지막 수정자 표시
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

  // 날짜 필터 적용
  const handleApplyDateFilter = () => {
    // 클라이언트 측 필터링만 구현 (실제 API가 있다면 API 파라미터로 전달)
    console.log(
      "날짜 필터 적용:",
      filters.startDate,
      filters.endDate,
      filters.dateField
    );
  };

  const handleRowClick = (instruction) => {
    navigate(`/instructions/${instruction.id}`);
  };

  const handleAddClick = () => {
    navigate("/instructions/create");
  };

  const handleImportClick = () => {
    setShowImportModal(true);
  };

  const handleExportClick = () => {
    setShowExportModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImportFile(file);
    }
  };

  const handleImportSubmit = () => {
    if (importFile) {
      console.log("파일 가져오기:", importFile);
      // 실제 가져오기 로직 구현 (API 호출 등)
      // navigate("/instructions/import");
    }
    setShowImportModal(false);
    setImportFile(null);
  };

  const handleExportSubmit = () => {
    console.log("데이터 내보내기 형식:", exportFormat);
    // 실제 내보내기 로직 구현 (API 호출 등)
    setShowExportModal(false);
  };

  // 긴 텍스트 자르기 유틸리티 함수
  const truncateText = (text, length = 20) => {
    if (!text) return "";
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  // 필터링된 지시 목록 (검색어, 우선순위, 날짜에 대한 클라이언트 측 필터링)
  const filteredInstructions = instructions.filter((instruction) => {
    // 우선순위 필터
    const matchesPriority = filters.priority
      ? instruction.priority === filters.priority
      : true;

    // 검색어 필터 - 검색 타입에 따라 다른 필드 검색
    let matchesSearch = true;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();

      if (filters.searchType === "dong") {
        // 동으로 검색
        matchesSearch = instruction.dong?.toLowerCase().includes(searchLower);
      } else if (filters.searchType === "lotNumber") {
        // 지번으로 검색
        matchesSearch = instruction.lotNumber
          ?.toLowerCase()
          .includes(searchLower);
      } else {
        // 모든 필드 검색 (기존 방식)
        matchesSearch =
          instruction.title?.toLowerCase().includes(searchLower) ||
          String(instruction.id)?.toLowerCase().includes(searchLower) ||
          instruction.location?.toLowerCase().includes(searchLower) ||
          instruction.dong?.toLowerCase().includes(searchLower) ||
          instruction.lotNumber?.toLowerCase().includes(searchLower) ||
          instruction.address?.toLowerCase().includes(searchLower) ||
          instruction.manager?.toLowerCase().includes(searchLower) ||
          instruction.receiver?.toLowerCase().includes(searchLower) ||
          instruction.worker?.toLowerCase().includes(searchLower) || // 작업자 필드 추가
          instruction.description?.toLowerCase().includes(searchLower) ||
          instruction.workContent?.toLowerCase().includes(searchLower) || // 작업내용 필드 추가
          instruction.note?.toLowerCase().includes(searchLower) || // 비고 필드 추가
          instruction.channel?.toLowerCase().includes(searchLower);
      }
    }

    // 날짜 필터
    let matchesDate = true;
    if (filters.startDate && filters.endDate) {
      const fieldDate = new Date(instruction[filters.dateField]);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59); // 종료일 하루 끝으로 설정

      matchesDate = fieldDate >= startDate && fieldDate <= endDate;
    }

    return matchesPriority && matchesSearch && matchesDate;
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

  // 모든 가능한 컬럼 정의 (새로운 필드 추가)
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
    {
      accessorKey: "createdAt",
      header: "생성일",
      cell: ({ row }) => formatDate(row.getValue("createdAt")),
    },
    {
      accessorKey: "dueDate",
      header: "마감일",
      cell: ({ row }) => formatDate(row.getValue("dueDate")),
    },
    {
      accessorKey: "location",
      header: "위치",
      cell: ({ row }) => truncateText(row.getValue("location"), 15),
    },
    {
      accessorKey: "dong",
      header: "동",
      cell: ({ row }) => row.getValue("dong") || "-",
    },
    {
      accessorKey: "lotNumber",
      header: "지번",
      cell: ({ row }) => row.getValue("lotNumber") || "-",
    },
    {
      accessorKey: "address",
      header: "주소",
      cell: ({ row }) => truncateText(row.getValue("address"), 20),
    },
    {
      accessorKey: "description",
      header: "세부사항",
      cell: ({ row }) => truncateText(row.getValue("description"), 30),
    },
    {
      accessorKey: "workContent",
      header: "작업내용",
      cell: ({ row }) => truncateText(row.getValue("workContent"), 30),
    },
    {
      accessorKey: "note",
      header: "비고",
      cell: ({ row }) => truncateText(row.getValue("note"), 20),
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
    {
      accessorKey: "worker",
      header: "작업자",
      cell: ({ row }) => truncateText(row.getValue("worker"), 10),
    },
    {
      accessorKey: "workStatus",
      header: "작업현황",
      cell: ({ row }) => truncateText(row.getValue("workStatus"), 25),
    },
    {
      accessorKey: "channel",
      header: "접수 채널",
      cell: ({ row }) => {
        const channels = {
          PHONE: "전화",
          EMAIL: "이메일",
          SYSTEM: "시스템",
          OTHER: "기타",
        };
        return channels[row.getValue("channel")] || row.getValue("channel");
      },
    },
    {
      accessorKey: "paymentRound",
      header: "기성회차",
    },
    {
      accessorKey: "lastModifiedBy",
      header: "최종 수정자",
      cell: ({ row }) => {
        const modifiedBy = row.getValue("lastModifiedBy");
        const modifiedAt = row.original.lastModifiedAt;
        return modifiedBy ? `${modifiedBy} (${formatDate(modifiedAt)})` : "-";
      },
    },
    {
      accessorKey: "favorite",
      header: "즐겨찾기",
      cell: ({ row }) => renderFavorite(row.getValue("favorite")),
    },
  ];

  // 날짜 포맷팅 유틸리티 함수
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

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

  const searchTypeOptions = [
    { value: "all", label: "전체 검색" },
    { value: "dong", label: "동 검색" },
    { value: "lotNumber", label: "지번 검색" },
  ];

  const dateFieldOptions = [
    { value: "createdAt", label: "생성일" },
    { value: "dueDate", label: "마감일" },
    { value: "lastModifiedAt", label: "수정일" },
  ];

  const columnOptions = allColumns.map((column) => ({
    value: column.accessorKey,
    label: column.header,
  }));

  const handleVisibleColumnsChange = (columnKey) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((col) => col !== columnKey)
        : [...prev, columnKey]
    );
  };

  // 컬럼 그룹화 (카테고리별로 컬럼 옵션 정리)
  const columnGroups = [
    {
      title: "기본 정보",
      columns: ["id", "title", "priority", "status", "favorite"],
    },
    {
      title: "날짜",
      columns: ["createdAt", "dueDate", "lastModifiedBy"],
    },
    {
      title: "위치 정보",
      columns: ["location", "dong", "lotNumber", "address"],
    },
    {
      title: "세부 정보",
      columns: ["description", "workContent", "note", "workStatus"],
    },
    {
      title: "담당자",
      columns: ["manager", "receiver", "worker", "channel", "paymentRound"],
    },
  ];

  return (
    <div className="mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      {/* 헤더 영역 */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center text-gray-800">
            <ListFilter className="w-6 h-6 mr-2 text-blue-600" />
            지시 목록
          </h1>
          <div className="flex space-x-2">
            <FormButton
              variant="primary"
              onClick={handleAddClick}
              className="flex items-center h-9"
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              지시 등록
            </FormButton>
            <FormButton
              variant="outline"
              onClick={handleImportClick}
              className="flex items-center h-9"
            >
              <FileUp className="w-4 h-4 mr-1" />
              가져오기
            </FormButton>
            <FormButton
              variant="outline"
              onClick={handleExportClick}
              className="flex items-center h-9"
            >
              <FileDown className="w-4 h-4 mr-1" />
              내보내기
            </FormButton>
            <FormButton
              variant="ghost"
              onClick={() => setShowColumnModal(true)}
              className="flex items-center h-9"
            >
              <Table className="w-4 h-4 mr-1" />
              컬럼 설정
            </FormButton>
          </div>
        </div>

        {/* 필터 및 검색 영역 - 완전히 개선된 깔끔한 UI */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center mb-3">
            <Filter className="w-4 h-4 mr-2 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-700">필터 및 검색</h3>
          </div>

          <div className="grid grid-cols-12 gap-3">
            {/* 상태 필터 */}
            <div className="col-span-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                상태
              </label>
              <FormSelect
                id="status-filter"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                options={statusOptions}
                fullWidth={true}
              />
            </div>

            {/* 우선순위 필터 */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                우선순위
              </label>
              <FormSelect
                id="priority-filter"
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                options={priorityOptions}
                fullWidth={true}
              />
            </div>

            {/* 검색 유형 */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                검색 유형
              </label>
              <FormSelect
                id="search-type"
                name="searchType"
                value={filters.searchType}
                onChange={handleFilterChange}
                options={searchTypeOptions}
                fullWidth={true}
              />
            </div>

            {/* 검색어 입력 */}
            <div className="col-span-5">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                검색어
              </label>
              <div className="relative">
                <FormInput
                  id="search-input"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="검색어를 입력하세요..."
                  className="pl-8"
                  fullWidth={true}
                />
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* 날짜 필드 선택 */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                날짜 필드
              </label>
              <FormSelect
                id="date-field"
                name="dateField"
                value={filters.dateField}
                onChange={handleFilterChange}
                options={dateFieldOptions}
                fullWidth={true}
              />
            </div>

            {/* 시작일 */}
            <div className="col-span-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                시작일
              </label>
              <FormInput
                id="start-date"
                name="startDate"
                type="date"
                value={filters.startDate}
                onChange={handleFilterChange}
                fullWidth={true}
              />
            </div>

            {/* 종료일 */}
            <div className="col-span-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                종료일
              </label>
              <FormInput
                id="end-date"
                name="endDate"
                type="date"
                value={filters.endDate}
                onChange={handleFilterChange}
                fullWidth={true}
              />
            </div>

            {/* 필터 적용 버튼 */}
            <div className="col-span-2 flex items-end">
              <FormButton
                variant="outline"
                onClick={handleApplyDateFilter}
                className="flex items-center h-9 w-full justify-center"
              >
                <Filter className="w-4 h-4 mr-1" />
                필터 적용
              </FormButton>
            </div>
          </div>
        </div>
      </div>

      {/* 데이터 테이블 카드 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800 flex items-center">
              <File className="w-5 h-5 mr-2 text-blue-600" />
              지시 데이터
            </h2>
            <div className="text-sm text-gray-500">
              총 {instructionData.totalCount || 0}개 항목
            </div>
          </div>
        </div>
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
      </div>

      {/* 가져오기 모달 */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <FileUp className="w-5 h-5 mr-2 text-blue-600" />
                지시 데이터 가져오기
              </h2>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                지시 데이터가 포함된 Excel, CSV 또는 JSON 파일을 선택하세요.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".xlsx,.xls,.csv,.json"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    파일을 끌어다 놓거나 클릭하여 업로드
                  </p>
                </label>
              </div>

              {importFile && (
                <div className="mt-2 p-2 bg-blue-50 rounded flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <FileUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-900 truncate">
                      {importFile.name}
                    </p>
                    <p className="text-xs text-blue-500">
                      {Math.round(importFile.size / 1024)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => setImportFile(null)}
                    className="text-blue-700 hover:text-blue-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <FormButton
                variant="outline"
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                }}
              >
                취소
              </FormButton>
              <FormButton
                variant="primary"
                onClick={handleImportSubmit}
                disabled={!importFile}
              >
                가져오기
              </FormButton>
            </div>
          </div>
        </div>
      )}

      {/* 내보내기 모달 */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <FileDown className="w-5 h-5 mr-2 text-blue-600" />
                지시 데이터 내보내기
              </h2>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                내보내기 형식을 선택하세요:
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div
                  className={`border rounded-lg p-4 text-center cursor-pointer transition ${
                    exportFormat === "excel"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setExportFormat("excel")}
                >
                  <Download className="w-8 h-8 mx-auto text-blue-500" />
                  <p className="mt-2 text-sm font-medium">Excel</p>
                </div>
                <div
                  className={`border rounded-lg p-4 text-center cursor-pointer transition ${
                    exportFormat === "csv"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setExportFormat("csv")}
                >
                  <Download className="w-8 h-8 mx-auto text-green-500" />
                  <p className="mt-2 text-sm font-medium">CSV</p>
                </div>
                <div
                  className={`border rounded-lg p-4 text-center cursor-pointer transition ${
                    exportFormat === "json"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setExportFormat("json")}
                >
                  <Download className="w-8 h-8 mx-auto text-purple-500" />
                  <p className="mt-2 text-sm font-medium">JSON</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <FormButton
                variant="outline"
                onClick={() => setShowExportModal(false)}
              >
                취소
              </FormButton>
              <FormButton variant="primary" onClick={handleExportSubmit}>
                내보내기
              </FormButton>
            </div>
          </div>
        </div>
      )}

      {/* 컬럼 설정 모달 */}
      {showColumnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Table className="w-5 h-5 mr-2 text-blue-600" />
                표시할 컬럼 설정
              </h2>
              <button
                onClick={() => setShowColumnModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {columnGroups.map((group) => (
                <div key={group.title} className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-3 pb-1 border-b">
                    {group.title}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {group.columns.map((columnKey) => {
                      const column = columnOptions.find(
                        (c) => c.value === columnKey
                      );
                      if (!column) return null;

                      return (
                        <label
                          key={column.value}
                          className="inline-flex items-center p-2 rounded hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-blue-600"
                            checked={visibleColumns.includes(column.value)}
                            onChange={() =>
                              handleVisibleColumnsChange(column.value)
                            }
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {column.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
              <FormButton
                variant="outline"
                onClick={() => setVisibleColumns(["id", "title", "status"])}
              >
                최소 컬럼만
              </FormButton>
              <div className="space-x-2">
                <FormButton
                  variant="outline"
                  onClick={() => setShowColumnModal(false)}
                >
                  취소
                </FormButton>
                <FormButton
                  variant="primary"
                  onClick={() => setShowColumnModal(false)}
                >
                  적용
                </FormButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructionList;
