import React from "react";
import DataTable from "./DataTable";

/**
 * TableAdapter 컴포넌트
 * 기존 Table 컴포넌트의 인터페이스를 유지하면서 내부적으로는 DataTable을 사용하는 어댑터 컴포넌트
 * 이를 통해 기존 코드의 변경을 최소화하면서 테이블 컴포넌트 통일
 */
const TableAdapter = ({
  columns,
  data,
  isLoading = false,
  emptyMessage = "데이터가 없습니다.",
  className = "",
  onRowClick,
}) => {
  // 기존 Table의 columns 구조를 DataTable의 columns 구조로 변환
  const adaptedColumns = columns.map((column) => ({
    accessorKey: column.dataIndex,
    header: column.title,
    cell: column.render ? ({ row }) => column.render(row.original) : undefined,
    enableSorting: column.sortable !== false,
    headerClassName: column.className,
    cellClassName: column.cellClassName,
  }));

  return (
    <DataTable
      columns={adaptedColumns}
      data={data}
      loading={isLoading}
      emptyMessage={emptyMessage}
      onRowClick={onRowClick}
      className={className}
      containerClassName=""
      enablePagination={data.length > 10}
    />
  );
};

export default TableAdapter;
