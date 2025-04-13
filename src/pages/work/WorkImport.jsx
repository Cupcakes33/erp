import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { FormButton, FormCard, FormInput } from "../../components/molecules";
import { createWork } from "../../lib/api/workAPI";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../lib/api/workQueries";
import { AlertCircle, CheckCircle, Upload } from "lucide-react";

const WorkImport = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [importing, setImporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
    setPreview(null);

    if (!selectedFile) return;

    // 파일 확장자 체크
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls"].includes(fileExtension)) {
      setError("Excel 파일(.xlsx, .xls)만 가능합니다.");
      return;
    }

    // Excel 파일 처리
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        processFileData(jsonData);
      } catch (error) {
        setError(`파일 처리 오류: ${error.message}`);
      }
    };

    reader.onerror = () => {
      setError("파일을 읽는 중 오류가 발생했습니다.");
    };

    reader.readAsBinaryString(selectedFile);
  };

  // 파일 데이터 처리 함수
  const processFileData = (jsonData) => {
    if (jsonData.length === 0) {
      setError("데이터가 없습니다.");
      return;
    }

    // 필수 컬럼 체크
    const requiredColumns = [
      "name",
      "location",
      "description",
      "assignedTo",
      "startDate",
      "instructionId",
    ];

    const firstRow = jsonData[0];
    const missingColumns = requiredColumns.filter((col) => !(col in firstRow));

    if (missingColumns.length > 0) {
      setError(`필수 컬럼이 누락되었습니다: ${missingColumns.join(", ")}`);
      return;
    }

    setPreview(jsonData.slice(0, 5)); // 처음 5개 행만 미리보기로 표시
  };

  const handleImport = async () => {
    if (!file) {
      setError("가져올 파일을 선택해주세요.");
      return;
    }

    setImporting(true);
    setError(null);
    setProgress({ current: 0, total: 0 });

    try {
      // Excel 파일 처리
      const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsBinaryString(file);
      });

      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setProgress({ current: 0, total: jsonData.length });

      // 작업을 일괄 처리
      const workPromises = jsonData.map((row, index) => {
        const work = {
          id: `WO-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: row.name,
          location: row.location,
          description: row.description,
          assignedTo: row.assignedTo,
          startDate: row.startDate,
          dueDate: row.dueDate || null,
          status: row.status || "대기중",
          completionRate: parseInt(row.completionRate) || 0,
          instructionId: row.instructionId,
          createdAt: new Date().toISOString().slice(0, 10),
        };

        // 각 작업 생성 후 진행상황 업데이트
        return createWork(work).then(() => {
          setProgress((prev) => ({ ...prev, current: index + 1 }));
          return work;
        });
      });

      // 모든 작업을 병렬로 처리
      await Promise.all(workPromises);

      // 작업 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKS] });

      setSuccess(true);
      setTimeout(() => {
        navigate("/works");
      }, 1500);
    } catch (error) {
      setError(`작업 가져오기 오류: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleTemplateDownload = () => {
    // 템플릿 데이터 생성
    const templateData = [
      {
        name: "작업명 예시",
        location: "위치 예시",
        description: "작업 설명 예시",
        assignedTo: "홍길동",
        startDate: "2023-12-01",
        dueDate: "2023-12-31",
        status: "대기중",
        completionRate: "0",
        instructionId: "INST-001",
      },
    ];

    // Excel 워크시트 생성
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "작업목록");

    // 파일 다운로드
    XLSX.writeFile(wb, "작업_가져오기_템플릿.xlsx");
  };

  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">작업 일괄 가져오기</h1>
        <FormButton variant="outline" onClick={() => navigate("/works")}>
          목록으로 돌아가기
        </FormButton>
      </div>

      <FormCard className="p-6 mb-6">
        <div className="mb-4">
          <h2 className="mb-2 text-lg font-medium">엑셀 파일 업로드</h2>
          <p className="mb-4 text-sm text-gray-500">
            Excel 파일을 통해 작업을 일괄 등록할 수 있습니다. 필수 항목은 name,
            location, description, assignedTo, startDate, instructionId 입니다.
          </p>

          <div className="mb-6">
            <FormInput
              type="file"
              id="excelFile"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {error && (
            <div className="flex items-start p-3 mb-6 text-red-700 border border-red-200 rounded-md bg-red-50">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-start p-3 mb-6 text-green-700 border border-green-200 rounded-md bg-green-50">
              <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                작업이 성공적으로 가져와졌습니다. 곧 작업 목록 페이지로
                이동합니다.
              </p>
            </div>
          )}

          {importing && progress.total > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 font-medium text-md">가져오기 진행 상황</h3>
              <div className="w-full h-2 mb-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full"
                  style={{
                    width: `${(progress.current / progress.total) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {progress.current} / {progress.total} 완료
              </p>
            </div>
          )}

          {preview && (
            <div className="mb-6">
              <h3 className="mb-2 font-medium text-md">미리보기 (최대 5개)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(preview[0]).map((key) => (
                        <th
                          key={key}
                          className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, i) => (
                          <td key={i} className="px-3 py-2 whitespace-nowrap">
                            {value || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <FormButton
              onClick={handleImport}
              disabled={!file || importing || success}
              className="flex items-center"
            >
              {importing ? (
                <>
                  <span className="mr-2 animate-spin">⏳</span>
                  가져오는 중...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  작업 가져오기
                </>
              )}
            </FormButton>
            <FormButton
              variant="outline"
              onClick={handleTemplateDownload}
              className="flex items-center"
            >
              <Upload className="w-4 h-4 mr-2" />
              엑셀 템플릿 다운로드
            </FormButton>
          </div>
        </div>
      </FormCard>

      <FormCard className="p-6">
        <h2 className="mb-4 text-lg font-medium">파일 형식 안내</h2>
        <p className="mb-4 text-sm text-gray-600">
          다음 형식에 맞춰 Excel 파일을 준비해주세요. 엑셀 템플릿을 다운로드하여
          시작할 수 있습니다.
        </p>

        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
          <div>
            <h3 className="mb-2 font-medium text-md">필수 필드</h3>
            <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
              <li>name: 작업 이름</li>
              <li>location: 작업 위치</li>
              <li>description: 작업 설명</li>
              <li>assignedTo: 담당자 이름</li>
              <li>startDate: 시작일 (YYYY-MM-DD)</li>
              <li>instructionId: 연관 지시 ID</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-medium text-md">선택 필드</h3>
            <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
              <li>dueDate: 마감일 (YYYY-MM-DD)</li>
              <li>status: 상태 (대기중, 진행중, 완료, 취소)</li>
              <li>completionRate: 진행률 (0-100 사이의 숫자)</li>
            </ul>
          </div>
        </div>
      </FormCard>
    </div>
  );
};

export default WorkImport;
