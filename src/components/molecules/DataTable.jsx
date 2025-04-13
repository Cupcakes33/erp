import React from "react";
import { FormCard as Card } from "./index";
import { DataTable as DataTableComponent } from "@/components/ui/data-table";

/**
 * DataTable - TanStack Table 기반 데이터 테이블
 * 정렬, 필터링, 페이지네이션 등 고급 기능 지원
 */
const DataTable = ({
  columns = [],
  data = [],
  title,
  subtitle,
  loading = false,
  emptyMessage = "데이터가 없습니다.",
  footer,
  onRowClick,
  className = "",
  globalFilter,
  setGlobalFilter,
  enableSelection = false,
  enableSorting = true,
  enableMultiSort = true,
  enablePagination = true,
  enableGlobalFilter = true,
  onSelectionChange,
  ...props
}) => {
  // columns 구조 검증 및 필요시 변환
  const normalizedColumns = columns.map((column) => {
    // accessorKey가 없고 accessor가 있는 경우 변환
    if (!column.accessorKey && column.accessor) {
      return {
        ...column,
        accessorKey: column.accessor,
        header: column.header || column.title,
        cell: column.cell
          ? ({ row }) => {
              // row.original을 사용하는 이전 방식의 cell 함수 지원
              const value = row.getValue(column.accessor);
              return column.cell({ ...row.original, [column.accessor]: value });
            }
          : undefined,
      };
    }

    // 이미 올바른 형식을 갖추고 있는 경우
    return column;
  });

  console.log("DataTable wrapper - 원본 columns:", columns);
  console.log("DataTable wrapper - 정규화된 columns:", normalizedColumns);

  // 선택 열 설정 (필요시)
  const selectionColumn = enableSelection
    ? {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            onClick={(e) => e.stopPropagation()}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
          />
        ),
        enableSorting: false,
      }
    : undefined;

  return (
    <DataTableComponent
      columns={normalizedColumns}
      data={data}
      loading={loading}
      emptyMessage={emptyMessage}
      onRowClick={onRowClick}
      title={title}
      subtitle={subtitle}
      footer={footer}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      enableSorting={enableSorting}
      enableMultiSort={enableMultiSort}
      enablePagination={enablePagination}
      enableGlobalFilter={enableGlobalFilter}
      selectionColumn={selectionColumn}
      className={className}
      containerClassName=""
      {...props}
    />
  );
};

export default DataTable;
