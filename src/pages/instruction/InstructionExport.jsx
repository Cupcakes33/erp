import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInstructions } from "../../lib/api/instructionQueries";
import {
  FormButton,
  FormInput,
  FormSelect,
  FormCard,
} from "../../components/molecules";
import { ArrowLeft, FileDown, FileText } from "lucide-react";

const InstructionExport = () => {
  const navigate = useNavigate();
  const { data: instructions = [], isLoading } = useInstructions();

  const [exportFormat, setExportFormat] = useState("json");
  const [filterStatus, setFilterStatus] = useState("");
  const [fileName, setFileName] = useState("instructions_export");

  const handleExport = () => {
    // 필터링된 데이터 준비
    let dataToExport = [...instructions];

    if (filterStatus) {
      dataToExport = dataToExport.filter(
        (item) => item.status === filterStatus
      );
    }

    // 중요 필드만 추출 (필요시)
    dataToExport = dataToExport.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      location: item.location,
      status: item.status,
      priority: item.priority,
      createdAt: item.createdAt,
      dueDate: item.dueDate,
    }));

    // 실제 파일 생성 및 다운로드
    let fileContent = "";
    let fileType = "";

    if (exportFormat === "json") {
      fileContent = JSON.stringify(dataToExport, null, 2);
      fileType = "application/json";
    } else if (exportFormat === "csv") {
      // CSV 헤더
      const headers = [
        "id",
        "title",
        "description",
        "location",
        "status",
        "priority",
        "createdAt",
        "dueDate",
      ];

      // 헤더 행
      fileContent = headers.join(",") + "\n";

      // 데이터 행
      dataToExport.forEach((item) => {
        const row = headers.map((header) => {
          // 쉼표가 포함된 필드는 따옴표로 감싸기
          const value = String(item[header] || "");
          return value.includes(",") ? `"${value}"` : value;
        });
        fileContent += row.join(",") + "\n";
      });

      fileType = "text/csv";
    }

    // 파일 다운로드
    const blob = new Blob([fileContent], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCancel = () => {
    navigate("/instructions");
  };

  return (
    <div className="mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <FormButton
          variant="outline"
          size="sm"
          onClick={handleCancel}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </FormButton>
        <h1 className="text-2xl font-bold">지시 데이터 내보내기</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">내보내기 설정</h2>

          <div className="space-y-4">
            <FormSelect
              id="exportFormat"
              name="exportFormat"
              label="파일 형식"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              options={[
                { value: "json", label: "JSON" },
                { value: "csv", label: "CSV" },
              ]}
            />

            <FormSelect
              id="filterStatus"
              name="filterStatus"
              label="상태 필터"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: "", label: "모든 상태" },
                { value: "대기중", label: "대기중" },
                { value: "진행중", label: "진행중" },
                { value: "완료", label: "완료" },
                { value: "취소", label: "취소" },
              ]}
            />

            <FormInput
              id="fileName"
              name="fileName"
              label="파일명"
              placeholder="파일명을 입력하세요"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />

            <div className="pt-4">
              <FormButton
                onClick={handleExport}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "로딩 중..." : "내보내기"}
              </FormButton>
            </div>
          </div>
        </FormCard>

        <FormCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">내보내기 안내</h2>

          <div className="flex items-start mb-6">
            <FileText className="w-8 h-8 text-blue-500 mr-4 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">내보내기 가능한 데이터</h3>
              <p className="text-gray-600 text-sm">
                현재 시스템에 등록된 지시 데이터를 내보낼 수 있습니다. 상태,
                우선순위 등으로 필터링하여 필요한 데이터만 추출할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="flex items-start mb-6">
            <FileDown className="w-8 h-8 text-blue-500 mr-4 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">파일 형식</h3>
              <p className="text-gray-600 text-sm">
                JSON: 구조화된 데이터 형식으로, 프로그래밍 환경에서 사용하기
                적합합니다.
                <br />
                CSV: 스프레드시트 프로그램(Excel, Google Sheets 등)에서 열 수
                있는 형식입니다.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-sm text-blue-800">
              <strong>참고:</strong> 내보내기를 완료하면 자동으로 다운로드가
              시작됩니다. 브라우저에서 다운로드를 허용해야 합니다.
            </p>
          </div>
        </FormCard>
      </div>
    </div>
  );
};

export default InstructionExport;
