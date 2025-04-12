import React, { useState } from 'react';
import { useWorkQueries } from '../../lib/api/workQueries';
import { excelUtils } from '../../lib/utils/excelUtils';
import Card from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';
import Modal from '../../components/molecules/Modal';
import Table from '../../components/molecules/Table';

const WorkImport = () => {
  const { useCreateWork } = useWorkQueries();
  const createWorkMutation = useCreateWork();
  
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [validationResult, setValidationResult] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // 파일 확장자 검사
    const fileExt = selectedFile.name.split('.').pop().toLowerCase();
    if (fileExt !== 'xlsx' && fileExt !== 'xls') {
      alert('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.');
      e.target.value = null;
      return;
    }
    
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setPreviewData([]);
    setHeaders([]);
    setValidationResult(null);
    setImportSuccess(false);
    
    try {
      setIsLoading(true);
      
      // 엑셀 파일 파싱
      const parsedData = await excelUtils.parseExcelFile(selectedFile);
      
      if (parsedData.length < 2) {
        throw new Error('유효한 데이터가 없습니다. 헤더 행과 최소 1개의 데이터 행이 필요합니다.');
      }
      
      // 헤더 추출
      const headerRow = parsedData[0];
      setHeaders(headerRow);
      
      // 미리보기 데이터 설정 (최대 5행)
      const previewRows = parsedData.slice(1, 6);
      setPreviewData(previewRows);
      
      // 전체 데이터를 객체 배열로 변환
      const objectData = excelUtils.convertToObjectArray(parsedData);
      
      // 데이터 검증
      const validation = excelUtils.validateWorkData(objectData);
      setValidationResult(validation);
      
      if (!validation.isValid) {
        setShowErrorModal(true);
      }
      
    } catch (error) {
      alert('파일 처리 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImport = async () => {
    if (!file || !validationResult || !validationResult.isValid) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 엑셀 파일 파싱
      const parsedData = await excelUtils.parseExcelFile(file);
      
      // 객체 배열로 변환
      const objectData = excelUtils.convertToObjectArray(parsedData);
      
      // 각 작업 데이터를 API를 통해 생성
      let successCount = 0;
      
      for (const workData of objectData) {
        try {
          await createWorkMutation.mutateAsync(workData);
          successCount++;
        } catch (error) {
          console.error('작업 생성 실패:', error);
        }
      }
      
      setImportSuccess(true);
      setImportedCount(successCount);
      
    } catch (error) {
      alert('가져오기 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderPreviewTable = () => {
    if (!headers.length || !previewData.length) {
      return null;
    }
    
    const columns = headers.map((header, index) => ({
      title: header,
      dataIndex: String(index)
    }));
    
    const tableData = previewData.map((row, rowIndex) => {
      const rowData = {};
      row.forEach((cell, cellIndex) => {
        rowData[String(cellIndex)] = cell;
      });
      return rowData;
    });
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2 text-gray-800">데이터 미리보기 (최대 5행)</h3>
        <Table
          columns={columns}
          data={tableData}
          emptyMessage="미리보기 데이터가 없습니다."
          className="min-w-full divide-y divide-gray-200"
        />
        <p className="text-sm text-gray-500 mt-2">
          전체 {previewData.length}개 행 중 {Math.min(previewData.length, 5)}개 행을 표시합니다.
        </p>
      </div>
    );
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">작업 데이터 가져오기</h1>
      </div>
      
      <Card className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4 text-gray-800">엑셀 파일 업로드</h2>
          <p className="text-gray-600 mb-4">
            작업 데이터가 포함된 엑셀 파일(.xlsx, .xls)을 업로드하세요. 
            첫 번째 행은 헤더로 사용됩니다.
          </p>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <span className="text-sm font-medium text-gray-700">파일 선택</span>
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </label>
            {fileName && (
              <span className="text-sm text-gray-600">{fileName}</span>
            )}
          </div>
        </div>
        
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {renderPreviewTable()}
        
        {validationResult && (
          <div className="mt-6">
            <div className={`p-4 rounded-md ${validationResult.isValid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {validationResult.isValid ? (
                <p>데이터 검증 성공! 가져오기를 진행할 수 있습니다.</p>
              ) : (
                <p>데이터 검증 중 오류가 발견되었습니다. 자세한 내용은 오류 목록을 확인하세요.</p>
              )}
            </div>
          </div>
        )}
        
        {importSuccess && (
          <div className="mt-6 p-4 rounded-md bg-green-100 text-green-700">
            <p>가져오기 완료! {importedCount}개의 작업이 성공적으로 생성되었습니다.</p>
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <Button
            variant="primary"
            onClick={handleImport}
            disabled={isLoading || !file || !validationResult || !validationResult.isValid}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '처리 중...' : '가져오기'}
          </Button>
        </div>
      </Card>
      
      {/* 오류 모달 */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="데이터 검증 오류"
        footer={
          <Button 
            variant="primary" 
            onClick={() => setShowErrorModal(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            확인
          </Button>
        }
      >
        <div className="max-h-96 overflow-y-auto">
          <p className="mb-4 text-gray-800">다음 오류를 수정한 후 다시 시도하세요:</p>
          <ul className="list-disc pl-5 space-y-2">
            {validationResult?.errors.map((error, index) => (
              <li key={index} className="text-gray-800">
                <strong>{error.row}행:</strong>
                <ul className="list-disc pl-5 mt-1">
                  {error.errors.map((err, i) => (
                    <li key={i} className="text-red-600">{err}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default WorkImport;
