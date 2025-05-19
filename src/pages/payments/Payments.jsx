import { DataTable, FormSelect } from "@/components/molecules";
import React, { useState, useEffect } from "react";
import { DollarSign, File, BarChart, Wrench, Eye } from "lucide-react";
import { dummyContracts, dummyPayments, dummyWorkOrders } from "./mockData";

// 로컬 스토리지 키 정의
const FILTER_STORAGE_KEY = "payments_list_filters";

export default function Payments() {
  // 필터 파라미터 상태 (API 호출용)
  const [filterParams, setFilterParams] = useState({
    branchName: "",
    page: 1,
    size: 10,
  });

  // 로컬 스토리지에서 필터 상태 불러오기
  const loadFiltersFromStorage = () => {
    try {
      const savedFilters = localStorage.getItem(FILTER_STORAGE_KEY);
      if (savedFilters) {
        return JSON.parse(savedFilters);
      }
    } catch (e) {
      console.error("필터 상태 로드 오류:", e);
    }

    // 기본 필터 상태 반환
    return {
      branchName: "",
    };
  };

  // 필터 상태 초기화
  const [filters, setFilters] = useState(loadFiltersFromStorage);

  // 필터 상태가 변경될 때 로컬 스토리지에 저장
  useEffect(() => {
    try {
      localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
    } catch (e) {
      console.error("필터 상태 저장 오류:", e);
    }
  }, [filters]);

  // 지점 필터 변경시 즉시 적용
  useEffect(() => {
    setFilterParams({
      ...filterParams,
      branchName: filters.branchName || "",
    });
  }, [filters.branchName]);

  // 상태 관리
  const [contractsLoading, setContractsLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [workOrdersLoading, setWorkOrdersLoading] = useState(false);

  // 필터 변경 핸들러
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // 워크오더 필터링 (지점 기준)
  const filteredWorkOrders = dummyWorkOrders.filter((order) => {
    // 지점 필터 적용
    if (filterParams.branchName && order.managementCenter) {
      if (!order.managementCenter.includes(filterParams.branchName)) {
        return false;
      }
    }
    return true;
  });

  // 계약 목록 컬럼 정의
  const contractColumns = [
    {
      accessorKey: "contractName",
      header: "계약명",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "contractAmount",
      header: "계약금액",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "contractDate",
      header: "계약일",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "company",
      header: "업체",
      cell: (info) => info.getValue() ?? null,
    },
    {
      id: "actions",
      header: "액션",
      cell: ({ row }) => (
        <div className="flex justify-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // 상세보기 함수
              console.log("계약 상세보기:", row.original);
            }}
            className="p-1 text-blue-600 rounded hover:bg-blue-50"
            title="상세보기"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // 기성 목록 컬럼 정의
  const paymentColumns = [
    {
      accessorKey: "order",
      header: "차수",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "inspectionDate",
      header: "기성검사일",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "previousTotal",
      header: "전회까지",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "detailAmount",
      header: "내역금액",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "paymentAmount",
      header: "기성금액",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "accumulatedAmount",
      header: "누계금액",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "status",
      header: "처리상태",
      cell: (info) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            info.getValue() === "기성합격 선정"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {info.getValue() ?? null}
        </span>
      ),
    },
    {
      id: "actions",
      header: "액션",
      cell: ({ row }) => (
        <div className="flex justify-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // 상세보기 함수
              console.log("기성 상세보기:", row.original);
            }}
            className="p-1 text-blue-600 rounded hover:bg-blue-50"
            title="상세보기"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // 기성 보수지시 공종 목록 컬럼 정의
  const workOrderColumns = [
    {
      accessorKey: "order",
      header: "차수",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "managementCenter",
      header: "관리센터",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "orderId",
      header: "지시서ID",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "orderNumber",
      header: "지시번호",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "orderDate",
      header: "지시일자",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "orderName",
      header: "지시명",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "orderStatus",
      header: "지시서상태",
      cell: (info) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            info.getValue() === "완료"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {info.getValue() ?? null}
        </span>
      ),
    },
    {
      id: "actions",
      header: "액션",
      cell: ({ row }) => (
        <div className="flex justify-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // 상세보기 함수
              console.log("보수지시 상세보기:", row.original);
            }}
            className="p-1 text-blue-600 rounded hover:bg-blue-50"
            title="상세보기"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // 행 클릭 핸들러
  const handleRowClick = (data) => {
    console.log("행 클릭:", data);
    // 상세 페이지 이동 등의 로직 추가
  };

  return (
    <div className="min-h-screen px-4 py-6 mx-auto bg-gray-50">
      {/* 헤더 영역 - 지점 필터만 포함 */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center text-2xl font-bold text-gray-800">
            <DollarSign className="w-6 h-6 mr-2 text-blue-600" />
            기성 조회
          </h1>
          <div className="w-64">
            <FormSelect
              id="branchName-filter"
              name="branchName"
              value={filters.branchName}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "전체" },
                { value: "1번지점", label: "1번지점" },
                { value: "2번지점", label: "2번지점" },
              ]}
              className="h-10 py-0text-sm"
              fullWidth={true}
            />
          </div>
        </div>
      </div>

      {/* 계약 목록과 기성 목록 (가로로 배치) */}
      <div className="flex flex-col gap-6 mb-6 md:flex-row">
        {/* 계약 목록 테이블 카드 */}
        <div className="flex-1 overflow-hidden bg-white rounded-lg shadow-sm">
          <div className="px-5 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center text-lg font-medium text-gray-800">
                <File className="w-5 h-5 mr-2 text-blue-600" />
                계약 목록
              </h2>
              <div className="text-sm text-gray-500">
                총 {dummyContracts.length}개 항목
              </div>
            </div>
          </div>
          <DataTable
            columns={contractColumns}
            data={dummyContracts}
            loading={contractsLoading}
            emptyMessage={
              contractsLoading ? "데이터 로딩 중..." : "등록된 계약이 없습니다."
            }
            pageSize={5}
            onRowClick={handleRowClick}
            enablePagination={true}
          />
        </div>

        {/* 기성 목록 테이블 카드 */}
        <div className="flex-1 overflow-hidden bg-white rounded-lg shadow-sm">
          <div className="px-5 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center text-lg font-medium text-gray-800">
                <BarChart className="w-5 h-5 mr-2 text-blue-600" />
                기성 목록
              </h2>
              <div className="text-sm text-gray-500">
                총 {dummyPayments.length}개 항목
              </div>
            </div>
          </div>
          <DataTable
            columns={paymentColumns}
            data={dummyPayments}
            loading={paymentsLoading}
            emptyMessage={
              paymentsLoading ? "데이터 로딩 중..." : "등록된 기성이 없습니다."
            }
            pageSize={5}
            onRowClick={handleRowClick}
            enablePagination={true}
          />
        </div>
      </div>

      {/* 기성 보수지시 공종 목록 (아래에 배치) */}
      <div className="overflow-hidden bg-white rounded-lg shadow-sm">
        <div className="px-5 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center text-lg font-medium text-gray-800">
              <Wrench className="w-5 h-5 mr-2 text-blue-600" />
              기성 보수지시 공종 목록
            </h2>
            <div className="text-sm text-gray-500">
              총 {filteredWorkOrders.length}개 항목
            </div>
          </div>
        </div>
        <DataTable
          columns={workOrderColumns}
          data={filteredWorkOrders}
          loading={workOrdersLoading}
          emptyMessage={
            workOrdersLoading
              ? "데이터 로딩 중..."
              : "등록된 보수지시가 없습니다."
          }
          pageSize={7}
          onRowClick={handleRowClick}
          enablePagination={true}
        />
      </div>
    </div>
  );
}
