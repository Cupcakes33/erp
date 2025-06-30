import React, { useState } from "react";
import {
  DataTable,
  FormInput,
  FormButton,
  FormSelect,
} from "../../components/molecules";
import { Search, ListFilter, Filter, X } from "lucide-react";
import { useGetPaymentsByTrade } from "@/lib/api/paymentsQueries";
import { formatNumberKR } from "@/lib/utils/formatterUtils";

/**
 * 공종별 금액 조회 페이지
 */
const PaymentsByTrade = () => {
  // 이번달 1일과 오늘 날짜 구하기
  const getMonthRange = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const today = now;
    return {
      start: firstDay.toISOString().slice(0, 10),
      end: today.toISOString().slice(0, 10),
    };
  };

  const defaultRange = getMonthRange();

  const [filters, setFilters] = useState({
    type: "all",
    tradeName: "",
    startDate: defaultRange.start,
    endDate: defaultRange.end,
  });
  const [filterParams, setFilterParams] = useState({
    type: "all",
    tradeName: "",
    startDate: defaultRange.start,
    endDate: defaultRange.end,
  });

  const {
    data: tradeData,
    isLoading,
    isError,
    error,
  } = useGetPaymentsByTrade(filterParams);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilter = () => {
    const { startDate, endDate, ...rest } = filters;
    setFilterParams({ ...rest, start: startDate, end: endDate });
  };

  const resetFilters = () => {
    const defaultFilters = {
      type: "all",
      tradeName: "",
      startDate: defaultRange.start,
      endDate: defaultRange.end,
    };
    setFilters(defaultFilters);
    setFilterParams({
      type: "all",
      tradeName: "",
      start: defaultRange.start,
      end: defaultRange.end,
    });
  };

  const columns = [
    { accessorKey: "type", header: "구분", className: "px-2" },
    { accessorKey: "code", header: "코드", className: "px-2" },
    { accessorKey: "name", header: "공종명", className: "px-2" },
    {
      accessorKey: "cost",
      header: "단가",
      className: "px-2 text-right",
      cell: ({ row }) => formatNumberKR(row.original.cost),
    },
    {
      accessorKey: "totalPrice",
      header: "금액",
      className: "px-2 text-right",
      cell: ({ row }) => formatNumberKR(row.original.totalPrice),
    },
  ];

  const typeOptions = [
    { value: "건축", label: "건축" },
    { value: "조경", label: "조경" },
    { value: "기계", label: "기계" },
  ];

  return (
    <div className="px-4 py-6 mx-auto min-h-screen bg-gray-50">
      <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="flex items-center text-2xl font-bold text-gray-800">
            <ListFilter className="mr-2 w-6 h-6 text-blue-600" />
            기성 관리
          </h1>
          <p className="text-gray-600">공종별 금액 조회</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-wrap gap-4 justify-start items-end w-full">
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 text-xs font-medium text-gray-700">
                타입 선택
              </label>
              <FormSelect
                name="type"
                options={typeOptions}
                value={filters.type}
                onChange={handleFilterChange}
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block mb-1 text-xs font-medium text-gray-700">
                날짜 선택
              </label>
              <div className="flex gap-2">
                <FormInput
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
                <FormInput
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label
                htmlFor="tradeName-filter"
                className="block mb-1 text-xs font-medium text-gray-700"
              >
                공종명으로 검색
              </label>
              <div className="relative">
                <FormInput
                  id="tradeName-filter"
                  type="text"
                  name="tradeName"
                  className="pl-10"
                  placeholder="공종명 검색..."
                  value={filters.tradeName}
                  onChange={handleFilterChange}
                />
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <FormButton
                variant="primary"
                size="md"
                onClick={handleApplyFilter}
                className="flex items-center"
              >
                <Filter className="mr-1 w-4 h-4" />
                조회
              </FormButton>
              <FormButton
                variant="outline"
                size="md"
                onClick={resetFilters}
                className="flex items-center text-red-600 border-red-300 hover:bg-red-50"
              >
                <X className="mr-1 w-4 h-4" />
                초기화
              </FormButton>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-white rounded-lg shadow-sm">
        <DataTable
          columns={columns}
          data={tradeData?.data || []}
          isLoading={isLoading}
          isError={isError}
          error={error}
          emptyMessage="데이터가 없습니다."
          errorMessage="데이터를 불러오는 중 오류가 발생했습니다."
        />
      </div>
    </div>
  );
};

export default PaymentsByTrade;
