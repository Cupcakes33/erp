import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  pdf,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";

// 한글 폰트 등록 (나눔고딕 Regular/Bold TTF 파일 사용)
Font.register({
  family: "NanumGothic",
  fonts: [
    {
      src: "https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

// 스타일 정의 (페이지, 텍스트, 표, 셀 등)
const styles = StyleSheet.create({
  // 페이지 기본 스타일: A4용지 크기, 여백, 기본 폰트 적용
  page: {
    padding: 20, // 페이지 여백 (모든 방향 20pt)
    fontFamily: "NanumGothic",
    fontSize: 10, // 기본 폰트 크기 10pt (원본 양식 기준)
    lineHeight: 1.2, // 줄 간격 조절 (필요 시 조정)
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10, // 제목 아래 여백
  },
  headerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10, // 정보 영역 아래 여백
  },
  infoGroup: {
    // 각 정보 그룹 (왼쪽/오른쪽) 스타일
  },
  infoText: {
    fontSize: 10,
  },
  // 표 스타일
  tableHeader: {
    flexDirection: "row",
    fontWeight: "bold",
    backgroundColor: "#eeeeee", // 헤더 행 배경 (연회색)
  },
  tableRow: {
    flexDirection: "row",
  },
  // 셀 기본 스타일: 아래쪽과 왼쪽 테두리 (오른쪽 테두리는 마지막 열에서 처리)
  cell: {
    borderStyle: "solid",
    borderColor: "#000",
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    padding: 2, // 셀 내 여백 (상하좌우 2pt)
  },
  // 첫 열 및 마지막 열 셀 추가 스타일
  firstCol: {
    // 첫 열은 왼쪽 테두리가 이미 cell에 있으므로 그대로 사용
  },
  lastCol: {
    borderRightWidth: 1, // 마지막 열에 오른쪽 테두리 추가
  },
  // 각 열의 너비 지정 (pt 단위)
  colCode: { width: 30 }, // 코드
  colName: { width: 90 }, // 공정 또는 공종명/항목명
  colSpec: { width: 50 }, // 규격
  colUnit: { width: 30 }, // 단위
  colQty: { width: 30 }, // 수량
  colCalc: { width: 60 }, // 산출내역
  colUnitPriceId: { width: 40 }, // 단가코드/ID
  colMaterial: { width: 55 }, // 재료비 (원가/도급)
  colLabor: { width: 55 }, // 노무비 (원가/도급)
  colExpense: { width: 55 }, // 경비 (원가/도급)
  colTotal: { width: 55 }, // 합계 (원가/도급)
  // 텍스트 정렬 스타일
  textCenter: { textAlign: "center" },
  textRight: { textAlign: "right" },
  textLeft: { textAlign: "left" },
  // 합계 부분 스타일
  summarySection: {
    marginTop: 20,
    fontSize: 10,
  },
  summaryLine: {
    marginBottom: 3, // 합계 항목 줄 간격
  },
  signatureSection: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  signatureLabel: {
    fontSize: 10,
    marginRight: 10,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderColor: "#000",
    width: 150, // 서명선 길이
  },
});

// PDF 문서 컴포넌트 정의
const BosuConfirmationDocument = ({ data }) => {
  const { orderNumber, orderDate, name, structure, processes } = data;

  // 통화 형식(숫자 콤마) 포맷터
  const formatNumber = (num) => num.toLocaleString("en-US");

  // 표 항목 데이터 구성 (프로세스별로 그룹화된 tasks를 하나의 배열로 펼치면서 구분 헤더 추가)
  let tableRows = [];
  processes.forEach((proc) => {
    // 프로세스 구분 행 추가
    tableRows.push({
      isProcess: true,
      processName: proc.processName,
      endDate: proc.endDate,
    });
    // 해당 프로세스의 작업 항목들 추가
    proc.tasks.forEach((task) => {
      tableRows.push(task);
    });
  });

  // 한 페이지에 최대 표시 가능한 행 수 (헤더 제외). 필요시 원본 양식에 맞게 조정
  const MAX_ROWS_PER_PAGE = 15;
  // 페이지별 배열 초기화
  let page1Rows = [],
    page2Rows = [];

  // 페이지1 채우기
  for (let i = 0; i < MAX_ROWS_PER_PAGE && i < tableRows.length; i++) {
    // 남은 공간이 1행밖에 없고 그 자리에 새로운 프로세스 헤더만 들어가는 상황이면, 해당 헤더를 다음 페이지로 넘김
    if (
      MAX_ROWS_PER_PAGE - i === 1 && // 현재 페이지에 남은 행이 1개
      tableRows[i].isProcess === true && // 그 1개 행이 프로세스 구분 행
      i < tableRows.length - 1 // 뒤에 출력할 항목이 더 존재
    ) {
      // 빈 행을 넣고 현재 페이지를 마감
      page1Rows.push({ blank: true });
      // page1Rows가 다 찼으므로 나머지 행은 다음 페이지로 처리
      break;
    }
    page1Rows.push(tableRows[i]);
  }
  // 페이지2 채우기 (나머지 행)
  const remainingRows = tableRows.slice(page1Rows.length);
  for (let j = 0; j < MAX_ROWS_PER_PAGE && j < remainingRows.length; j++) {
    page2Rows.push(remainingRows[j]);
  }

  // 페이지1/2에 실제 데이터 행 수보다 부족한 경우 빈 행으로 채워 표의 총 행수를 맞춤 (원본 양식의 틀 유지)
  if (page1Rows.length < MAX_ROWS_PER_PAGE) {
    const blanksNeeded = MAX_ROWS_PER_PAGE - page1Rows.length;
    for (let k = 0; k < blanksNeeded; k++) {
      page1Rows.push({ blank: true });
    }
  }
  if (page2Rows.length < MAX_ROWS_PER_PAGE) {
    const blanksNeeded = MAX_ROWS_PER_PAGE - page2Rows.length;
    for (let k = 0; k < blanksNeeded; k++) {
      page2Rows.push({ blank: true });
    }
  }

  // 총합계 계산 (모든 프로세스의 모든 task 대상)
  let sumMaterialCost = 0,
    sumMaterialPrice = 0;
  let sumLaborCost = 0,
    sumLaborPrice = 0;
  let sumExpense = 0,
    sumExpensePrice = 0;
  let sumTotalCost = 0,
    sumTotalPrice = 0;
  processes.forEach((proc) => {
    proc.tasks.forEach((task) => {
      sumMaterialCost += task.materialCost || 0;
      sumMaterialPrice += task.materialPrice || 0;
      sumLaborCost += task.laborCost || 0;
      sumLaborPrice += task.laborPrice || 0;
      sumExpense += task.expense || 0;
      sumExpensePrice += task.expensePrice || 0;
      sumTotalCost += task.totalCost || 0;
      sumTotalPrice += task.totalPrice || 0;
    });
  });

  return (
    <Document>
      {/* 페이지 1 */}
      <Page size="A4" style={styles.page}>
        {/* 문서 제목 */}
        <Text style={styles.title}>보수확인서 (관리사무소용)</Text>
        {/* 기본 정보 영역 */}
        <View style={styles.headerInfo}>
          <View style={styles.infoGroup}>
            <Text style={styles.infoText}>공사명: {name}</Text>
            <Text style={styles.infoText}>구조: {structure}</Text>
          </View>
          <View style={styles.infoGroup}>
            <Text style={styles.infoText}>발주번호: {orderNumber}</Text>
            <Text style={styles.infoText}>발주일자: {orderDate}</Text>
          </View>
        </View>
        {/* 표 머리글 */}
        <View style={[styles.tableHeader, styles.tableRow]}>
          <View
            style={[
              styles.cell,
              styles.firstCol,
              styles.colCode,
              styles.lastCol,
            ]}
          >
            <Text style={styles.textCenter}>코드</Text>
          </View>
          <View style={[styles.cell, styles.colName]}>
            <Text style={styles.textCenter}>공종명/내역</Text>
          </View>
          <View style={[styles.cell, styles.colSpec]}>
            <Text style={styles.textCenter}>규격</Text>
          </View>
          <View style={[styles.cell, styles.colUnit]}>
            <Text style={styles.textCenter}>단위</Text>
          </View>
          <View style={[styles.cell, styles.colQty]}>
            <Text style={styles.textCenter}>수량</Text>
          </View>
          <View style={[styles.cell, styles.colCalc]}>
            <Text style={styles.textCenter}>산출내역</Text>
          </View>
          <View style={[styles.cell, styles.colUnitPriceId]}>
            <Text style={styles.textCenter}>단가코드</Text>
          </View>
          <View style={[styles.cell, styles.colMaterial]}>
            <Text style={styles.textCenter}>재료비{"\n"}(원가/도급)</Text>
          </View>
          <View style={[styles.cell, styles.colLabor]}>
            <Text style={styles.textCenter}>노무비{"\n"}(원가/도급)</Text>
          </View>
          <View style={[styles.cell, styles.colExpense]}>
            <Text style={styles.textCenter}>경비{"\n"}(원가/도급)</Text>
          </View>
          <View style={[styles.cell, styles.colTotal, styles.lastCol]}>
            <Text style={styles.textCenter}>합계{"\n"}(원가/도급)</Text>
          </View>
        </View>
        {/* 표 내용 행들 */}
        {page1Rows.map((row, index) => {
          // 프로세스 구분 행
          if (row.isProcess) {
            return (
              <View key={`proc-${index}`} style={styles.tableRow}>
                <View
                  style={[
                    styles.cell,
                    styles.firstCol,
                    styles.colCode,
                    styles.lastCol, // 프로세스명은 첫 셀 하나에만 표시하고 나머지 셀은 공백
                    { width: 550, fontWeight: "bold" }, // 셀을 전체 너비로 확장 (너비 합: 550pt)
                  ]}
                >
                  <Text style={styles.textLeft}>
                    {row.processName} (완료일: {row.endDate})
                  </Text>
                </View>
              </View>
            );
          }
          // 빈 행
          if (row.blank) {
            return (
              <View key={`blank-${index}`} style={styles.tableRow}>
                <View style={[styles.cell, styles.firstCol, styles.colCode]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colName]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colSpec]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colUnit]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colQty]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colCalc]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colUnitPriceId]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colMaterial]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colLabor]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colExpense]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colTotal, styles.lastCol]}>
                  <Text> </Text>
                </View>
              </View>
            );
          }
          // 일반 작업 행
          const task = row;
          return (
            <View key={`task1-${index}`} style={styles.tableRow}>
              <View style={[styles.cell, styles.firstCol, styles.colCode]}>
                <Text style={styles.textCenter}>{task.code}</Text>
              </View>
              <View style={[styles.cell, styles.colName]}>
                <Text style={styles.textLeft}>{task.name}</Text>
              </View>
              <View style={[styles.cell, styles.colSpec]}>
                <Text style={styles.textLeft}>{task.spec}</Text>
              </View>
              <View style={[styles.cell, styles.colUnit]}>
                <Text style={styles.textCenter}>{task.unit}</Text>
              </View>
              <View style={[styles.cell, styles.colQty]}>
                <Text style={styles.textRight}>{task.unitCount}</Text>
              </View>
              <View style={[styles.cell, styles.colCalc]}>
                <Text style={styles.textLeft}>{task.calculationDetails}</Text>
              </View>
              <View style={[styles.cell, styles.colUnitPriceId]}>
                <Text style={styles.textCenter}>{task.unitPriceId}</Text>
              </View>
              <View style={[styles.cell, styles.colMaterial]}>
                <Text style={styles.textRight}>
                  {formatNumber(task.materialCost)} /{" "}
                  {formatNumber(task.materialPrice)}
                </Text>
              </View>
              <View style={[styles.cell, styles.colLabor]}>
                <Text style={styles.textRight}>
                  {formatNumber(task.laborCost)} /{" "}
                  {formatNumber(task.laborPrice)}
                </Text>
              </View>
              <View style={[styles.cell, styles.colExpense]}>
                <Text style={styles.textRight}>
                  {formatNumber(task.expense)} /{" "}
                  {formatNumber(task.expensePrice)}
                </Text>
              </View>
              <View style={[styles.cell, styles.colTotal, styles.lastCol]}>
                <Text style={styles.textRight}>
                  {formatNumber(task.totalCost)} /{" "}
                  {formatNumber(task.totalPrice)}
                </Text>
              </View>
            </View>
          );
        })}
      </Page>

      {/* 페이지 2 */}
      <Page size="A4" style={styles.page}>
        {/* 표 헤더 반복 */}
        <View style={[styles.tableHeader, styles.tableRow]}>
          <View
            style={[
              styles.cell,
              styles.firstCol,
              styles.colCode,
              styles.lastCol,
            ]}
          >
            <Text style={styles.textCenter}>코드</Text>
          </View>
          <View style={[styles.cell, styles.colName]}>
            <Text style={styles.textCenter}>공종명/내역</Text>
          </View>
          <View style={[styles.cell, styles.colSpec]}>
            <Text style={styles.textCenter}>규격</Text>
          </View>
          <View style={[styles.cell, styles.colUnit]}>
            <Text style={styles.textCenter}>단위</Text>
          </View>
          <View style={[styles.cell, styles.colQty]}>
            <Text style={styles.textCenter}>수량</Text>
          </View>
          <View style={[styles.cell, styles.colCalc]}>
            <Text style={styles.textCenter}>산출내역</Text>
          </View>
          <View style={[styles.cell, styles.colUnitPriceId]}>
            <Text style={styles.textCenter}>단가코드</Text>
          </View>
          <View style={[styles.cell, styles.colMaterial]}>
            <Text style={styles.textCenter}>재료비{"\n"}(원가/도급)</Text>
          </View>
          <View style={[styles.cell, styles.colLabor]}>
            <Text style={styles.textCenter}>노무비{"\n"}(원가/도급)</Text>
          </View>
          <View style={[styles.cell, styles.colExpense]}>
            <Text style={styles.textCenter}>경비{"\n"}(원가/도급)</Text>
          </View>
          <View style={[styles.cell, styles.colTotal, styles.lastCol]}>
            <Text style={styles.textCenter}>합계{"\n"}(원가/도급)</Text>
          </View>
        </View>
        {/* 표 내용 행들 (2페이지) */}
        {page2Rows.map((row, index) => {
          if (row.isProcess) {
            // 2페이지에서의 프로세스 구분 행 (이전에 일부 항목이 이미 1페이지에 출력된 경우, 일반적으로 이어지는 페이지에는 프로세스명을 다시 표시하지 않을 수도 있음)
            return (
              <View key={`proc2-${index}`} style={styles.tableRow}>
                <View
                  style={[
                    styles.cell,
                    styles.firstCol,
                    styles.colCode,
                    styles.lastCol,
                    { width: 550, fontWeight: "bold" },
                  ]}
                >
                  <Text style={styles.textLeft}>
                    {row.processName} (완료일: {row.endDate})
                  </Text>
                </View>
              </View>
            );
          }
          if (row.blank) {
            return (
              <View key={`blank2-${index}`} style={styles.tableRow}>
                <View style={[styles.cell, styles.firstCol, styles.colCode]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colName]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colSpec]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colUnit]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colQty]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colCalc]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colUnitPriceId]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colMaterial]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colLabor]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colExpense]}>
                  <Text> </Text>
                </View>
                <View style={[styles.cell, styles.colTotal, styles.lastCol]}>
                  <Text> </Text>
                </View>
              </View>
            );
          }
          const task = row;
          return (
            <View key={`task2-${index}`} style={styles.tableRow}>
              <View style={[styles.cell, styles.firstCol, styles.colCode]}>
                <Text style={styles.textCenter}>{task.code}</Text>
              </View>
              <View style={[styles.cell, styles.colName]}>
                <Text style={styles.textLeft}>{task.name}</Text>
              </View>
              <View style={[styles.cell, styles.colSpec]}>
                <Text style={styles.textLeft}>{task.spec}</Text>
              </View>
              <View style={[styles.cell, styles.colUnit]}>
                <Text style={styles.textCenter}>{task.unit}</Text>
              </View>
              <View style={[styles.cell, styles.colQty]}>
                <Text style={styles.textRight}>{task.unitCount}</Text>
              </View>
              <View style={[styles.cell, styles.colCalc]}>
                <Text style={styles.textLeft}>{task.calculationDetails}</Text>
              </View>
              <View style={[styles.cell, styles.colUnitPriceId]}>
                <Text style={styles.textCenter}>{task.unitPriceId}</Text>
              </View>
              <View style={[styles.cell, styles.colMaterial]}>
                <Text style={styles.textRight}>
                  {formatNumber(task.materialCost)} /{" "}
                  {formatNumber(task.materialPrice)}
                </Text>
              </View>
              <View style={[styles.cell, styles.colLabor]}>
                <Text style={styles.textRight}>
                  {formatNumber(task.laborCost)} /{" "}
                  {formatNumber(task.laborPrice)}
                </Text>
              </View>
              <View style={[styles.cell, styles.colExpense]}>
                <Text style={styles.textRight}>
                  {formatNumber(task.expense)} /{" "}
                  {formatNumber(task.expensePrice)}
                </Text>
              </View>
              <View style={[styles.cell, styles.colTotal, styles.lastCol]}>
                <Text style={styles.textRight}>
                  {formatNumber(task.totalCost)} /{" "}
                  {formatNumber(task.totalPrice)}
                </Text>
              </View>
            </View>
          );
        })}
      </Page>

      {/* 페이지 3 */}
      <Page size="A4" style={styles.page}>
        {/* 총합계 요약 섹션 */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryLine}>※ 공사비용 합계 (원가/도급):</Text>
          <Text style={styles.summaryLine}>
            - 재료비 합계: {formatNumber(sumMaterialCost)} /{" "}
            {formatNumber(sumMaterialPrice)} 원
          </Text>
          <Text style={styles.summaryLine}>
            - 노무비 합계: {formatNumber(sumLaborCost)} /{" "}
            {formatNumber(sumLaborPrice)} 원
          </Text>
          <Text style={styles.summaryLine}>
            - 경비 합계: {formatNumber(sumExpense)} /{" "}
            {formatNumber(sumExpensePrice)} 원
          </Text>
          <Text style={styles.summaryLine}>
            ◆ 총합계: {formatNumber(sumTotalCost)} /{" "}
            {formatNumber(sumTotalPrice)} 원
          </Text>
        </View>
        {/* 확인 서명란 섹션 */}
        <View style={styles.signatureSection}>
          <Text style={styles.signatureLabel}>관리사무소장 (서명):</Text>
          <View style={styles.signatureLine}></View>
        </View>
      </Page>
    </Document>
  );
};

// PDF 생성 및 다운로드 함수
export const generateBosuConfirmationPDF = async (data, filename) => {
  const blob = await pdf(<BosuConfirmationDocument data={data} />).toBlob();

  saveAs(blob, filename || "보수확인서.pdf");

  return blob;
};

export default BosuConfirmationDocument;
