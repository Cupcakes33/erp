import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateInstruction } from "../../lib/api/instructionQueries";
import {
  FormButton,
  FormInput,
  FormCard,
  FormTextArea,
} from "../../components/molecules";
import { ArrowLeft, Upload, FileType, FileText } from "lucide-react";

const InstructionImport = () => {
  const navigate = useNavigate();
  const createInstructionMutation = useCreateInstruction();

  const [file, setFile] = useState(null);
  const [importedData, setImportedData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [importStatus, setImportStatus] = useState({
    success: 0,
    error: 0,
    total: 0,
  });
  const [importLog, setImportLog] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // 파일 읽기
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          // CSV 또는 JSON 파싱 (실제로는 더 복잡한 파싱 로직이 필요할 수 있음)
          const content = event.target.result;
          let data = [];

          if (selectedFile.name.endsWith(".json")) {
            data = JSON.parse(content);
          } else if (selectedFile.name.endsWith(".csv")) {
            // 간단한 CSV 파싱 (실제로는 더 강력한 CSV 파서 사용 권장)
            const lines = content.split("\n");
            const headers = lines[0].split(",").map((h) => h.trim());

            for (let i = 1; i < lines.length; i++) {
              if (lines[i].trim() === "") continue;

              const values = lines[i].split(",").map((v) => v.trim());
              const obj = {};

              headers.forEach((header, index) => {
                obj[header] = values[index];
              });

              data.push(obj);
            }
          }

          setImportedData(data);
        } catch (error) {
          console.error("파일 파싱 오류:", error);
          setImportLog((prev) => prev + `\n파일 파싱 오류: ${error.message}`);
        }
      };

      if (selectedFile.name.endsWith(".json")) {
        reader.readAsText(selectedFile);
      } else if (selectedFile.name.endsWith(".csv")) {
        reader.readAsText(selectedFile);
      } else {
        setImportLog(
          "지원되지 않는 파일 형식입니다. JSON 또는 CSV 파일을 업로드해주세요."
        );
      }
    }
  };

  const handleImport = async () => {
    if (!importedData.length) {
      setImportLog("가져올 데이터가 없습니다.");
      return;
    }

    setIsUploading(true);
    setImportLog("가져오기 시작...\n");
    setImportStatus({
      success: 0,
      error: 0,
      total: importedData.length,
    });

    for (const item of importedData) {
      try {
        // 필수 필드 확인
        if (!item.title || !item.location) {
          throw new Error("필수 필드 누락 (제목, 위치)");
        }

        // 데이터 형식 변환
        const instructionData = {
          title: item.title,
          description: item.description || "",
          location: item.location,
          priority: item.priority || "중간",
          status: item.status || "대기중",
          dueDate: item.dueDate || new Date().toISOString().split("T")[0],
          createdAt: new Date().toISOString().split("T")[0],
          id: `INS-${new Date().getFullYear()}-${String(
            Math.floor(Math.random() * 10000)
          ).padStart(4, "0")}`,
        };

        // 지시 생성 API 호출
        await createInstructionMutation.mutateAsync(instructionData);

        setImportStatus((prev) => ({
          ...prev,
          success: prev.success + 1,
        }));
        setImportLog((prev) => prev + `\n✅ 성공: ${item.title}`);
      } catch (error) {
        console.error("지시 가져오기 실패:", error, item);
        setImportStatus((prev) => ({
          ...prev,
          error: prev.error + 1,
        }));
        setImportLog(
          (prev) => prev + `\n❌ 실패: ${item.title} - ${error.message}`
        );
      }
    }

    setIsUploading(false);
    setImportLog((prev) => prev + "\n가져오기 완료!");
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
        <h1 className="text-2xl font-bold">지시 데이터 가져오기</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">파일 업로드</h2>
          <p className="text-gray-600 mb-4">
            JSON 또는 CSV 형식의 파일을 업로드하여 지시 데이터를 가져옵니다.
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 text-center">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 mb-4">
              파일을 끌어다 놓거나 클릭하여 업로드하세요
            </p>
            <FormInput
              type="file"
              accept=".json,.csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <FormButton
                as="span"
                variant="outline"
                className="cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                파일 선택
              </FormButton>
            </label>
            {file && (
              <div className="mt-4 text-left flex items-center p-2 bg-gray-50 rounded">
                <FileType className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-sm truncate">{file.name}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({Math.round(file.size / 1024)} KB)
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div>
              {importedData.length > 0 && (
                <p className="text-sm text-gray-600">
                  {importedData.length}개의 항목이 로드되었습니다
                </p>
              )}
            </div>
            <FormButton
              onClick={handleImport}
              disabled={!importedData.length || isUploading}
            >
              {isUploading ? "가져오는 중..." : "가져오기"}
            </FormButton>
          </div>
        </FormCard>

        <FormCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">가져오기 로그</h2>
          {importStatus.total > 0 && (
            <div className="flex space-x-4 mb-4">
              <div className="flex-1 bg-gray-100 p-2 rounded text-center">
                <div className="text-lg font-semibold">
                  {importStatus.total}
                </div>
                <div className="text-xs text-gray-500">총 항목</div>
              </div>
              <div className="flex-1 bg-green-100 p-2 rounded text-center">
                <div className="text-lg font-semibold text-green-700">
                  {importStatus.success}
                </div>
                <div className="text-xs text-green-700">성공</div>
              </div>
              <div className="flex-1 bg-red-100 p-2 rounded text-center">
                <div className="text-lg font-semibold text-red-700">
                  {importStatus.error}
                </div>
                <div className="text-xs text-red-700">실패</div>
              </div>
            </div>
          )}

          <FormTextArea
            value={importLog}
            readOnly
            rows={12}
            className="font-mono text-sm"
            placeholder="가져오기 로그가 여기에 표시됩니다..."
          />
        </FormCard>
      </div>
    </div>
  );
};

export default InstructionImport;
