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

// 백업 폰트 - 시스템 폰트 사용
Font.registerHyphenationCallback((word) => [word]);

// 스타일 정의
const styles = StyleSheet.create({
  page: {
    padding: "15mm",
    fontFamily: "NotoSansKR",
    fontSize: 10.5,
    lineHeight: 1.2,
  },
  container: {
    position: "relative",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 3,
    marginBottom: 25,
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
  approvalTable: {
    width: "100%",
    fontSize: 9,
  },
  approvalHeaderRow: {
    flexDirection: "row",
  },
  approvalHeaderCell: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    fontWeight: "bold",
    textAlign: "center",
    padding: 4,
    borderWidth: 1,
    borderColor: "black",
  },
  approvalRow: {
    flexDirection: "row",
    height: 45,
  },
  approvalCell: {
    flex: 1,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "black",
    padding: 4,
  },
  documentInfoSection: {
    marginTop: 10,
  },
  documentInfoRow: {
    flexDirection: "row",
    marginVertical: 2,
  },
  labelCol: {
    width: 40,
    fontWeight: "bold",
  },
  colonCol: {
    width: 20,
    fontWeight: "bold",
  },
  valueCol: {
    flex: 1,
  },
  orderNumberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 5,
  },
  orderNumberLabel: {
    fontWeight: "bold",
    marginRight: 5,
  },
  orderNumberValue: {
    minWidth: 100,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingLeft: 5,
    textAlign: "center",
  },
  orderNumberText: {
    marginLeft: 5,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 6,
  },
  table: {
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "black",
    height: 23,
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "black",
    height: 23,
  },
  tableHeader: {
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "black",
    padding: 3,
  },
  tableCell: {
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "black",
    padding: 3,
  },
  tableCellCenter: {
    textAlign: "center",
  },
  lastCellInRow: {
    borderRightWidth: 0,
  },
  attachmentSection: {
    marginTop: 15,
  },
  attachmentText: {
    fontWeight: "bold",
    margin: "2 0",
  },
  attachmentIndentedText: {
    fontWeight: "bold",
    marginLeft: 45,
    margin: "2 0",
  },
  confirmationDate: {
    textAlign: "right",
    marginTop: 30,
    fontWeight: "bold",
  },
  // 테이블 컬럼 너비
  col15: { width: "15%" },
  col25: { width: "25%" },
  col30: { width: "30%" },
  col40: { width: "40%" },
  col10: { width: "10%" },
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
  orderDate: "2025.02.11",
  id: "3033727",
  title: "시설물 보수확인서 제출",
  receiver: "서울주택도시공사 성북주거안심센터장",
  sender: "주식회사 종합종합안전기술연구원",
  repairItems: [
    {
      code: "3101050",
      category: "건축-수장-단열층",
      facility: "다가구매입임대(강북구) 0121 - 0502",
      repairDate: "2025.02.24",
    },
    {
      code: "3101051",
      category: "건축-수장-도배",
      facility: "다가구매입임대(강북구) 0121 - 0502",
      repairDate: "2025.02.24",
    },
  ],
  quantityItems: [
    {
      title: "우이동 21-16 502호 방 창가 단열불량 보수",
      workName: "실크벽지 도배바탕(합판,석고보드면)-불가포함,초배지미실",
      specification: "벽면",
      unit: "M2",
      quantity: 1,
      marker: "건축No.9",
    },
    {
      title: "",
      workName: "열반사단열재",
      specification: "20mm",
      unit: "M2",
      quantity: 1,
      marker: "노원도봉1신7",
    },
  ],
  printDate: "2025.03.21 09:19",
};

// 안전하게 데이터 접근하는 유틸리티 함수
const safelyAccessData = (data, defaultValue) => {
  return data !== undefined && data !== null ? data : defaultValue;
};

// PDF 생성용 Document 컴포넌트
export const RepairConfirmationDocument = ({ data = {} }) => {
  // 안전하게 데이터 접근하기 위해 처리
  const safeData = {
    orderNumber: safelyAccessData(data.orderNumber, defaultData.orderNumber),
    orderDate: safelyAccessData(data.orderDate, defaultData.orderDate),
    id: safelyAccessData(data.id, defaultData.id),
    title: safelyAccessData(data.title, defaultData.title),
    receiver: safelyAccessData(data.receiver, defaultData.receiver),
    sender: safelyAccessData(data.sender, defaultData.sender),
    repairItems: safelyAccessData(data.repairItems, defaultData.repairItems),
    quantityItems: safelyAccessData(
      data.quantityItems,
      defaultData.quantityItems
    ),
    printDate: safelyAccessData(data.printDate, defaultData.printDate),
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* 제목 */}
          <Text style={styles.title}>보 수 확 인 서</Text>

          {/* 오른쪽 상단 정보 테이블 */}
          <View style={styles.infoTableContainer}>
            <View style={styles.infoTable}>
              {/* PRT-ID 행 */}
              <View style={styles.infoRow}>
                <View style={styles.infoLabelCell}>
                  <Text>PRT-ID :</Text>
                </View>
                <View style={styles.infoValueCell}>
                  <Text>HMFM0B0201R03</Text>
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

            {/* 결재 테이블 */}
            <View style={styles.approvalTable}>
              {/* 결재 헤더 */}
              <View style={styles.approvalHeaderRow}>
                <View style={[styles.approvalHeaderCell, { flex: 3 }]}>
                  <Text>결재</Text>
                </View>
              </View>

              {/* 결재자 역할 */}
              <View style={styles.approvalRow}>
                <View style={styles.approvalCell}>
                  <Text>담당</Text>
                </View>
                <View style={styles.approvalCell}>
                  <Text>감독</Text>
                </View>
                <View style={styles.approvalCell}>
                  <Text>부장</Text>
                </View>
              </View>

              {/* 결재자 서명란 */}
              <View style={styles.approvalRow}>
                <View style={styles.approvalCell}>
                  <Text></Text>
                </View>
                <View style={styles.approvalCell}>
                  <Text></Text>
                </View>
                <View style={styles.approvalCell}>
                  <Text></Text>
                </View>
              </View>
            </View>
          </View>

          {/* 문서 정보 영역 */}
          <View style={styles.documentInfoSection}>
            {/* 수신 */}
            <View style={styles.documentInfoRow}>
              <Text style={styles.labelCol}>수</Text>
              <Text style={styles.colonCol}>신:</Text>
              <Text style={styles.valueCol}>{safeData.receiver}</Text>
            </View>

            {/* 발신 */}
            <View style={styles.documentInfoRow}>
              <Text style={styles.labelCol}>발</Text>
              <Text style={styles.colonCol}>신:</Text>
              <Text style={styles.valueCol}>{safeData.sender}</Text>
            </View>

            {/* 제목 */}
            <View style={styles.documentInfoRow}>
              <Text style={styles.labelCol}>제</Text>
              <Text style={styles.colonCol}>목:</Text>
              <Text style={styles.valueCol}>{safeData.title}</Text>
            </View>

            {/* 보수지시일자 */}
            <View style={styles.documentInfoRow}>
              <Text style={[styles.labelCol, { width: 80 }]}>
                보수지시일자:
              </Text>
              <Text style={styles.valueCol}>{safeData.orderDate}</Text>
            </View>

            {/* 지시 ID */}
            <View style={styles.documentInfoRow}>
              <Text style={[styles.labelCol, { width: 80 }]}>지 시 ID:</Text>
              <Text style={styles.valueCol}>{safeData.id}</Text>
            </View>
          </View>

          {/* 보수작업지시서 제 */}
          <View style={styles.orderNumberRow}>
            <Text style={styles.orderNumberLabel}>보수작업지시서 제</Text>
            <Text style={styles.orderNumberValue}>{safeData.orderNumber}</Text>
            <Text style={styles.orderNumberText}>
              호에 의거 보수공사를 완료하고 아래와 같이 확인서를 제출합니다.
            </Text>
          </View>

          {/* 보수 공종목록 */}
          <Text style={styles.sectionTitle}>* 보수 공종목록</Text>
          <View style={styles.table}>
            {/* 헤더 행 */}
            <View style={styles.tableHeaderRow}>
              <View style={[styles.tableHeader, styles.col15]}>
                <Text>공종번호</Text>
              </View>
              <View style={[styles.tableHeader, styles.col30]}>
                <Text>공종</Text>
              </View>
              <View style={[styles.tableHeader, styles.col40]}>
                <Text>시설물</Text>
              </View>
              <View
                style={[styles.tableHeader, styles.col15, styles.lastCellInRow]}
              >
                <Text>보수처리일</Text>
              </View>
            </View>

            {/* 데이터 행 */}
            {Array.isArray(safeData.repairItems) &&
            safeData.repairItems.length > 0 ? (
              safeData.repairItems.map((item, index) => (
                <View style={styles.tableRow} key={`repair-${index}`}>
                  <View
                    style={[
                      styles.tableCell,
                      styles.tableCellCenter,
                      styles.col15,
                    ]}
                  >
                    <Text>{item?.code || ""}</Text>
                  </View>
                  <View style={[styles.tableCell, styles.col30]}>
                    <Text>{item?.category || ""}</Text>
                  </View>
                  <View style={[styles.tableCell, styles.col40]}>
                    <Text>{item?.facility || ""}</Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.tableCellCenter,
                      styles.col15,
                      styles.lastCellInRow,
                    ]}
                  >
                    <Text>{item?.repairDate || ""}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View
                  style={[
                    styles.tableCell,
                    styles.tableCellCenter,
                    styles.col15,
                  ]}
                >
                  <Text></Text>
                </View>
                <View style={[styles.tableCell, styles.col30]}>
                  <Text></Text>
                </View>
                <View style={[styles.tableCell, styles.col40]}>
                  <Text></Text>
                </View>
                <View
                  style={[
                    styles.tableCell,
                    styles.tableCellCenter,
                    styles.col15,
                    styles.lastCellInRow,
                  ]}
                >
                  <Text></Text>
                </View>
              </View>
            )}
          </View>

          {/* 물량내역 총 목록 */}
          <Text style={styles.sectionTitle}>* 물량내역 및 목록</Text>
          <View style={styles.table}>
            {/* 헤더 행 */}
            <View style={styles.tableHeaderRow}>
              <View style={[styles.tableHeader, styles.col25]}>
                <Text>지시세목</Text>
              </View>
              <View style={[styles.tableHeader, styles.col30]}>
                <Text>단가내역 공종명</Text>
              </View>
              <View style={[styles.tableHeader, styles.col10]}>
                <Text>규격</Text>
              </View>
              <View style={[styles.tableHeader, styles.col10]}>
                <Text>단위</Text>
              </View>
              <View style={[styles.tableHeader, styles.col10]}>
                <Text>수량</Text>
              </View>
              <View
                style={[styles.tableHeader, styles.col15, styles.lastCellInRow]}
              >
                <Text>호표</Text>
              </View>
            </View>

            {/* 데이터 행 */}
            {Array.isArray(safeData.quantityItems) &&
            safeData.quantityItems.length > 0 ? (
              safeData.quantityItems.map((item, index) => (
                <View style={styles.tableRow} key={`quantity-${index}`}>
                  <View style={[styles.tableCell, styles.col25]}>
                    <Text>{item?.title || ""}</Text>
                  </View>
                  <View style={[styles.tableCell, styles.col30]}>
                    <Text>{item?.workName || ""}</Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.tableCellCenter,
                      styles.col10,
                    ]}
                  >
                    <Text>{item?.specification || ""}</Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.tableCellCenter,
                      styles.col10,
                    ]}
                  >
                    <Text>{item?.unit || ""}</Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.tableCellCenter,
                      styles.col10,
                    ]}
                  >
                    <Text>{item?.quantity?.toString() || ""}</Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.tableCellCenter,
                      styles.col15,
                      styles.lastCellInRow,
                    ]}
                  >
                    <Text>{item?.marker || ""}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View style={[styles.tableCell, styles.col25]}>
                  <Text></Text>
                </View>
                <View style={[styles.tableCell, styles.col30]}>
                  <Text></Text>
                </View>
                <View
                  style={[
                    styles.tableCell,
                    styles.tableCellCenter,
                    styles.col10,
                  ]}
                >
                  <Text></Text>
                </View>
                <View
                  style={[
                    styles.tableCell,
                    styles.tableCellCenter,
                    styles.col10,
                  ]}
                >
                  <Text></Text>
                </View>
                <View
                  style={[
                    styles.tableCell,
                    styles.tableCellCenter,
                    styles.col10,
                  ]}
                >
                  <Text></Text>
                </View>
                <View
                  style={[
                    styles.tableCell,
                    styles.tableCellCenter,
                    styles.col15,
                    styles.lastCellInRow,
                  ]}
                >
                  <Text></Text>
                </View>
              </View>
            )}
          </View>

          {/* 첨부 */}
          <View style={styles.attachmentSection}>
            <Text style={styles.attachmentText}>
              첨 부 : 1. 물량산출내역 1부.
            </Text>
            <Text style={styles.attachmentIndentedText}>
              2. 보수 전, 중, 후 사진 각 1부. 끝.
            </Text>
          </View>

          {/* 확인일자 */}
          <Text style={styles.confirmationDate}>확 인 일 자</Text>
          <Text style={[styles.confirmationDate, { marginTop: 5 }]}>
            확 인 자
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// 메인 컴포넌트
const RepairConfirmationPDF = ({ data, onClose }) => {
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
        <RepairConfirmationDocument data={data || defaultData} />
      ).toBlob();

      saveAs(blob, "보수확인서.pdf");
    } catch (error) {
      console.error("PDF 생성 중 오류 발생:", error);
      alert("PDF 생성 중 오류가 발생했습니다.");
    }
  };

  // 미리보기용 문서
  const PreviewDocument = (
    <RepairConfirmationDocument data={data || defaultData} />
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
          <h2 className="text-xl font-bold">보수확인서 미리보기</h2>
          <div className="flex space-x-2">
            <button
              onClick={generatePDF}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 download-pdf-btn"
              id="confirmation-pdf-download"
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
            <div className="flex flex-col items-center justify-center p-6 border border-red-200 rounded-lg bg-red-50">
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

export default RepairConfirmationPDF;
