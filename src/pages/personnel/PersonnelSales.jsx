import React, { useState, useEffect } from "react";
import { DataTable, FormInput, FormButton } from "../../components/molecules";
import { Search, ListFilter, Filter, X } from "lucide-react";
import { useWorkerSales } from "../../lib/api/personnelQueries";
import { formatNumberKR } from "@/lib/utils/formatterUtils";

/**
 * 작업자 매출 조회 페이지
 */
const PersonnelSales = () => {
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
    name: "",
    startDate: defaultRange.start,
    endDate: defaultRange.end,
  });
  const [filterParams, setFilterParams] = useState({
    name: "",
    startDate: defaultRange.start,
    endDate: defaultRange.end,
  });

  const {
    data: salesData,
    isLoading,
    isError,
    error,
  } = useWorkerSales(filterParams);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilter = () => {
    const { startDate, endDate, name } = filters;
    setFilterParams({ name, start: startDate, end: endDate });
  };

  const resetFilters = () => {
    const defaultFilters = {
      name: "",
      startDate: defaultRange.start,
      endDate: defaultRange.end,
    };
    setFilters(defaultFilters);
    setFilterParams({
      name: "",
      start: defaultRange.start,
      end: defaultRange.end,
    });
  };

  const columns = [
    {
      accessorKey: "name",
      header: "이름",
      className: "px-2",
    },
    {
      accessorKey: "sales",
      header: "매출",
      className: "px-2 text-right",
      cell: ({ row }) => formatNumberKR(row.original.sales),
    },
  ];

  return (
    <div className="min-h-screen px-4 py-6 mx-auto bg-gray-50">
      <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="flex items-center text-2xl font-bold text-gray-800">
            <ListFilter className="w-6 h-6 mr-2 text-blue-600" />
            인사 관리
          </h1>
          <p className="text-gray-600">작업자 매출 조회</p>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex flex-wrap items-end justify-start w-full gap-4">
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
                htmlFor="name-filter"
                className="block mb-1 text-xs font-medium text-gray-700"
              >
                이름으로 검색
              </label>
              <div className="relative">
                <FormInput
                  id="name-filter"
                  type="text"
                  name="name"
                  className="pl-10"
                  placeholder="이름 검색..."
                  value={filters.name}
                  onChange={handleFilterChange}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                <Filter className="w-4 h-4 mr-1" />
                조회
              </FormButton>
              <FormButton
                variant="outline"
                size="md"
                onClick={resetFilters}
                className="flex items-center text-red-600 border-red-300 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1" />
                초기화
              </FormButton>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-white rounded-lg shadow-sm">
        <DataTable
          columns={columns}
          data={salesData?.data || []}
          isLoading={isLoading}
          isError={isError}
          error={error}
          emptyMessage="매출 데이터가 없습니다."
          errorMessage="데이터를 불러오는 중 오류가 발생했습니다."
        />
      </div>
    </div>
  );
};

export default PersonnelSales;
