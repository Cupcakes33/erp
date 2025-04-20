import React, { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Font,
  PDFViewer,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";

// 웹 폰트 사용 - 맑은 고딕과 가장 비슷한 Noto Sans KR 사용
Font.register({
  family: "NotoSansKR",
  src: "https://fonts.gstatic.com/s/notosanskr/v36/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzuoyeLTq8H4hfeE.ttf", // Noto Sans KR Regular
  fontWeight: "normal",
});

// 폰트가 제대로 로드되지 않을 경우를 대비한 백업 처리
Font.registerHyphenationCallback((word) => [word]);

// 스타일 정의
const styles = StyleSheet.create({
  landscapePage: {
    padding: "15mm",
    fontFamily: "NotoSansKR",
    fontSize: 10,
    lineHeight: 1.2,
  },
  container: {
    position: "relative",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 25,
  },
  spacer: {
    width: "15%",
    display: "inline-block",
  },
  infoTableContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 175,
  },
  infoTable: {
    width: "100%",
    fontSize: 9,
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "black",
  },
  infoLabelCell: {
    width: "35%",
    padding: 4,
    backgroundColor: "#f7f7f7",
    fontWeight: "bold",
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "black",
  },
  infoValueCell: {
    width: "65%",
    padding: 4,
    paddingLeft: 8,
  },
  headerRow: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 5,
  },
  headerLabel: {
    width: 80,
    fontWeight: "bold",
  },
  headerValue: {
    flex: 1,
  },
  table: {
    width: "100%",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "black",
    height: 25, // 기본 행 높이
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "black",
    height: 30,
    backgroundColor: "#f7f7f7",
  },
  tableHeader: {
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "black",
    padding: 2,
    fontSize: 9,
  },
  tableCell: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "black",
    padding: 2,
  },
  tableCellLeft: {
    justifyContent: "center",
    alignItems: "flex-start",
    textAlign: "left",
    borderRightWidth: 1,
    borderRightColor: "black",
    padding: 2,
  },
  tableCellRight: {
    justifyContent: "center",
    alignItems: "flex-end",
    textAlign: "right",
    borderRightWidth: 1,
    borderRightColor: "black",
    padding: 2,
    paddingRight: 5,
  },
  lastCellInRow: {
    borderRightWidth: 0,
  },
  summaryRow: {
    flexDirection: "row",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "black",
    height: 25,
    backgroundColor: "#f7f7f7",
  },
  // PDF 뷰어 스타일
  pdfViewer: {
    width: "100%",
    height: "73vh",
    border: "none",
  },
  // 에러 메시지
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ffe6e6",
    border: "1px solid #ff9999",
    borderRadius: 5,
    margin: 20,
  },
});

// 기본 데이터
const defaultData = {
  orderNumber: "경북2025-단가-0194",
  orderName: "우이동 21-16 502호 방 창가 단열불량 보수",
  items: [
    {
      code: "건축-수장-단열층(3101050)",
      name: "열반사단열재",
      spec: "20mm",
      unit: "M2",
      unitPrice: 1,
      quantity: 1,
      materialCost: 11806,
      materialAmount: 11806,
      laborCost: 11456,
      laborAmount: 11456,
      expenseCost: 0,
      expenseAmount: 0,
      totalAmount: 23262,
      note: "노원도봉1신7",
    },
    {
      code: "건축-수장-도배(3101051)",
      name: "실크벽지 도배바름(합판.석고보드면)-철거포함,초배지미시공",
      spec: "벽면",
      unit: "M2",
      unitPrice: 1,
      quantity: 1,
      materialCost: 2666,
      materialAmount: 2666,
      laborCost: 8563,
      laborAmount: 8563,
      expenseCost: 0,
      expenseAmount: 0,
      totalAmount: 11229,
      note: "건축No.9",
    },
  ],
  summary: {
    materialAmount: 14472,
    laborAmount: 20019,
    expenseAmount: 0,
    totalAmount: 34491,
  },
  printDate: "2025.03.21 09:19",
};

// 통화 포맷팅 함수
const formatCurrency = (amount) => {
  if (amount === 0 || amount === null || amount === undefined) return "0";
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 안전하게 데이터 접근하는 유틸리티 함수
const safelyAccessData = (data, defaultValue) => {
  return data !== undefined && data !== null ? data : defaultValue;
};

// PDF 생성용 Document 컴포넌트
export const DetailStatementDocument = ({ data = {} }) => {
  // 안전하게 데이터 접근하기 위해 처리
  const safeData = {
    orderNumber: safelyAccessData(data.orderNumber, defaultData.orderNumber),
    orderName: safelyAccessData(data.orderName, defaultData.orderName),
    items: safelyAccessData(data.items, defaultData.items),
    summary: safelyAccessData(data.summary, defaultData.summary),
    printDate: safelyAccessData(data.printDate, defaultData.printDate),
  };

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.landscapePage}>
        <View style={styles.container}>
          {/* 제목 */}
          <Text style={styles.title}>내 역 서</Text>

          {/* 오른쪽 상단 정보 테이블 */}
          <View style={styles.infoTableContainer}>
            <View style={styles.infoTable}>
              {/* PRT-ID 행 */}
              <View style={styles.infoRow}>
                <View style={styles.infoLabelCell}>
                  <Text>PRT-ID :</Text>
                </View>
                <View style={styles.infoValueCell}>
                  <Text>HMFM0B0201R05</Text>
                </View>
              </View>

              {/* 페이지 행 */}
              <View style={styles.infoRow}>
                <View style={styles.infoLabelCell}>
                  <Text>페이지</Text>
                </View>
                <View style={styles.infoValueCell}>
                  <Text>1/1</Text>
                </View>
              </View>

              {/* 출력일자 행 */}
              <View style={styles.infoRow}>
                <View style={styles.infoLabelCell}>
                  <Text>출력일자</Text>
                </View>
                <View style={styles.infoValueCell}>
                  <Text>{safeData.printDate}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 지시번호와 지시명 */}
          <View style={{ marginTop: 40 }}>
            <View style={styles.headerRow}>
              <Text style={{ width: 80, fontWeight: "bold" }}>
                ■ 지시번호 :
              </Text>
              <Text>{safeData.orderNumber}</Text>
            </View>

            <View style={styles.headerRow}>
              <Text style={{ width: 80, fontWeight: "bold" }}>
                ■ 지 시 명 :
              </Text>
              <Text>{safeData.orderName}</Text>
            </View>
          </View>

          {/* 내역 테이블 */}
          <View style={styles.table}>
            {/* 헤더 행 */}
            <View style={styles.tableHeaderRow}>
              <View style={[styles.tableHeader, { width: "15%" }]}>
                <Text>공종명</Text>
                <Text>(공종ID)</Text>
              </View>
              <View style={[styles.tableHeader, { width: "12%" }]}>
                <Text>시 설 물</Text>
              </View>
              <View style={[styles.tableHeader, { width: "12%" }]}>
                <Text>작 업 명</Text>
              </View>
              <View style={[styles.tableHeader, { width: "8%" }]}>
                <Text>규 격</Text>
              </View>
              <View style={[styles.tableHeader, { width: "5%" }]}>
                <Text>단 위</Text>
              </View>
              <View style={[styles.tableHeader, { width: "5%" }]}>
                <Text>수 량</Text>
              </View>
              <View
                style={[
                  styles.tableHeader,
                  { width: "13%", flexDirection: "column" },
                ]}
              >
                <Text
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "black",
                    paddingBottom: 2,
                  }}
                >
                  재 료 비
                </Text>
                <View style={{ flexDirection: "row", flex: 1 }}>
                  <View
                    style={{
                      width: "50%",
                      borderRightWidth: 1,
                      borderRightColor: "black",
                      justifyContent: "center",
                    }}
                  >
                    <Text>단가</Text>
                  </View>
                  <View style={{ width: "50%" }}>
                    <Text>금액</Text>
                  </View>
                </View>
              </View>
              <View
                style={[
                  styles.tableHeader,
                  { width: "13%", flexDirection: "column" },
                ]}
              >
                <Text
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "black",
                    paddingBottom: 2,
                  }}
                >
                  노 무 비
                </Text>
                <View style={{ flexDirection: "row", flex: 1 }}>
                  <View
                    style={{
                      width: "50%",
                      borderRightWidth: 1,
                      borderRightColor: "black",
                      justifyContent: "center",
                    }}
                  >
                    <Text>단가</Text>
                  </View>
                  <View style={{ width: "50%" }}>
                    <Text>금액</Text>
                  </View>
                </View>
              </View>
              <View
                style={[
                  styles.tableHeader,
                  { width: "13%", flexDirection: "column" },
                ]}
              >
                <Text
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "black",
                    paddingBottom: 2,
                  }}
                >
                  경 비
                </Text>
                <View style={{ flexDirection: "row", flex: 1 }}>
                  <View
                    style={{
                      width: "50%",
                      borderRightWidth: 1,
                      borderRightColor: "black",
                      justifyContent: "center",
                    }}
                  >
                    <Text>단가</Text>
                  </View>
                  <View style={{ width: "50%" }}>
                    <Text>금액</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.tableHeader, { width: "13%" }]}>
                <Text>합계</Text>
                <Text>단가 금액</Text>
              </View>
              <View
                style={[
                  styles.tableHeader,
                  { width: "4%" },
                  styles.lastCellInRow,
                ]}
              >
                <Text>비고</Text>
              </View>
            </View>

            {/* 데이터 행 */}
            {Array.isArray(safeData.items) && safeData.items.length > 0 ? (
              safeData.items.map((item, index) => (
                <View style={styles.tableRow} key={`item-${index}`}>
                  <View style={[styles.tableCellLeft, { width: "15%" }]}>
                    <Text>{item?.code || ""}</Text>
                  </View>
                  <View style={[styles.tableCellLeft, { width: "12%" }]}>
                    <Text>다가구매입임대(강북구) 0121 - 0502</Text>
                  </View>
                  <View style={[styles.tableCellLeft, { width: "12%" }]}>
                    <Text>{item?.name || ""}</Text>
                  </View>
                  <View style={[styles.tableCell, { width: "8%" }]}>
                    <Text>{item?.spec || ""}</Text>
                  </View>
                  <View style={[styles.tableCell, { width: "5%" }]}>
                    <Text>{item?.unit || ""}</Text>
                  </View>
                  <View style={[styles.tableCell, { width: "5%" }]}>
                    <Text>{item?.quantity || ""}</Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      { width: "13%", flexDirection: "row", padding: 0 },
                    ]}
                  >
                    <View
                      style={{
                        width: "50%",
                        borderRightWidth: 1,
                        borderRightColor: "black",
                        justifyContent: "center",
                      }}
                    >
                      <Text>{formatCurrency(item?.materialCost || 0)}</Text>
                    </View>
                    <View style={{ width: "50%", justifyContent: "center" }}>
                      <Text>{formatCurrency(item?.materialAmount || 0)}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      { width: "13%", flexDirection: "row", padding: 0 },
                    ]}
                  >
                    <View
                      style={{
                        width: "50%",
                        borderRightWidth: 1,
                        borderRightColor: "black",
                        justifyContent: "center",
                      }}
                    >
                      <Text>{formatCurrency(item?.laborCost || 0)}</Text>
                    </View>
                    <View style={{ width: "50%", justifyContent: "center" }}>
                      <Text>{formatCurrency(item?.laborAmount || 0)}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      { width: "13%", flexDirection: "row", padding: 0 },
                    ]}
                  >
                    <View
                      style={{
                        width: "50%",
                        borderRightWidth: 1,
                        borderRightColor: "black",
                        justifyContent: "center",
                      }}
                    >
                      <Text>{formatCurrency(item?.expenseCost || 0)}</Text>
                    </View>
                    <View style={{ width: "50%", justifyContent: "center" }}>
                      <Text>{formatCurrency(item?.expenseAmount || 0)}</Text>
                    </View>
                  </View>
                  <View style={[styles.tableCellRight, { width: "13%" }]}>
                    <Text>{formatCurrency(item?.totalAmount || 0)}</Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      { width: "4%" },
                      styles.lastCellInRow,
                    ]}
                  >
                    <Text>{item?.note || ""}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View style={[styles.tableCell, { width: "100%" }]}>
                  <Text>데이터가 없습니다</Text>
                </View>
              </View>
            )}

            {/* 합계 행 */}
            <View style={styles.summaryRow}>
              <View
                style={[
                  styles.tableCell,
                  { width: "55%", fontWeight: "bold", textAlign: "center" },
                ]}
              >
                <Text>[ 합 계 ]</Text>
              </View>
              <View
                style={[
                  styles.tableCell,
                  { width: "13%", flexDirection: "row", padding: 0 },
                ]}
              >
                <View
                  style={{
                    width: "50%",
                    borderRightWidth: 1,
                    borderRightColor: "black",
                  }}
                >
                  <Text></Text>
                </View>
                <View style={{ width: "50%", justifyContent: "center" }}>
                  <Text>
                    {formatCurrency(safeData.summary?.materialAmount || 0)}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.tableCell,
                  { width: "13%", flexDirection: "row", padding: 0 },
                ]}
              >
                <View
                  style={{
                    width: "50%",
                    borderRightWidth: 1,
                    borderRightColor: "black",
                  }}
                >
                  <Text></Text>
                </View>
                <View style={{ width: "50%", justifyContent: "center" }}>
                  <Text>
                    {formatCurrency(safeData.summary?.laborAmount || 0)}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.tableCell,
                  { width: "13%", flexDirection: "row", padding: 0 },
                ]}
              >
                <View
                  style={{
                    width: "50%",
                    borderRightWidth: 1,
                    borderRightColor: "black",
                  }}
                >
                  <Text></Text>
                </View>
                <View style={{ width: "50%", justifyContent: "center" }}>
                  <Text>
                    {formatCurrency(safeData.summary?.expenseAmount || 0)}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.tableCellRight,
                  { width: "13%", fontWeight: "bold" },
                ]}
              >
                <Text>
                  {formatCurrency(safeData.summary?.totalAmount || 0)}
                </Text>
              </View>
              <View
                style={[
                  styles.tableCell,
                  { width: "4%" },
                  styles.lastCellInRow,
                ]}
              >
                <Text></Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// 메인 컴포넌트
const DetailStatementPDF = ({ data, onClose }) => {
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 클라이언트 사이드에서만 실행되도록 설정
  useEffect(() => {
    setIsClient(true);
  }, []);

  // PDF 생성 및 다운로드 함수
  const generatePDF = async () => {
    try {
      const blob = await pdf(
        <DetailStatementDocument data={data || defaultData} />
      ).toBlob();

      saveAs(blob, "내역서.pdf");
    } catch (error) {
      console.error("PDF 생성 중 오류 발생:", error);
      alert("PDF 생성 중 오류가 발생했습니다.");
    }
  };

  // 미리보기용 문서
  const PreviewDocument = (
    <DetailStatementDocument data={data || defaultData} />
  );

  // 폰트 로딩 에러 핸들링
  const handleError = (error) => {
    console.error("PDF 렌더링 중 오류 발생:", error);
    setHasError(true);
    setErrorMessage(error.message || "폰트 로딩에 실패했습니다");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">내역서 미리보기</h2>
          <div className="flex space-x-2">
            <button
              onClick={generatePDF}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 download-pdf-btn"
              id="detail-pdf-download"
            >
              PDF 다운로드
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              닫기
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          {hasError ? (
            <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg">
              <div className="mb-4 text-xl font-bold text-red-700">
                PDF 미리보기 오류
              </div>
              <p className="mb-4 text-center text-red-600">{errorMessage}</p>
              <p className="text-gray-700">
                PDF 다운로드를 클릭하여 파일을 생성해보세요.
              </p>
            </div>
          ) : isClient ? (
            <PDFViewer style={styles.pdfViewer} onError={handleError}>
              {PreviewDocument}
            </PDFViewer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-600">PDF 미리보기를 로딩 중입니다...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailStatementPDF;
