import { excelUtils } from "../../lib/utils/excelUtils";

/**
 * 파일 업로드 및 처리 서비스
 * 엑셀, CSV, JSON 파일을 파싱하고 데이터를 가공하는 유틸리티
 */
export class FileImportService {
  /**
   * 파일을 파싱하여 데이터 배열로 변환
   * @param {File} file - 업로드된 파일
   * @returns {Promise<Array>} - 파일에서 추출한 데이터 배열
   */
  static async parseFile(file) {
    if (!file) {
      throw new Error("파일이 없습니다.");
    }

    const fileExtension = file.name.split(".").pop().toLowerCase();
    let data = [];

    try {
      if (fileExtension === "xlsx" || fileExtension === "xls") {
        // 엑셀 파일 처리
        const excelData = await excelUtils.parseExcelFile(file);
        data = excelUtils.convertToObjectArray(excelData);
      } else if (fileExtension === "csv") {
        // CSV 파일 처리
        const content = await this.readFileAsText(file);

        // 간단한 CSV 파싱
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
      } else if (fileExtension === "json") {
        // JSON 파일 처리
        const content = await this.readFileAsText(file);
        data = JSON.parse(content);
      } else {
        throw new Error("지원하지 않는 파일 형식입니다. Excel, CSV, JSON 파일만 가능합니다.");
      }

      return data;
    } catch (error) {
      console.error("파일 파싱 오류:", error);
      throw new Error(`파일 파싱 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  /**
   * 파일을 텍스트로 읽는 유틸리티 함수
   * @param {File} file - 읽을 파일
   * @returns {Promise<string>} - 파일 내용
   */
  static readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error("파일 읽기 오류"));
      reader.readAsText(file);
    });
  }

  /**
   * 데이터 유효성 검증
   * @param {Array} data - 검증할 데이터 배열
   * @param {Array} requiredFields - 필수 필드 배열
   * @returns {Object} - 검증 결과 {isValid, validData, errors}
   */
  static validateData(data, requiredFields = ["name"]) {
    const validationErrors = [];
    const validData = [];

    // 각 행의 데이터 검증
    data.forEach((item, index) => {
      const missingFields = [];

      requiredFields.forEach(field => {
        // null, undefined, 빈 문자열 확인
        if (item[field] === undefined || item[field] === null || item[field] === '') {
          missingFields.push(field);
        }
      });

      if (missingFields.length > 0) {
        validationErrors.push({
          row: index + 1,
          message: `다음 필드가 누락되었습니다: ${missingFields.join(', ')}`,
          item
        });
      } else {
        validData.push(item);
      }
    });

    return {
      isValid: validationErrors.length === 0,
      validData,
      errors: validationErrors,
    };
  }

  /**
   * 지시 데이터 형식 변환
   * @param {Object} item - 변환할 원본 데이터
   * @returns {Object} - API 호출에 적합한 형식으로 변환된 데이터
   */
  static formatInstructionData(item) {
    return {
      orderId: item.orderId !== undefined ? item.orderId : 0,
      orderNumber: item.orderNumber || "",
      name: item.name || "",
      orderDate: item.orderDate || new Date().toISOString().split("T")[0],
      manager: item.manager || "",
      delegator: item.delegator || "",
      channel: item.channel || "전화",
      district: item.district || "",
      dong: item.dong || "",
      lotNumber: item.lotNumber || "",
      detailAddress: item.detailAddress || "",
      structure: item.structure || "",
      memo: item.memo || "",
      status: "접수",
      round: item.round !== undefined ? parseInt(item.round, 10) : 1,
    };
  }
} 