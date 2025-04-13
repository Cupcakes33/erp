import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormCard as Card } from "./index";

/**
 * DataTable - shadcn/ui 테이블 컴포넌트를 활용한 데이터 테이블
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
  ...props
}) => {
  return (
    <Card
      title={title}
      subtitle={subtitle}
      footer={footer}
      className={className}
      {...props}
    >
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
            <div className="p-4 bg-white rounded-md shadow-md">
              <p className="text-gray-600">로딩 중...</p>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead
                    key={index}
                    className={column.className}
                    style={column.style}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="py-6 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={
                      onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                    }
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className={column.cellClassName}
                        style={column.cellStyle}
                      >
                        {column.cell
                          ? column.cell(row)
                          : row[column.accessor] || "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default DataTable;
