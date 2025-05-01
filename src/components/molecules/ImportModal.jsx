import React, { useState } from "react";
import {
  FormButton,
  FormCard,
  FormInput,
  showSuccess,
  showError,
} from "../../components/molecules";
import { X, Upload, FileUp } from "lucide-react";

/**
 * 파일 업로드 및 데이터 일괄 등록을 위한 모달 컴포넌트
 */
const ImportModal = ({
  isOpen,
  onClose,
  onImport,
  importResult,
  isImporting,
  validateData = (data) => ({ isValid: true, validData: data, errors: [] }),
}) => {
  const [importFile, setImportFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImportFile(file);
    }
  };

  const handleImportSubmit = async () => {
    if (importFile) {
      try {
        // 파일 데이터를 부모 컴포넌트로 전달하여 처리
        onImport(importFile);
      } catch (error) {
        console.error("파일 가져오기 오류:", error);
        showError("파일 처리 중 오류가 발생했습니다: " + error.message);
      }
    }
  };

  const handleClose = () => {
    setImportFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center text-xl font-semibold">
            <FileUp className="w-5 h-5 mr-2 text-blue-600" />
            지시 데이터 일괄등록
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="mb-2 text-sm text-gray-600">
            지시 데이터가 포함된 Excel, CSV 또는 JSON 파일을 선택하세요.
          </p>

          {!importResult && (
            <div className="p-8 text-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".xlsx,.xls,.csv,.json"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  파일을 끌어다 놓거나 클릭하여 업로드
                </p>
              </label>
            </div>
          )}

          {importFile && !importResult && (
            <div className="flex items-center p-2 mt-2 rounded bg-blue-50">
              <div className="flex items-center justify-center w-8 h-8 mr-2 bg-blue-100 rounded-full">
                <FileUp className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-900 truncate">
                  {importFile.name}
                </p>
                <p className="text-xs text-blue-500">
                  {Math.round(importFile.size / 1024)} KB
                </p>
              </div>
              <button
                onClick={() => setImportFile(null)}
                className="text-blue-700 hover:text-blue-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {importResult && (
            <div className="mt-4">
              <div className="flex mb-4 space-x-4">
                <div className="flex-1 p-2 text-center bg-gray-100 rounded">
                  <div className="text-lg font-semibold">
                    {importResult.total}
                  </div>
                  <div className="text-xs text-gray-500">총 항목</div>
                </div>
                <div className="flex-1 p-2 text-center bg-green-100 rounded">
                  <div className="text-lg font-semibold text-green-700">
                    {importResult.success}
                  </div>
                  <div className="text-xs text-green-700">성공</div>
                </div>
                <div className="flex-1 p-2 text-center bg-red-100 rounded">
                  <div className="text-lg font-semibold text-red-700">
                    {importResult.error}
                  </div>
                  <div className="text-xs text-red-700">실패</div>
                </div>
              </div>

              {/* 진행 상황 표시 */}
              {importResult.isProcessing && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-700">
                      처리 중... {importResult.processingIndex}/
                      {importResult.total} 항목
                    </div>
                    <div className="text-sm text-gray-500">
                      {Math.round(
                        (importResult.processingIndex / importResult.total) *
                          100
                      )}
                      %
                    </div>
                  </div>
                  <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${
                          (importResult.processingIndex / importResult.total) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {importResult.errors.length > 0 && (
                <div className="mt-4 overflow-hidden border rounded">
                  <div className="p-2 font-medium bg-gray-100">오류 내역</div>
                  <div className="p-2 overflow-y-auto max-h-48">
                    {importResult.errors.map((error, index) => (
                      <div key={index} className="mb-1 text-sm text-red-600">
                        행 {error.row}:{" "}
                        {error.message || "처리 중 오류가 발생했습니다."}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm text-blue-800">
                  {importResult.isProcessing
                    ? "데이터 처리 중입니다. 완료될 때까지 기다려주세요."
                    : "파일 업로드를 다시 시도하려면 아래의 다시 시도 버튼을 클릭하세요."}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <FormButton variant="outline" onClick={handleClose}>
            {importResult ? "닫기" : "취소"}
          </FormButton>
          {!importResult && (
            <FormButton
              variant="primary"
              onClick={handleImportSubmit}
              disabled={!importFile || isImporting}
              loading={isImporting}
            >
              {isImporting ? "가져오는 중..." : "가져오기"}
            </FormButton>
          )}
          {importResult && (
            <FormButton
              variant="primary"
              onClick={() => {
                setImportFile(null);
                onClose();
              }}
              disabled={importResult.isProcessing}
            >
              {importResult.isProcessing ? "처리 중..." : "다시 시도"}
            </FormButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
