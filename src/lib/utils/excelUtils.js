import * as XLSX from 'xlsx';

/**
 * 엑셀 파일을 파싱하여 JSON 데이터로 변환하는 유틸리티
 */
export const excelUtils = {
  /**
   * 엑셀 파일을 JSON 데이터로 변환
   * @param {File} file - 업로드된 엑셀 파일
   * @returns {Promise<Array>} - 변환된 JSON 데이터
   */
  parseExcelFile: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // 첫 번째 시트 사용
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // 시트 데이터를 JSON으로 변환
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1,
            defval: '',
            blankrows: false
          });
          
          resolve(jsonData);
        } catch (error) {
          reject(new Error('엑셀 파일 파싱 중 오류가 발생했습니다: ' + error.message));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('파일 읽기 중 오류가 발생했습니다.'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  },
  
  /**
   * 헤더 행을 기준으로 데이터를 객체 배열로 변환
   * @param {Array} data - 파싱된 엑셀 데이터
   * @returns {Array} - 헤더를 키로 사용한 객체 배열
   */
  convertToObjectArray: (data) => {
    if (!data || data.length < 2) {
      throw new Error('유효한 데이터가 없습니다. 헤더 행과 최소 1개의 데이터 행이 필요합니다.');
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    return rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        if (header) { // 빈 헤더는 무시
          obj[header] = row[index] !== undefined ? row[index] : '';
        }
      });
      return obj;
    });
  },
  
  /**
   * 지시 데이터 검증
   * @param {Array} data - 변환된 지시 객체 배열
   * @returns {Object} - 검증 결과 (isValid, errors)
   */
  validateInstructionData: (data) => {
    const errors = [];
    const requiredFields = ['title', 'location', 'priority', 'dueDate'];
    
    data.forEach((item, index) => {
      const rowErrors = [];
      
      requiredFields.forEach(field => {
        if (!item[field]) {
          rowErrors.push(`${field} 필드가 비어 있습니다.`);
        }
      });
      
      if (item.priority && !['높음', '중간', '낮음'].includes(item.priority)) {
        rowErrors.push('우선순위는 높음, 중간, 낮음 중 하나여야 합니다.');
      }
      
      if (rowErrors.length > 0) {
        errors.push({
          row: index + 2, // 헤더(1) + 인덱스(0부터 시작) + 1
          errors: rowErrors
        });
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  /**
   * 작업 데이터 검증
   * @param {Array} data - 변환된 작업 객체 배열
   * @returns {Object} - 검증 결과 (isValid, errors)
   */
  validateWorkData: (data) => {
    const errors = [];
    const requiredFields = ['name', 'instructionId', 'location'];
    
    data.forEach((item, index) => {
      const rowErrors = [];
      
      requiredFields.forEach(field => {
        if (!item[field]) {
          rowErrors.push(`${field} 필드가 비어 있습니다.`);
        }
      });
      
      if (item.status && !['대기중', '진행중', '완료', '취소'].includes(item.status)) {
        rowErrors.push('상태는 대기중, 진행중, 완료, 취소 중 하나여야 합니다.');
      }
      
      if (item.completionRate !== undefined && item.completionRate !== '') {
        const rate = Number(item.completionRate);
        if (isNaN(rate) || rate < 0 || rate > 100) {
          rowErrors.push('진행률은 0에서 100 사이의 숫자여야 합니다.');
        }
      }
      
      if (item.startDate && item.endDate) {
        const start = new Date(item.startDate);
        const end = new Date(item.endDate);
        if (start > end) {
          rowErrors.push('종료일은 시작일 이후여야 합니다.');
        }
      }
      
      if (rowErrors.length > 0) {
        errors.push({
          row: index + 2, // 헤더(1) + 인덱스(0부터 시작) + 1
          errors: rowErrors
        });
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  /**
   * JSON 데이터를 엑셀 파일로 변환하여 다운로드
   * @param {Array} data - 변환할 JSON 데이터
   * @param {String} filename - 다운로드할 파일명
   */
  exportToExcel: (data, filename) => {
    // 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // 워크북 생성
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    // 엑셀 파일 생성 및 다운로드
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  },
  
  /**
   * 지시 데이터 템플릿 파일 다운로드
   * @param {String} format 'excel' | 'csv' | 'json'
   */
  downloadInstructionTemplate: (format = 'excel') => {
    // 템플릿 데이터
    const templateData = [
      {
        orderId: 0,
        orderNumber: "INS-2023-0001",
        orderDate: new Date().toISOString().split("T")[0],
        name: "지시 제목 예시",
        manager: "관리자명",
        delegator: "위임자명",
        channel: "전화",
        detailAddress: "서울시 강남구 삼성동 123-45 상세주소",
        structure: "건물명",
        memo: "비고 사항",
        round: 1
      }
    ];
    
    if (format === 'excel') {
      // 워크시트 생성
      const worksheet = XLSX.utils.json_to_sheet(templateData);
      
      // 워크북 생성
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
      
      // 엑셀 파일 생성 및 다운로드
      XLSX.writeFile(workbook, '지시_템플릿.xlsx');
    } else if (format === 'csv') {
      // CSV 헤더
      const headers = Object.keys(templateData[0]);
      let csv = headers.join(',') + '\n';
      
      // 데이터 행
      templateData.forEach(item => {
        const row = headers.map(header => {
          const value = String(item[header] || "");
          return value.includes(',') ? `"${value}"` : value;
        });
        csv += row.join(',') + '\n';
      });
      
      // 파일 다운로드
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '지시_템플릿.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      // JSON 파일 다운로드
      const json = JSON.stringify(templateData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '지시_템플릿.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }
};
