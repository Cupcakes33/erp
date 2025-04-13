import React from "react";
import {
  Table as ShadcnTable,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const Table = ({
  columns,
  data,
  isLoading = false,
  emptyMessage = "데이터가 없습니다.",
  className = "",
  onRowClick,
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <ShadcnTable>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className="font-medium text-gray-500 uppercase"
                style={column.width ? { width: column.width } : {}}
              >
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-gray-500"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={onRowClick ? "cursor-pointer" : ""}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {column.render ? column.render(row) : row[column.dataIndex]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </ShadcnTable>
    </div>
  );
};

export default Table;
