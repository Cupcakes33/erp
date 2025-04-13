import React, { useState } from "react";
import { useWorks } from "../../lib/api/workQueries";
import { excelUtils } from "../../lib/utils/excelUtils";
import Card from "../../components/atoms/Card";
import Button from "../../components/atoms/Button";
import Select from "../../components/atoms/Select";
import Input from "../../components/atoms/Input";
import FormGroup from "../../components/molecules/FormGroup";

const WorkExport = () => {
  const { data: works = [], isLoading: isLoadingWorks } = useWorks();

  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    assignedTo: "",
    search: "",
  });
  const [fileName, setFileName] = useState("작업_데이터_내보내기");

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  // 담당자 목록 추출 (중복 제거)
  const assignedToOptions = [
    { value: "", label: "모든 담당자" },
    ...Array.from(new Set(works.map((work) => work.assignedTo)))
      .filter(Boolean)
      .map((name) => ({ value: name, label: name })),
  ];

  // 필터링된 작업 목록
  const filteredWorks = works.filter((work) => {
    const matchesStatus = filters.status
      ? work.status === filters.status
      : true;
    const matchesAssignedTo = filters.assignedTo
      ? work.assignedTo === filters.assignedTo
      : true;
    const matchesSearch = filters.search
      ? work.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        work.id?.toLowerCase().includes(filters.search.toLowerCase()) ||
        work.location?.toLowerCase().includes(filters.search.toLowerCase()) ||
        (work.instructionTitle &&
          work.instructionTitle
            .toLowerCase()
            .includes(filters.search.toLowerCase()))
      : true;

    return matchesStatus && matchesAssignedTo && matchesSearch;
  });

  const handleExport = () => {
    if (filteredWorks.length === 0) {
      alert("내보낼 데이터가 없습니다.");
      return;
    }

    try {
      setIsExporting(true);

      // 내보내기에 필요한 필드만 선택
      const exportData = filteredWorks.map((work) => ({
        id: work.id,
        name: work.name,
        description: work.description || "",
        instructionId: work.instructionId,
        instructionTitle: work.instructionTitle || "",
        location: work.location,
        status: work.status,
        completionRate: work.completionRate || 0,
        assignedTo: work.assignedTo || "",
        startDate: work.startDate || "",
        endDate: work.endDate || "",
        workHours: work.workHours || "",
        cost: work.cost || "",
      }));

      // 엑셀 파일로 내보내기
      excelUtils.exportToExcel(exportData, fileName);
    } catch (error) {
      alert("내보내기 중 오류가 발생했습니다: " + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const isLoading = isLoadingWorks || isExporting;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          작업 데이터 내보내기
        </h1>
      </div>

      <Card className="mb-6 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4 text-gray-800">필터 설정</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            id="search"
            name="search"
            placeholder="작업 ID, 작업명, 지시 제목, 위치 검색"
            value={filters.search}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Select
            id="status"
            name="status"
            placeholder="상태 선택"
            value={filters.status}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "모든 상태" },
              { value: "대기중", label: "대기중" },
              { value: "진행중", label: "진행중" },
              { value: "완료", label: "완료" },
              { value: "취소", label: "취소" },
            ]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Select
            id="assignedTo"
            name="assignedTo"
            placeholder="담당자 선택"
            value={filters.assignedTo}
            onChange={handleFilterChange}
            options={assignedToOptions}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>

      <Card className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4 text-gray-800">
            내보내기 설정
          </h2>

          <FormGroup label="파일명" htmlFor="fileName">
            <Input
              id="fileName"
              name="fileName"
              value={fileName}
              onChange={handleFileNameChange}
              placeholder="내보낼 파일명 (확장자 제외)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormGroup>

          <div className="mt-4">
            <p className="text-gray-600">
              현재 필터 설정으로 {filteredWorks.length}개의 작업이
              내보내기됩니다.
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={isLoading || filteredWorks.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "처리 중..." : "엑셀 파일로 내보내기"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default WorkExport;
