"use client";

import React, { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormCard } from "@/components/molecules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Search,
} from "lucide-react";

export const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "데이터가 없습니다.",
  onRowClick,
  title,
  subtitle,
  footer,
  globalFilter = "",
  setGlobalFilter,
  enableSorting = true,
  enableMultiSort = true,
  enablePagination = true,
  enableGlobalFilter = true,
  manualPagination = false,
  manualSorting = false,
  pageCount = 0,
  pageIndex = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onSortingChange,
  state = {},
  selectionColumn,
  className = "",
  containerClassName = "",
  variant = "outline",
  horizontalScroll = false,
  verticalScroll = false,
  maxHeight = "400px",
  ...props
}) => {
  const [sorting, setSorting] = useState(state.sorting || []);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilterValue, setGlobalFilterValue] = useState(globalFilter);
  const [pagination, setPagination] = useState({
    pageIndex: pageIndex,
    pageSize: pageSize,
  });

  // 외부 상태 변경 시 내부 상태 업데이트
  useEffect(() => {
    if (state.sorting) {
      setSorting(state.sorting);
    }
  }, [state.sorting]);

  // 페이지네이션 상태 업데이트
  useEffect(() => {
    if (manualPagination) {
      setPagination({
        pageIndex: pageIndex,
        pageSize: pageSize,
      });
    }
  }, [manualPagination, pageIndex, pageSize]);

 

  // 테이블 설정
  const table = useReactTable({
    data: Array.isArray(data) ? data : [],
    columns: selectionColumn ? [selectionColumn, ...columns] : columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel:
      enablePagination && !manualPagination
        ? getPaginationRowModel()
        : undefined,
    getSortedRowModel:
      enableSorting && !manualSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: manualSorting
      ? (updater) => {
          const newSorting =
            typeof updater === "function" ? updater(sorting) : updater;

          setSorting(newSorting);

          if (onSortingChange) {
            onSortingChange(newSorting);
          }
        }
      : setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter || setGlobalFilterValue,
    onPaginationChange: manualPagination
      ? (updater) => {
          const newPagination =
            typeof updater === "function" ? updater(pagination) : updater;

          setPagination(newPagination);

          if (
            onPageChange &&
            newPagination.pageIndex !== pagination.pageIndex
          ) {
            onPageChange(newPagination.pageIndex);
          }

          if (
            onPageSizeChange &&
            newPagination.pageSize !== pagination.pageSize
          ) {
            onPageSizeChange(newPagination.pageSize);
          }
        }
      : setPagination,
    enableSorting,
    enableMultiSort,
    manualPagination,
    manualSorting,
    pageCount: manualPagination ? pageCount : undefined,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter: setGlobalFilter ? globalFilter : globalFilterValue,
      pagination,
    },
    debugTable: true, // 테이블 디버깅 활성화
  });


  return (
    <FormCard
      title={title}
      subtitle={subtitle}
      footer={footer}
      className={containerClassName}
      variant={variant}
      {...props}
    >
      <div
        className={`space-y-4 ${className} ${enableGlobalFilter ? "" : "pt-4"}`}
      >
        <div className="border rounded-md">
          <div className="relative">
            {/* 로딩 오버레이 */}
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                  <p className="mt-2 text-gray-600">로딩 중...</p>
                </div>
              </div>
            )}

            {/* 테이블 */}
            <div className={`${horizontalScroll ? 'overflow-x-auto' : ''} ${verticalScroll ? 'overflow-y-auto' : ''}`} style={{ maxHeight: verticalScroll ? maxHeight : 'none' }}>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            key={header.id}
                            className={header.column.columnDef.headerClassName}
                          >
                          {header.isPlaceholder ? null : (
                            <div
                              className={
                                enableSorting && header.column.getCanSort()
                                  ? "flex items-center cursor-pointer select-none"
                                  : undefined
                              }
                              onClick={
                                enableSorting && header.column.getCanSort()
                                  ? header.column.getToggleSortingHandler()
                                  : undefined
                              }
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}

                              {/* 정렬 아이콘 */}
                              {enableSorting && header.column.getCanSort() && (
                                <span className="ml-1">
                                  {header.column.getIsSorted() === "asc" ? (
                                    <ArrowUp className="w-4 h-4" />
                                  ) : header.column.getIsSorted() === "desc" ? (
                                    <ArrowDown className="w-4 h-4" />
                                  ) : (
                                    <ArrowUpDown className="w-4 h-4" />
                                  )}
                                </span>
                              )}
                            </div>
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={
                        onRowClick ? () => onRowClick(row.original) : undefined
                      }
                      className={onRowClick ? "cursor-pointer" : undefined}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cell.column.columnDef.cellClassName}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (selectionColumn ? 1 : 0)}
                      className="py-10 text-center text-gray-500"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </FormCard>
  );
};

export default DataTable;
