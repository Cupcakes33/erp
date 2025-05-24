import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInstructions } from "../../lib/api/instructionQueries";
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
  generateBosuConfirmationPDF,
} from "../../components/molecules";
import {
  PlusCircle,
  Search,
  FileUp,
  Filter,
  X,
  ListFilter,
  Table,
  File,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  FileText,
} from "lucide-react";
import {
  uploadCsvBulkInstructions,
  fetchBosuConfirmationData,
} from "../../lib/api/instructionAPI";

// 상태와 우선순위 매핑 객체 (5단계 상태로 업데이트)
const STATUS_MAP = {
  접수: { label: "접수", color: "yellow" },
  작업중: { label: "작업중", color: "blue" },
  작업완료: { label: "작업완료", color: "green" },
  결재중: { label: "결재중", color: "orange" },
  완료: { label: "완료", color: "purple" },
  취소: { label: "취소", color: "red" }, // 선택적 상태로 유지
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
    center: "",
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

  // 실제 지시 배열 추출
  const instructions = instructionData.instruction || [];

  // 모달 상태 관리
  const [showImportModal, setShowImportModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  // 선택된 지시 목록을 관리하는 상태 추가
  const [selectedInstructions, setSelectedInstructions] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  // 로컬 스토리지에서 필터 상태 불러오기
  const loadFiltersFromStorage = () => {
    try {
      const savedFilters = localStorage.getItem(FILTER_STORAGE_KEY);
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters);
        return parsedFilters;
      }
    } catch (e) {
      console.error("필터 상태 로드 오류:", e);
    }

    const defaultInitialFilters = {
      status: "",
      center: "",
      orderIdKeyword: "",
    };
    return defaultInitialFilters;
  };

  // 필터 상태 초기화
  const [filters, setFilters] = useState(loadFiltersFromStorage);

  // 필터 상태가 변경될 때 로컬 스토리지에 저장
  useEffect(() => {
    try {
      const filtersToSave = {
        ...filters,
        center: filters.center || "",
        orderIdKeyword: filters.orderIdKeyword || "",
      };
      localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filtersToSave));
    } catch (e) {
      console.error("필터 상태 저장 오류:", e);
    }
  }, [filters]);

  // 컴포넌트 마운트 시 저장된 필터가 있거나, 필터가 없어도 초기 API 호출 실행
  useEffect(() => {
    handleApplyFilter();
  }, []); // 마운트 시 1회 실행

  // 선택 상태 변경 감지를 위한 useEffect 추가
  useEffect(() => {
    // 선택된 행이 없는 경우
    if (Object.keys(rowSelection).length === 0) {
      // 이미 빈 배열이면 상태 업데이트 방지
      if (selectedInstructions.length > 0) {
        setSelectedInstructions([]);
      }
      return;
    }

    const selectedIds = [];

    // 방법 1: rowSelection 키에서 직접 ID 추출 시도 (기존 로직 유지)
    Object.keys(rowSelection).forEach((rowId) => {
      if (rowSelection[rowId]) {
        try {
          const parts = rowId.split("_");
          const lastPart = parts[parts.length - 1];
          const index = parseInt(lastPart);

          if (!isNaN(index) && index >= 0 && index < instructions.length) {
            const row = instructions[index];
            if (row && row.id !== undefined) {
              selectedIds.push(row.id);
            } else if (row && row.orderId !== undefined) {
              selectedIds.push(row.orderId);
            }
          }
        } catch (error) {
          console.error("행 ID 처리 중 오류:", error);
        }
      }
    });

    // 방법 2: 모든 ID를 확인하고 rowSelection에 있는지 확인 (기존 로직 유지)
    // 이 부분은 rowSelection의 ID 형식이 일관적이라면 방법 1로 충분할 수 있습니다.
    // 중복 ID가 들어가지 않도록 주의해야 합니다.
    const currentSelectedIdsSet = new Set(selectedIds);
    for (let i = 0; i < instructions.length; i++) {
      const simpleRowId = `row_${i}`;
      const alternateRowId1 = `row_table_${i}`; // 테이블 구현에 따라 다를 수 있음
      const alternateRowId2 = `${i}`;

      if (
        rowSelection[simpleRowId] ||
        rowSelection[alternateRowId1] ||
        rowSelection[alternateRowId2]
      ) {
        const row = instructions[i];
        let idToAdd = null;
        if (row && row.id !== undefined) {
          idToAdd = row.id;
        } else if (row && row.orderId !== undefined) {
          idToAdd = row.orderId;
        }

        if (idToAdd !== null && !currentSelectedIdsSet.has(idToAdd)) {
          selectedIds.push(idToAdd);
          currentSelectedIdsSet.add(idToAdd); // Set에도 추가하여 중복 방지
        }
      }
    }

    // selectedIds 배열을 정렬하여 stringify 결과의 일관성 확보 (선택 사항)
    const sortedSelectedIds = [...selectedIds].sort();
    const sortedCurrentSelectedInstructions = [...selectedInstructions].sort();

    // 이전 상태와 다를 경우에만 업데이트
    if (
      JSON.stringify(sortedSelectedIds) !==
      JSON.stringify(sortedCurrentSelectedInstructions)
    ) {
      setSelectedInstructions(sortedSelectedIds);
    }
  }, [rowSelection, instructions]); // 의존성 배열에서 selectedInstructions 제거 확인

  // 테이블에 표시할 컬럼 선택 상태 (새로운 필드 추가)
  const [visibleColumns, setVisibleColumns] = useState([
    "id",
    "orderId",
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
      page: 1, // 필터 적용 시 항상 첫 페이지로
      size: filterParams.size, // 현재 페이지 크기는 유지 (또는 기본값 filterParams.size)
      status: filters.status || "",
      center: filters.center || "",
      keyword: filters.orderIdKeyword || "",
    };

    setFilterParams(newFilterParams);
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

  // 긴 텍스트 자르기 유틸리티 함수
  const truncateText = (text, length = 20) => {
    if (!text) return "";
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  // 상태에 따른 배경색 클래스 반환
  const getStatusClass = (status) => {
    const statusInfo = STATUS_MAP[status] || { color: "gray" };
    return `bg-${statusInfo.color}-100 text-${statusInfo.color}-800`;
  };

  // 선택된 행 변경 핸들러 - 단순화
  const handleSelectionChange = (newRowSelection) => {
    // TanStack Table의 행 선택 상태 구조 예시:
    // { "row_0": true, "row_2": true } -> 0번과 2번 행이 선택됨

    // 선택 상태 업데이트 (setRowSelection이 비동기적으로 작동할 수 있음)
    setRowSelection(newRowSelection);

    // 선택된 ID 추출은 useEffect 훅으로 이동됨
  };

  // PDF 생성 핸들러
  const handleCreatePDF = async () => {
    if (selectedInstructions.length === 0) {
      showWarning("선택된 지시가 없습니다.");
      return;
    }

    setIsGeneratingPDF(true);

    try {
      // 선택된 ID 목록으로 API 호출하여 보수확인서 데이터 가져오기
      const response = await fetchBosuConfirmationData(selectedInstructions);
      const confirmationData = response.data;

      // 각 데이터별로 PDF 생성
      for (let i = 0; i < confirmationData.length; i++) {
        const data = confirmationData[i];
        const fileName = `보수확인서_${data.orderNumber || data.id}.pdf`;

        // PDF 생성 및 다운로드
        await generateBosuConfirmationPDF(data, fileName);

        // 여러 PDF 생성 시 약간의 딜레이 추가
        if (i < confirmationData.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      showSuccess(
        `${confirmationData.length}개의 보수확인서가 생성되었습니다.`
      );
    } catch (error) {
      console.error("PDF 생성 중 오류 발생:", error);
      console.error("에러 상세 정보:", error.response?.data || error.message);
      showError("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // 모든 가능한 컬럼 정의 (체크박스 컬럼은 제거하고 DataTable이 자체적으로 추가하도록 함)
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
      header: "지시ID",
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
      pageIndex: filterParams.page - 1,
      pageSize: filterParams.size,
    },
    rowSelection: rowSelection,
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
      center: "",
      orderIdKeyword: "",
    };

    // 필터 상태 초기화
    setFilters(defaultFilters);

    // 로컬 스토리지에서 필터 삭제
    localStorage.removeItem(FILTER_STORAGE_KEY);

    // API 호출 파라미터 초기화
    setFilterParams({
      status: "",
      center: "",
      keyword: "",
      page: 1,
      size: filterParams.size,
    });
  };

  // filterParams 변경 감지 로그 추가
  useEffect(() => {}, [filterParams]);

  return (
    <div className="min-h-screen px-4 py-6 mx-auto bg-gray-50">
      {/* 헤더 영역 */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="flex items-center text-2xl font-bold text-gray-800">
            <ListFilter className="w-6 h-6 mr-2 text-blue-600" />
            지시 목록
          </h1>
          <div className="flex space-x-2">
            {/* PDF 생성 버튼 추가 */}
            <FormButton
              variant="outline"
              onClick={handleCreatePDF}
              disabled={selectedInstructions.length === 0 || isGeneratingPDF}
              className={`flex items-center h-9 ${
                selectedInstructions.length > 0
                  ? "text-green-600 border-green-300 hover:bg-green-50"
                  : "text-gray-400 border-gray-200"
              }`}
            >
              <FileText className="w-4 h-4 mr-1" />
              보수확인서 PDF ({selectedInstructions.length})
            </FormButton>
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
            {/* 센터 필터 (기존 지점 필터 변경) */}
            <div className="flex-1 min-w-[180px]">
              <label
                htmlFor="center-filter"
                className="block mb-1 text-xs font-medium text-gray-700"
              >
                센터
              </label>
              <FormSelect
                id="center-filter"
                name="center"
                value={filters.center}
                onChange={handleFilterChange}
                options={[
                  { value: "강동", label: "강동" },
                  { value: "성북", label: "성북" },
                ]}
                className="h-10 py-0 text-sm"
                fullWidth={true}
              />
            </div>

            {/* 지시 ID 필터 (기존 제목 필터 변경) */}
            <div className="flex-1 min-w-[180px]">
              <label className="block mb-1 text-xs font-medium text-gray-700">
                지시 ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="orderIdKeyword"
                  value={filters.orderIdKeyword}
                  onChange={handleFilterChange}
                  placeholder="지시 ID로 검색"
                  className="w-full h-10 px-3 py-2 pl-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
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
                {selectedInstructions.length > 0 && (
                  <span className="ml-2 text-blue-600">
                    (선택됨: {selectedInstructions.length}개)
                  </span>
                )}
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
          // 상태 및 선택 관련 props
          state={tableState}
          emptyMessage="지시 데이터가 없습니다."
          errorMessage="지시 목록을 불러오는 데 실패했습니다."
          // 체크박스 선택 활성화 - selectionColumn은 전달하지 않고 enableSelection만 true로 설정
          enableSelection={true}
          onSelectionChange={handleSelectionChange}
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
