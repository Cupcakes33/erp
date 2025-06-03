import { DataTable, FormSelect } from "@/components/molecules";
import React, { useState, useEffect } from "react";
import { DollarSign, File, BarChart, Wrench } from "lucide-react";
import {
  useGetContracts,
  useGetPayments,
  useGetPaymentDetail,
} from "@/lib/api/paymentsQueries";

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

  // 선택된 계약 및 기성 ID 상태
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  // 필터 상태가 변경될 때 로컬 스토리지에 저장
  useEffect(() => {
    try {
      localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
    } catch (e) {
      console.error("필터 상태 저장 오류:", e);
    }
  }, [filters]);

  // 지점 필터 변경시 즉시 적용 및 선택 초기화
  useEffect(() => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      branchName: filters.branchName || "",
    }));
    setSelectedContractId(null);
    setSelectedPaymentId(null);
  }, [filters.branchName]);

  // API 데이터 조회
  const {
    data: contractsData,
    error: contractsError,
    isLoading: contractsLoading,
  } = useGetContracts({
    center: filterParams.branchName || undefined,
  });

  const {
    data: paymentsData,
    error: paymentsError,
    isLoading: paymentsLoading,
  } = useGetPayments(
    { contractId: selectedContractId },
    { enabled: !!selectedContractId }
  );

  const {
    data: workOrdersData,
    error: workOrdersError,
    isLoading: workOrdersLoading,
  } = useGetPaymentDetail(selectedPaymentId, {
    enabled: !!selectedPaymentId,
  });

  // 필터 변경 핸들러
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // 계약 목록 컬럼 정의
  const contractColumns = [
    {
      accessorKey: "name",
      header: "계약명",
      cell: (info) => info.getValue() ?? "-",
    },
    {
      accessorKey: "center",
      header: "지사",
      cell: (info) => info.getValue() ?? "-",
    },
  ];

  // 기성 목록 컬럼 정의
  const paymentColumns = [
    {
      accessorKey: "round",
      header: "차수",
      cell: (info) => info.getValue() ?? "-",
    },
    {
      accessorKey: "currentAmount",
      header: "기성금액",
      cell: (info) => info.getValue()?.toLocaleString() ?? "-",
    },
    {
      accessorKey: "cumulativeAmount",
      header: "누계금액",
      cell: (info) => info.getValue()?.toLocaleString() ?? "-",
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: (info) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            info.getValue() === "기성합격 선정" || info.getValue() === "승인"
              ? "bg-green-100 text-green-800"
              : info.getValue() === "작성중"
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {info.getValue() ?? "-"}
        </span>
      ),
    },
  ];

  // 기성 보수지시 공종 목록 컬럼 정의
  const workOrderColumns = [
    {
      accessorKey: "round",
      header: "차수",
      cell: (info) => info.getValue() ?? "-",
    },
    {
      accessorKey: "center",
      header: "지사",
      cell: (info) => info.getValue() ?? "-",
    },
    {
      accessorKey: "orderId",
      header: "지시서ID",
      cell: (info) => info.getValue() ?? "-",
    },
    {
      accessorKey: "orderNumber",
      header: "지시번호",
      cell: (info) => info.getValue() ?? "-",
    },
    {
      accessorKey: "orderDate",
      header: "지시일",
      cell: (info) => info.getValue() ?? "-",
    },
    {
      accessorKey: "materialCost",
      header: "재료비",
      cell: (info) => info.getValue()?.toLocaleString() ?? "-",
    },
    {
      accessorKey: "laborCost",
      header: "노무비",
      cell: (info) => info.getValue()?.toLocaleString() ?? "-",
    },
    {
      accessorKey: "expenseCost",
      header: "경비",
      cell: (info) => info.getValue()?.toLocaleString() ?? "-",
    },
    {
      accessorKey: "totalCost",
      header: "합계",
      cell: (info) => info.getValue()?.toLocaleString() ?? "-",
    },
  ];

  // 행 클릭 핸들러
  const handleContractRowClick = (rowData) => {
    setSelectedContractId(rowData.id);
    setSelectedPaymentId(null);
    console.log("계약 행 클릭:", rowData);
  };

  const handlePaymentRowClick = (rowData) => {
    setSelectedPaymentId(rowData.id);
    console.log("기성 행 클릭:", rowData);
  };

  const handleWorkOrderRowClick = (rowData) => {
    console.log("보수지시 행 클릭:", rowData);
  };

  return (
    <div className="flex flex-col px-4 py-6 mx-auto bg-gray-50">
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
                { value: "강동", label: "강동" },
                { value: "성북", label: "성북" },
              ]}
              className="h-10 py-0text-sm"
              fullWidth={true}
            />
          </div>
        </div>
      </div>

      {/* 콘텐츠 영역 Wrapper */}
      <div className="flex flex-col flex-grow gap-6">
        {/* 계약 목록과 기성 목록 (가로로 배치) */}
        <div className="flex flex-col flex-grow gap-6 md:flex-row">
          {/* 계약 목록 테이블 카드 */}
          <div className="flex flex-col flex-1 overflow-hidden bg-white rounded-lg shadow-sm">
            <div className="px-5 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center text-lg font-medium text-gray-800">
                  <File className="w-5 h-5 mr-2 text-blue-600" />
                  계약 목록
                </h2>
                <div className="text-sm text-gray-500">
                  총 {contractsData?.length || 0}개 항목
                </div>
              </div>
            </div>
            <div className="h-64 overflow-hidden">
              <DataTable
                columns={contractColumns}
                data={contractsData || []}
                loading={false}
                className="h-full overflow-y-auto"
                emptyMessage={
                  contractsError ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <p className="mb-2 text-lg">
                        계약 목록을 불러오는데 실패했습니다.
                      </p>
                      <p className="text-sm">
                        네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.
                      </p>
                    </div>
                  ) : contractsLoading ? null : contractsData &&
                    contractsData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <p className="text-lg">등록된 계약이 없습니다.</p>
                      <p className="text-sm">새로운 계약을 추가해보세요.</p>
                    </div>
                  ) : null
                }
                pageSize={5}
                onRowClick={handleContractRowClick}
                enablePagination={true}
                selectedRowId={selectedContractId}
              />
            </div>
          </div>

          {/* 기성 목록 테이블 카드 */}
          <div className="flex flex-col flex-1 overflow-hidden bg-white rounded-lg shadow-sm">
            <div className="px-5 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center text-lg font-medium text-gray-800">
                  <BarChart className="w-5 h-5 mr-2 text-blue-600" />
                  기성 목록
                </h2>
                <div className="text-sm text-gray-500">
                  총 {paymentsData?.length || 0}개 항목
                </div>
              </div>
            </div>
            <div className="h-64 overflow-hidden">
              <DataTable
                columns={paymentColumns}
                data={paymentsData || []}
                loading={false}
                className="h-full overflow-y-auto"
                emptyMessage={
                  !selectedContractId ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <File className="w-12 h-12 mb-4 text-gray-400" />
                      <p className="mb-2 text-lg font-semibold">
                        계약을 먼저 선택해주세요.
                      </p>
                      <p className="text-sm">
                        왼쪽 계약 목록에서 기성을 조회할 계약을 선택하세요.
                      </p>
                    </div>
                  ) : paymentsError ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <p className="mb-2 text-lg">
                        기성 목록을 불러오는데 실패했습니다.
                      </p>
                      <p className="text-sm">
                        네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.
                      </p>
                    </div>
                  ) : paymentsLoading ? null : paymentsData &&
                    paymentsData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <p className="text-lg">
                        선택된 계약에 대한 기성 내역이 없습니다.
                      </p>
                      <p className="text-sm">
                        다른 계약을 선택하거나 새로운 기성을 등록하세요.
                      </p>
                    </div>
                  ) : null
                }
                pageSize={5}
                onRowClick={handlePaymentRowClick}
                enablePagination={true}
                selectedRowId={selectedPaymentId}
              />
            </div>
          </div>
        </div>

        {/* 기성 보수지시 공종 목록 (아래에 배치) */}
        <div className="flex flex-col flex-grow overflow-hidden bg-white rounded-lg shadow-sm">
          <div className="px-5 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center text-lg font-medium text-gray-800">
                <Wrench className="w-5 h-5 mr-2 text-blue-600" />
                기성 보수지시 공종 목록
              </h2>
              <div className="text-sm text-gray-500">
                총 {workOrdersData?.length || 0}개 항목
              </div>
            </div>
          </div>
          <div className="h-64 overflow-hidden">
            <DataTable
              columns={workOrderColumns}
              data={workOrdersData || []}
              loading={false}
              className="h-full overflow-y-auto"
              emptyMessage={
                !selectedPaymentId ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <BarChart className="w-12 h-12 mb-4 text-gray-400" />
                    <p className="mb-2 text-lg font-semibold">
                      기성 항목을 먼저 선택해주세요.
                    </p>
                    <p className="text-sm">
                      위 기성 목록에서 보수지시를 조회할 항목을 선택하세요.
                    </p>
                  </div>
                ) : workOrdersError ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p className="mb-2 text-lg">
                      보수지시 목록을 불러오는데 실패했습니다.
                    </p>
                    <p className="text-sm">
                      네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.
                    </p>
                  </div>
                ) : workOrdersLoading ? null : workOrdersData &&
                  workOrdersData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p className="text-lg">
                      선택된 기성에 대한 보수지시 내역이 없습니다.
                    </p>
                    <p className="text-sm">
                      다른 기성을 선택하거나 새로운 보수지시를 등록하세요.
                    </p>
                  </div>
                ) : null
              }
              pageSize={7}
              onRowClick={handleWorkOrderRowClick}
              enablePagination={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
