import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useInstructions,
  useCreateInstruction,
} from "../../lib/api/instructionQueries";
import {
  DataTable,
  FormButton,
  FormCard,
  FormInput,
  FormSelect,
  showSuccess,
  showError,
  showWarning,
  ImportModal,
  FileImportService,
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
  Database,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  User,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { excelUtils } from "../../lib/utils/excelUtils";
import {
  fetchInstructions,
  createInstruction,
  updateInstruction,
  deleteInstruction,
  toggleInstructionFavorite,
  updateInstructionStatus,
  uploadCsvBulkInstructions,
} from "../../lib/api/instructionAPI";

// DatePicker 스타일 오버라이드를 위한 CSS 추가
const customDatePickerStyle = `
  .react-datepicker-wrapper {
    width: 100%;
    display: block;
  }
  .react-datepicker__input-container {
    width: 100%;
    display: block;
  }
`;

// 상태와 우선순위 매핑 객체 (5단계 상태로 업데이트)
const STATUS_MAP = {
  접수: { label: "접수", color: "yellow" },
  작업중: { label: "작업중", color: "blue" },
  작업완료: { label: "작업완료", color: "green" },
  결재중: { label: "결재중", color: "orange" },
  완료: { label: "완료", color: "purple" },
  취소: { label: "취소", color: "red" }, // 선택적 상태로 유지
};

const PRIORITY_MAP = {
  HIGH: { label: "높음", color: "red" },
  MEDIUM: { label: "중간", color: "yellow" },
  LOW: { label: "낮음", color: "green" },
};

// 로컬 스토리지 키 정의
const FILTER_STORAGE_KEY = "instruction_list_filters";

const InstructionList = () => {
  const navigate = useNavigate();
  const [filterParams, setFilterParams] = useState({
    status: "",
    page: 1,
    size: 10,
    keyword: "",
    searchType: "all",
    startDate: "",
    endDate: "",
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
    refetch,
  } = useInstructions(filterParams);

  const createInstructionMutation = useCreateInstruction();

  // 실제 지시 배열 추출
  const instructions = instructionData.instruction || [];

  // 모달 상태 관리
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [exportFormat, setExportFormat] = useState("excel");
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  // 로컬 스토리지에서 필터 상태 불러오기
  const loadFiltersFromStorage = () => {
    try {
      const savedFilters = localStorage.getItem(FILTER_STORAGE_KEY);
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters);

        // 날짜 문자열을 Date 객체로 변환
        if (parsedFilters.startDate) {
          parsedFilters.startDate = new Date(parsedFilters.startDate);
        }
        if (parsedFilters.endDate) {
          parsedFilters.endDate = new Date(parsedFilters.endDate);
        }

        return parsedFilters;
      }
    } catch (e) {
      console.error("필터 상태 로드 오류:", e);
    }

    // 기본 필터 상태 반환
    return {
      status: "",
      manager: "",
      name: "",
      branchName: "",
      startDate: null,
      endDate: null,
      searchType: "all",
      search: "",
      dateField: "orderDate",
    };
  };

  // 필터 상태 초기화
  const [filters, setFilters] = useState(loadFiltersFromStorage);

  // 필터 상태가 변경될 때 로컬 스토리지에 저장
  useEffect(() => {
    try {
      // 날짜 객체는 문자열로 변환하여 저장
      const filtersToSave = {
        ...filters,
        branchName: filters.branchName || "",
        startDate: filters.startDate ? filters.startDate.toISOString() : null,
        endDate: filters.endDate ? filters.endDate.toISOString() : null,
      };

      localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filtersToSave));
    } catch (e) {
      console.error("필터 상태 저장 오류:", e);
    }
  }, [filters]);

  // 컴포넌트 마운트 시 저장된 필터가 있으면 API 호출
  useEffect(() => {
    // 저장된 필터가 있고 기본값이 아닌 경우에만 API 호출
    if (
      filters.status ||
      filters.manager ||
      filters.name ||
      filters.branchName ||
      filters.startDate ||
      filters.endDate
    ) {
      handleApplyFilter();
    }
  }, []);

  // 테이블에 표시할 컬럼 선택 상태 (새로운 필드 추가)
  const [visibleColumns, setVisibleColumns] = useState([
    "id",
    "orderNumber",
    "name",
    "status",
    "district",
    "dong",
    "lotNumber",
    "manager",
    "orderDate",
    "round",
    "memo",
    "modifier",
  ]);

  // 필터 변경 핸들러
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // 필터 적용 함수
  const handleApplyFilter = () => {
    // API 필터링을 위한 상태 업데이트
    const newFilterParams = {
      ...filterParams,
      page: 1, // 필터 변경 시 첫 페이지로 돌아가기
      status: filters.status || "",
      name: filters.name || "",
      manager: filters.manager || "",
      branchName: filters.branchName || "",
    };

    // 날짜 범위 필터 처리
    if (filters.startDate) {
      newFilterParams.startDate = filters.startDate.toISOString().split("T")[0];
    } else {
      newFilterParams.startDate = "";
    }

    if (filters.endDate) {
      newFilterParams.endDate = filters.endDate.toISOString().split("T")[0];
    } else {
      newFilterParams.endDate = "";
    }

    // 검색어 처리
    if (filters.search) {
      newFilterParams.keyword = filters.search;

      if (filters.searchType === "dong") {
        newFilterParams.searchType = "dong";
      } else if (filters.searchType === "lotNumber") {
        newFilterParams.searchType = "lotNumber";
      } else {
        newFilterParams.searchType = "all";
      }
    } else {
      // 검색어가 없으면 검색 관련 파라미터 제거
      newFilterParams.keyword = "";
      newFilterParams.searchType = "all";
    }

    setFilterParams(newFilterParams);
  };

  // 날짜 필터 적용
  const handleApplyDateFilter = () => {
    handleApplyFilter();
  };

  const handleRowClick = (instruction) => {
    navigate(`/instructions/${instruction.id}`);
  };

  const handleAddClick = () => {
    navigate("/instructions/create");
  };

  const handleImportClick = () => {
    setShowImportModal(true);
    setImportResult(null);
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

  // 파일 업로드 및 데이터 처리 함수
  const handleImportData = async (file) => {
    setIsImporting(true);

    try {
      // CSV 파일 확인
      if (!FileImportService.isCsvFile(file)) {
        // CSV 파일이 아닌 경우 에러 표시
        showError("파일 형식 오류", "올바른 CSV 파일을 업로드해주세요.");
        setIsImporting(false);
        return;
      }

      // 진행 상황을 표시하기 위한 상태 (초기화)
      const result = {
        success: 0,
        error: 0,
        total: 0,
        errors: [],
        processingIndex: 0,
        isProcessing: true,
      };

      // 초기 진행 상태 설정
      setImportResult(result);

      try {
        // CSV 파일을 직접 백엔드로 전송
        const response = await uploadCsvBulkInstructions(file);

        // 응답 결과 처리
        const apiResult = response.data || {};

        // 결과 상태 업데이트
        const updatedResult = {
          success: apiResult.success || 0,
          error: apiResult.error || 0,
          total: apiResult.total || 0,
          errors: apiResult.errors || [],
          processingIndex: apiResult.total || 0,
          isProcessing: false,
        };

        setImportResult(updatedResult);

        if (updatedResult.success > 0) {
          showSuccess(
            `${updatedResult.success}개의 지시가 성공적으로 등록되었습니다.`
          );
          refetch(); // 목록 새로고침
        }

        if (updatedResult.error > 0) {
          showWarning(`${updatedResult.error}개 항목이 등록에 실패했습니다.`);
        }
      } catch (error) {
        console.error("CSV 일괄 등록 실패:", error);

        // 에러 결과 업데이트
        const errorResult = {
          success: 0,
          error: 1,
          total: 1,
          errors: [
            { message: error.message || "서버 처리 중 오류가 발생했습니다." },
          ],
          processingIndex: 1,
          isProcessing: false,
        };

        setImportResult(errorResult);
        showError("CSV 파일 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("파일 처리 오류:", error);
      showError("파일 처리 중 오류가 발생했습니다: " + error.message);
    } finally {
      setIsImporting(false);
    }
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

  // 필터링된 지시 목록 (검색어, 날짜에 대한 클라이언트 측 필터링)
  const filteredInstructions = instructions.filter((instruction) => {
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
          instruction.name?.toLowerCase().includes(searchLower) ||
          String(instruction.id)?.toLowerCase().includes(searchLower) ||
          String(instruction.orderId)?.toLowerCase().includes(searchLower) ||
          instruction.orderNumber?.toLowerCase().includes(searchLower) ||
          instruction.district?.toLowerCase().includes(searchLower) ||
          instruction.dong?.toLowerCase().includes(searchLower) ||
          instruction.lotNumber?.toLowerCase().includes(searchLower) ||
          instruction.detailAddress?.toLowerCase().includes(searchLower) ||
          instruction.manager?.toLowerCase().includes(searchLower) ||
          instruction.delegator?.toLowerCase().includes(searchLower) ||
          instruction.channel?.toLowerCase().includes(searchLower) ||
          instruction.structure?.toLowerCase().includes(searchLower);
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

    return matchesSearch && matchesDate;
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
      accessorKey: "orderId",
      header: "주문 ID",
    },
    {
      accessorKey: "orderNumber",
      header: "지시번호",
      cell: ({ row }) => truncateText(row.getValue("orderNumber"), 15),
    },
    {
      accessorKey: "orderDate",
      header: "지시일자",
      cell: ({ row }) => formatDate(row.getValue("orderDate")),
    },
    {
      accessorKey: "name",
      header: "제목",
      cell: ({ row }) => truncateText(row.getValue("name"), 25),
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
      accessorKey: "manager",
      header: "관리자",
      cell: ({ row }) => truncateText(row.getValue("manager"), 10),
    },
    {
      accessorKey: "delegator",
      header: "위임자",
      cell: ({ row }) => truncateText(row.getValue("delegator"), 10),
    },
    {
      accessorKey: "channel",
      header: "채널",
      cell: ({ row }) => truncateText(row.getValue("channel"), 10),
    },
    {
      accessorKey: "district",
      header: "지역",
      cell: ({ row }) => truncateText(row.getValue("district"), 15),
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
      accessorKey: "detailAddress",
      header: "상세주소",
      cell: ({ row }) => truncateText(row.getValue("detailAddress"), 20),
    },
    {
      accessorKey: "structure",
      header: "구조물",
      cell: ({ row }) => truncateText(row.getValue("structure"), 15),
    },
    {
      accessorKey: "round",
      header: "회차",
    },
    {
      accessorKey: "modifier",
      header: "수정자",
      cell: ({ row }) => truncateText(row.getValue("modifier") || "-", 10),
    },
    {
      accessorKey: "memo",
      header: "비고",
      cell: ({ row }) => truncateText(row.getValue("memo"), 30),
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

  // DataTable에 전달할 페이지네이션 상태
  const tableState = {
    pagination: {
      pageIndex: filterParams.page - 1, // 0-기반 인덱스로 변환
      pageSize: filterParams.size,
    },
  };

  // 페이지 변경을 처리하는 함수
  const handlePageChange = (newPage) => {
    setFilterParams({
      ...filterParams,
      page: newPage + 1, // DataTable은 0-기반 인덱스를 사용하므로 1을 더해줌
    });
  };

  // 페이지 크기 변경 핸들러
  const handlePageSizeChange = (newSize) => {
    setFilterParams({
      ...filterParams,
      size: newSize,
      page: 1, // 페이지 크기 변경 시 첫 페이지로 돌아가기
    });
  };

  // DataTable 검색 필터 상태
  const [globalFilter, setGlobalFilter] = useState("");

  // 글로벌 검색 핸들러 (DataTable 내장 검색 사용)
  const handleGlobalFilterChange = (value) => {
    setGlobalFilter(value);
  };

  const statusOptions = [
    { value: "접수", label: "접수" },
    { value: "작업중", label: "작업중" },
    { value: "작업완료", label: "작업완료" },
    { value: "결재중", label: "결재중" },
    { value: "완료", label: "완료" },
    { value: "취소", label: "취소" },
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
      columns: [
        "id",
        "orderId",
        "orderNumber",
        "orderDate",
        "name",
        "status",
        "round",
        "memo",
      ],
    },
    {
      title: "위치 정보",
      columns: ["district", "dong", "lotNumber", "detailAddress", "structure"],
    },
    {
      title: "담당자",
      columns: ["manager", "delegator", "channel"],
    },
  ];

  // 상태 변경 핸들러 (API 호출 즉시 반영하지 않고 필터 상태만 변경)
  const handleStatusChange = (e) => {
    const { value } = e.target;
    setFilters((prev) => ({ ...prev, status: value }));
  };

  // 커스텀 페이지네이션 컴포넌트
  const renderPaginationButtons = () => {
    const totalPage = instructionData.totalPage || 1;
    const currentPage = filterParams.page;

    // 페이지 버튼을 몇 개까지 보여줄지 결정 (10개로 변경)
    const maxButtons = 10;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPage, startPage + maxButtons - 1);

    // 버튼 개수 조정
    if (endPage - startPage + 1 < maxButtons && startPage > 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center mt-4 mb-4 space-x-2">
        {/* 첫 페이지 버튼 */}
        <button
          onClick={() => handlePageChange(0)}
          disabled={currentPage === 1}
          className={`w-8 h-8 p-0 border rounded-md ${
            currentPage === 1
              ? "text-gray-400 border-gray-200"
              : "text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <span className="sr-only">첫 페이지</span>
          <ChevronsLeft className="w-4 h-4 mx-auto" />
        </button>

        {/* 이전 페이지 버튼 */}
        <button
          onClick={() => handlePageChange(currentPage - 2)}
          disabled={currentPage === 1}
          className={`w-8 h-8 p-0 border rounded-md ${
            currentPage === 1
              ? "text-gray-400 border-gray-200"
              : "text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <span className="sr-only">이전 페이지</span>
          <ChevronLeft className="w-4 h-4 mx-auto" />
        </button>

        {/* 페이지 번호 버튼들 */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page - 1)}
            className={`w-8 h-8 text-sm font-medium rounded-md ${
              currentPage === page
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            {page}
          </button>
        ))}

        {/* 다음 페이지 버튼 */}
        <button
          onClick={() => handlePageChange(currentPage)}
          disabled={currentPage === totalPage}
          className={`w-8 h-8 p-0 border rounded-md ${
            currentPage === totalPage
              ? "text-gray-400 border-gray-200"
              : "text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <span className="sr-only">다음 페이지</span>
          <ChevronRight className="w-4 h-4 mx-auto" />
        </button>

        {/* 마지막 페이지 버튼 */}
        <button
          onClick={() => handlePageChange(totalPage - 1)}
          disabled={currentPage === totalPage}
          className={`w-8 h-8 p-0 border rounded-md ${
            currentPage === totalPage
              ? "text-gray-400 border-gray-200"
              : "text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <span className="sr-only">마지막 페이지</span>
          <ChevronsRight className="w-4 h-4 mx-auto" />
        </button>
      </div>
    );
  };

  // 필터 초기화 함수
  const resetFilters = () => {
    const defaultFilters = {
      status: "",
      manager: "",
      name: "",
      branchName: "",
      startDate: null,
      endDate: null,
      searchType: "all",
      search: "",
      dateField: "orderDate",
    };

    // 필터 상태 초기화
    setFilters(defaultFilters);

    // 로컬 스토리지에서 필터 삭제
    localStorage.removeItem(FILTER_STORAGE_KEY);

    // API 호출 파라미터 초기화
    setFilterParams({
      ...filterParams,
      status: "",
      name: "",
      manager: "",
      startDate: "",
      endDate: "",
      branchName: "",
      page: 1,
    });
  };

  // 날짜 범위 선택 핸들러
  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    setFilters({
      ...filters,
      startDate: start,
      endDate: end,
    });
  };

  return (
    <div className="min-h-screen px-4 py-6 mx-auto bg-gray-50">
      {/* DatePicker 스타일 오버라이드 */}
      <style>{customDatePickerStyle}</style>

      {/* 헤더 영역 */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="flex items-center text-2xl font-bold text-gray-800">
            <ListFilter className="w-6 h-6 mr-2 text-blue-600" />
            지시 목록
          </h1>
          <div className="flex space-x-2">
            <FormButton
              variant="outline"
              onClick={handleImportClick}
              className="flex items-center h-9"
            >
              <FileUp className="w-4 h-4 mr-1" />
              일괄등록
            </FormButton>
            <FormButton
              variant="primary"
              onClick={handleAddClick}
              className="flex items-center h-9"
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              지시 등록
            </FormButton>
          </div>
        </div>

        {/* 새로운 간소화된 필터 - 한 줄로 배치 */}
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex flex-wrap items-start justify-between w-full gap-4">
            {/* 지점 필터 */}
            <div className="flex-1 min-w-[180px]">
              <label
                htmlFor="branchName-filter"
                className="block mb-1 text-xs font-medium text-gray-700"
              >
                지점
              </label>
              <FormSelect
                id="branchName-filter"
                name="branchName"
                value={filters.branchName}
                onChange={handleFilterChange}
                options={[
                  { value: "1번지점", label: "1번지점" },
                  { value: "2번지점", label: "2번지점" },
                ]}
                className="h-10 py-0 text-sm"
                fullWidth={true}
              />
            </div>

            {/* 제목 필터 */}
            <div className="flex-1 min-w-[180px]">
              <label className="block mb-1 text-xs font-medium text-gray-700">
                제목
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  placeholder="제목으로 검색"
                  className="w-full h-10 px-3 py-2 pl-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* 관리자 필터 - 드롭다운에서 입력 필드로 변경 */}
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 text-xs font-medium text-gray-700">
                관리자
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="manager"
                  value={filters.manager}
                  onChange={handleFilterChange}
                  placeholder="관리자명 입력"
                  className="w-full h-10 px-3 py-2 pl-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* 상태 필터 */}
            <div className="flex-1 min-w-[120px]">
              <label className="block mb-1 text-xs font-medium text-gray-700">
                상태
              </label>
              <FormSelect
                id="status-filter"
                name="status"
                value={filters.status}
                onChange={handleStatusChange}
                options={statusOptions}
                className="h-10 py-0 text-sm"
                fullWidth={true}
              />
            </div>

            {/* 지시일자 필터 - DateRangePicker 사용 */}
            <div className="flex-1 min-w-[220px]">
              <label className="block mb-1 text-xs font-medium text-gray-700">
                지시일자 범위
              </label>
              <div className="relative w-full">
                <DatePicker
                  selected={filters.startDate}
                  onChange={handleDateRangeChange}
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                  selectsRange
                  dateFormat="yyyy-MM-dd"
                  placeholderText="시작일 ~ 종료일"
                  className="w-full h-10 px-3 py-2 pl-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                  isClearable
                  wrapperClassName="w-full"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex items-end mt-5 space-x-2">
              {/* 필터 적용 버튼 */}
              <FormButton
                variant="primary"
                onClick={handleApplyFilter}
                className="flex items-center h-10 px-4"
              >
                <Filter className="w-4 h-4 mr-1" />
                적용
              </FormButton>

              {/* 필터 초기화 버튼 */}
              <FormButton
                variant="outline"
                onClick={resetFilters}
                className="flex items-center h-10 px-4 text-red-600 border-red-300 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1" />
                초기화
              </FormButton>
            </div>
          </div>
        </div>
      </div>

      {/* 데이터 테이블 카드 */}
      <div className="overflow-hidden bg-white rounded-lg shadow-sm">
        <div className="px-5 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center text-lg font-medium text-gray-800">
              <File className="w-5 h-5 mr-2 text-blue-600" />
              지시 데이터
            </h2>
            <div className="flex items-center space-x-3">
              <div className="mr-3 text-sm text-gray-500">
                총 {instructionData.totalCount || 0}개 항목
              </div>

              {/* 글로벌 검색 필드 - 크기 확대 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="검색어 입력..."
                  value={globalFilter || ""}
                  onChange={(e) => handleGlobalFilterChange(e.target.value)}
                  className="px-8 py-2 text-sm border rounded-md w-72 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                {globalFilter && (
                  <button
                    onClick={() => handleGlobalFilterChange("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* 페이지 사이즈 선택 */}
              <div className="flex items-center">
                <select
                  className="px-2 py-2 text-sm border rounded-md"
                  value={filterParams.size}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                >
                  {[10, 20, 30, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}행
                    </option>
                  ))}
                </select>
              </div>

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
        </div>

        <DataTable
          columns={filteredColumns}
          data={instructions}
          isLoading={isLoading}
          error={error}
          onRowClick={handleRowClick}
          // 페이지네이션 설정
          manualPagination={true}
          pageCount={instructionData.totalPage || 1}
          pageSize={filterParams.size}
          pageIndex={filterParams.page - 1}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          // DataTable 내장 페이지네이션 비활성화
          enablePagination={false}
          // 내장 검색 활성화
          enableGlobalFilter={true}
          globalFilter={globalFilter}
          setGlobalFilter={handleGlobalFilterChange}
          state={tableState}
          emptyMessage="지시 데이터가 없습니다."
          errorMessage="지시 목록을 불러오는 데 실패했습니다."
        />

        {/* 커스텀 페이지네이션 렌더링 */}
        {!isLoading && instructions.length > 0 && renderPaginationButtons()}
      </div>

      {/* 가져오기 모달 - 컴포넌트로 분리 */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportData}
        importResult={importResult}
        isImporting={isImporting}
      />

      {/* 컬럼 설정 모달 */}
      {showColumnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center text-xl font-semibold">
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

            <div className="overflow-y-auto max-h-96">
              {columnGroups.map((group) => (
                <div key={group.name} className="mb-6">
                  <h3 className="pb-1 mb-3 font-medium text-gray-700 border-b text-md">
                    {group.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
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
                            className="w-4 h-4 text-blue-600 form-checkbox"
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

            <div className="flex justify-between pt-4 mt-4 border-t border-gray-200">
              <FormButton
                variant="outline"
                onClick={() => setVisibleColumns(["id", "name", "status"])}
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
