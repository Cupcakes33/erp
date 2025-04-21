import React from "react"
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react"

/**
 * 페이지네이션 컴포넌트
 * @param {Object} props
 * @param {number} props.currentPage - 현재 페이지 (0부터 시작)
 * @param {number} props.totalPages - 전체 페이지 수
 * @param {Function} props.onPageChange - 페이지 변경 핸들러 함수 (0-기반 인덱스를 받음)
 * @param {number} [props.maxButtons=10] - 한 번에 표시할 최대 페이지 버튼 수
 * @param {number} props.pageSize - 현재 페이지 크기
 * @param {Function} props.onPageSizeChange - 페이지 크기 변경 핸들러 함수
 * @param {Array<number>} [props.pageSizeOptions=[10, 20, 50, 100]] - 페이지 크기 옵션
 * @returns {JSX.Element}
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxButtons = 10,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}) => {
  // 화면에 표시할 페이지 번호는 1부터 시작하도록 변환
  const displayPage = currentPage + 1

  // 페이지 버튼 범위 계산 (화면에 표시되는 페이지 번호는 1부터 시작)
  let startPage = Math.max(1, displayPage - Math.floor(maxButtons / 2))
  let endPage = Math.min(totalPages, startPage + maxButtons - 1)

  // 버튼 개수 조정
  if (endPage - startPage + 1 < maxButtons && startPage > 1) {
    startPage = Math.max(1, endPage - maxButtons + 1)
  }

  // 페이지 버튼 배열 생성
  const pages = []
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  // 페이지가 1개 이하면 페이지네이션 표시하지 않음
  if (totalPages <= 1 && pageSizeOptions.length <= 1) return null

  // 페이지 크기 변경 핸들러
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10)
    if (onPageSizeChange) {
      onPageSizeChange(newSize)
    }
  }

  return (
    <div className="flex flex-col items-center mt-4 mb-4 space-y-3">
      {/* 페이지 크기 선택기 */}
      {onPageSizeChange && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>페이지당 항목 수:</span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-center space-x-2">
        {/* 첫 페이지 버튼 */}
        <button
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0}
          className={`w-8 h-8 p-0 border rounded-md ${
            currentPage === 0
              ? "text-gray-400 border-gray-200"
              : "text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <span className="sr-only">첫 페이지</span>
          <ChevronsLeft className="w-4 h-4 mx-auto" />
        </button>

        {/* 이전 페이지 버튼 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={`w-8 h-8 p-0 border rounded-md ${
            currentPage === 0
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
            onClick={() => onPageChange(page - 1)} // 화면에 표시되는 페이지는 1부터, API 페이지는 0부터
            className={`w-8 h-8 text-sm font-medium rounded-md ${
              page === displayPage
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            {page}
          </button>
        ))}

        {/* 다음 페이지 버튼 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className={`w-8 h-8 p-0 border rounded-md ${
            currentPage === totalPages - 1
              ? "text-gray-400 border-gray-200"
              : "text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <span className="sr-only">다음 페이지</span>
          <ChevronRight className="w-4 h-4 mx-auto" />
        </button>

        {/* 마지막 페이지 버튼 */}
        <button
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
          className={`w-8 h-8 p-0 border rounded-md ${
            currentPage === totalPages - 1
              ? "text-gray-400 border-gray-200"
              : "text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <span className="sr-only">마지막 페이지</span>
          <ChevronsRight className="w-4 h-4 mx-auto" />
        </button>
      </div>
    </div>
  )
}

export default Pagination
