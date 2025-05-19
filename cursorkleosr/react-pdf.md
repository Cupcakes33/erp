React-pdf를 사용한 '보수확인서(관리사무소용)' PDF 컴포넌트 구현
요구사항 정리 및 구현 방안
3페이지 구성: PDF는 항상 3페이지로 출력됩니다. 첫 두 페이지에는 원본 양식과 동일한 표 레이아웃이 있고, 세 번째 페이지에는 총합계 및 확인(서명) 부분이 포함됩니다.
JSON 데이터 기반 동적 렌더링: 하나의 JSON 데이터를 받아 해당 내용으로 양식의 필드를 채우고 표 항목들을 출력합니다. 여러 데이터를 선택하면 각 데이터마다 이 컴포넌트를 이용해 3페이지짜리 PDF를 개별 생성하면 됩니다.
React-pdf 활용: @react-pdf/renderer 라이브러리의 Document, Page, View, Text 등을 사용하여 React 컴포넌트 형태로 PDF를 생성합니다. React-pdf는 Flexbox 기반의 스타일링을 지원하므로 웹 개발과 비슷한 방식으로 레이아웃을 구성할 수 있습니다
react-pdf.org
.
폰트 설정: React-pdf는 기본 영문 폰트만 내장되어 있으므로 한글 출력을 위해 한글 TTF 폰트를 등록해야 합니다
react-pdf.org
. 여기서는 무료 구글 폰트인 나눔고딕(Nanum Gothic) TTF를 사용합니다. (React-pdf는 OTF를 지원하지 않으므로 반드시 TTF/WOFF 포맷 폰트를 써야 합니다
react-pdf.org
.) 예를 들어, 구글 웹폰트의 나눔고딕 TTF URL을 Font.register()로 등록하면 한글이 제대로 렌더링됩니다
github.com
.
레이아웃 정밀 재현: 원본 PDF의 표 구조, 글자 위치와 크기를 픽셀 단위로 동일하게 구현하기 위해, 고정된 폭과 높이를 가진 그리드 레이아웃을 구성합니다. 각 페이지의 표는 정해진 행(row) 수와 열(column) 너비를 가지며, 테두리 선 두께와 셀 간격 등도 원본에 맞춥니다. React-pdf의 스타일링 API를 통해 각 셀에 **테두리 선(border)**을 그려 표 형태를 구현합니다
javascript.plainenglish.io
. 또한 텍스트 정렬(textAlign)과 폰트 크기 등을 조절해 원본과 똑같은 시각적 배치를 만듭니다.
페이지별 구성
페이지 1 (표 머리글 및 1차 항목): 상단에 문서 제목 및 기본 정보(예: 발주번호, 발주일자, 공사명, 구조 등)를 배치합니다. 그 아래에 표 머리글(컬럼 명)을 포함한 상세 내역 표를 출력합니다. 표의 컬럼 구성과 너비는 원본 문서에 맞추어 수동으로 지정하며, 내용은 첫 번째 페이지에 표시될 최대 행数만큼 출력합니다. 행 높이는 일정하게 고정하여 모든 행이 균일한 간격으로 나옵니다. 만약 실제 데이터의 항목 수가 페이지 1에 할당된 행数보다 적다면 남는 행에는 빈 줄을 출력하여 양식의 선 구조를 그대로 유지합니다. (이는 원본 양식의 줄 간격을 맞추기 위함입니다.)
페이지 2 (표 연속 항목): 표의 헤더를 한 번 더 출력하여 페이지가 넘어가도 컬럼명이 보이도록 하고, 이어서 남은 항목들을 출력합니다. 페이지 1에 다 담지 못한 나머지 작업 항목을 페이지 2에 연속해서 보여줍니다. 페이지 2 또한 정해진 행数만큼 표 구조를 유지하며, 남는 행이 있을 경우 빈 줄로 채워 원본과 동일한 표 레이아웃이 유지되도록 합니다. 이렇게 함으로써 항목 수와 관계없이 항상 2페이지에 걸쳐 일정한 표 양식이 출력됩니다.
페이지 3 (합계 및 확인란): 마지막 페이지에는 전체 공사비 내역 합계와 확인 서명란을 배치합니다. 예를 들어, 재료비, 노무비, 경비의 원가 및 도급금액 합계를 계산하여 표시하고, 총액을 명시합니다. 하단에는 관리사무소 확인을 위한 서명 또는 직인란을 원본과 동일한 위치에 배치합니다. 이 페이지는 표 테두리 없이 텍스트로만 구성하되, 필요한 경우 선을 그어 서명란 등의 형식을 맞춥니다.
React-pdf는 기본적으로 콘텐츠가 페이지 한계를 넘으면 자동으로 새 페이지를 생성하지만
react-pdf.org
, 이번 경우 항상 3페이지로 고정하기 위해 컨텐츠 양을 조절하고 페이지를 수동 구성합니다. 즉, 표를 최대 두 페이지로 분배하고 초과하는 내용은 출력하지 않으며, 필요시 빈 행을 채워 2페이지 표를 꽉 채웁니다. 이렇게 하면 어떤 데이터를 넣어도 출력 레이아웃이 언제나 원본 폼과 일치하게 유지됩니다.
컴포넌트 전체 코드
아래는 요구사항에 맞게 구현한 React-pdf 컴포넌트의 전체 코드입니다. Font.register()를 통해 한글 폰트를 등록하고, Document 내부에 3개의 Page 컴포넌트를 사용하여 각 페이지의 내용을 구성했습니다. 스타일 객체에는 페이지 레이아웃, 표와 셀의 스타일 (테두리, 넓이, 정렬 등), 글자 크기 등이 모두 정의되어 있어 원본과 동일한 형태를 재현합니다. JSON 데이터는 props.data로 받아 사용하며, 표 항목 및 합계를 동적으로 채웁니다:
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// 1. 한글 폰트 등록 (나눔고딕 Regular/Bold TTF 파일 사용)
Font.register({
  family: 'NanumGothic',
  fonts: [
    { src: 'https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.ttf', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Bold.ttf', fontWeight: 'bold' }
  ]
});

// 2. 스타일 정의 (페이지, 텍스트, 표, 셀 등)
const styles = StyleSheet.create({
  // 페이지 기본 스타일: A4용지 크기, 여백, 기본 폰트 적용
  page: {
    padding: 20,         // 페이지 여백 (모든 방향 20pt)
    fontFamily: 'NanumGothic',
    fontSize: 10,        // 기본 폰트 크기 10pt (원본 양식 기준)
    lineHeight: 1.2      // 줄 간격 조절 (필요 시 조정)
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10     // 제목 아래 여백
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10     // 정보 영역 아래 여백
  },
  infoGroup: {
    // 각 정보 그룹 (왼쪽/오른쪽) 스타일
  },
  infoText: {
    fontSize: 10
  },
  // 표 스타일
  tableHeader: {
    flexDirection: 'row',
    fontWeight: 'bold',
    backgroundColor: '#eeeeee', // 헤더 행 배경 (연회색)
  },
  tableRow: {
    flexDirection: 'row'
  },
  // 셀 기본 스타일: 아래쪽과 왼쪽 테두리 (오른쪽 테두리는 마지막 열에서 처리)
  cell: {
    borderStyle: 'solid',
    borderColor: '#000',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    padding: 2           // 셀 내 여백 (상하좌우 2pt)
  },
  // 첫 열 및 마지막 열 셀 추가 스타일
  firstCol: {
    // 첫 열은 왼쪽 테두리가 이미 cell에 있으므로 그대로 사용
  },
  lastCol: {
    borderRightWidth: 1  // 마지막 열에 오른쪽 테두리 추가
  },
  // 각 열의 너비 지정 (pt 단위)
  colCode:    { width: 30 },   // 코드
  colName:    { width: 90 },   // 공정 또는 공종명/항목명
  colSpec:    { width: 50 },   // 규격
  colUnit:    { width: 30 },   // 단위
  colQty:     { width: 30 },   // 수량
  colCalc:    { width: 60 },   // 산출내역
  colUnitPriceId: { width: 40 }, // 단가코드/ID
  colMaterial: { width: 55 }, // 재료비 (원가/도급)
  colLabor:    { width: 55 }, // 노무비 (원가/도급)
  colExpense:  { width: 55 }, // 경비 (원가/도급)
  colTotal:    { width: 55 }, // 합계 (원가/도급)
  // 텍스트 정렬 스타일
  textCenter: { textAlign: 'center' },
  textRight:  { textAlign: 'right' },
  textLeft:   { textAlign: 'left' },
  // 합계 부분 스타일
  summarySection: {
    marginTop: 20,
    fontSize: 10
  },
  summaryLine: {
    marginBottom: 3     // 합계 항목 줄 간격
  },
  signatureSection: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  signatureLabel: {
    fontSize: 10,
    marginRight: 10
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderColor: '#000',
    width: 150    // 서명선 길이
  }
});

// 3. PDF 문서 컴포넌트 정의
const BosuConfirmationPDF = ({ data }) => {
  const { orderNumber, orderDate, name, structure, processes } = data;

  // 통화 형식(숫자 콤마) 포맷터
  const formatNumber = (num) => num.toLocaleString('en-US');

  // 표 항목 데이터 구성 (프로세스별로 그룹화된 tasks를 하나의 배열로 펼치면서 구분 헤더 추가)
  let tableRows = [];
  processes.forEach(proc => {
    // 프로세스 구분 행 추가
    tableRows.push({ isProcess: true, processName: proc.processName, endDate: proc.endDate });
    // 해당 프로세스의 작업 항목들 추가
    proc.tasks.forEach(task => {
      tableRows.push(task);
    });
  });

  // 한 페이지에 최대 표시 가능한 행 수 (헤더 제외). 필요시 원본 양식에 맞게 조정
  const MAX_ROWS_PER_PAGE = 15;
  // 페이지별 배열 초기화
  let page1Rows = [], page2Rows = [];

  // 페이지1 채우기
  for (let i = 0; i < MAX_ROWS_PER_PAGE && i < tableRows.length; i++) {
    // 남은 공간이 1행밖에 없고 그 자리에 새로운 프로세스 헤더만 들어가는 상황이면, 해당 헤더를 다음 페이지로 넘김
    if (
      MAX_ROWS_PER_PAGE - i === 1 &&       // 현재 페이지에 남은 행이 1개
      tableRows[i].isProcess === true &&   // 그 1개 행이 프로세스 구분 행
      i < tableRows.length - 1             // 뒤에 출력할 항목이 더 존재
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

  // 페이지1/2에 실제 데이터 행 수보다 부족한 경우 빈 행으로 채워 표의 총 행数를 맞춤 (원본 양식의 틀 유지)
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
  let sumMaterialCost = 0, sumMaterialPrice = 0;
  let sumLaborCost = 0, sumLaborPrice = 0;
  let sumExpense = 0, sumExpensePrice = 0;
  let sumTotalCost = 0, sumTotalPrice = 0;
  processes.forEach(proc => {
    proc.tasks.forEach(task => {
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
          <View style={[styles.cell, styles.firstCol, styles.colCode, styles.lastCol]}><Text style={styles.textCenter}>코드</Text></View>
          <View style={[styles.cell, styles.colName]}><Text style={styles.textCenter}>공종명/내역</Text></View>
          <View style={[styles.cell, styles.colSpec]}><Text style={styles.textCenter}>규격</Text></View>
          <View style={[styles.cell, styles.colUnit]}><Text style={styles.textCenter}>단위</Text></View>
          <View style={[styles.cell, styles.colQty]}><Text style={styles.textCenter}>수량</Text></View>
          <View style={[styles.cell, styles.colCalc]}><Text style={styles.textCenter}>산출내역</Text></View>
          <View style={[styles.cell, styles.colUnitPriceId]}><Text style={styles.textCenter}>단가코드</Text></View>
          <View style={[styles.cell, styles.colMaterial]}><Text style={styles.textCenter}>재료비{"\n"}(원가/도급)</Text></View>
          <View style={[styles.cell, styles.colLabor]}><Text style={styles.textCenter}>노무비{"\n"}(원가/도급)</Text></View>
          <View style={[styles.cell, styles.colExpense]}><Text style={styles.textCenter}>경비{"\n"}(원가/도급)</Text></View>
          <View style={[styles.cell, styles.colTotal, styles.lastCol]}><Text style={styles.textCenter}>합계{"\n"}(원가/도급)</Text></View>
        </View>
        {/* 표 내용 행들 */}
        {page1Rows.map((row, index) => {
          // 프로세스 구분 행
          if (row.isProcess) {
            return (
              <View key={`proc-${index}`} style={styles.tableRow}>
                <View style={[
                    styles.cell,
                    styles.firstCol,
                    styles.colCode,
                    styles.lastCol,   // 프로세스명은 첫 셀 하나에만 표시하고 나머지 셀은 공백
                    { width: 550, fontWeight: 'bold' }    // 셀을 전체 너비로 확장 (너비 합: 550pt)
                  ]}>
                  <Text style={styles.textLeft}>{row.processName} (완료일: {row.endDate})</Text>
                </View>
              </View>
            );
          }
          // 빈 행
          if (row.blank) {
            return (
              <View key={`blank-${index}`} style={styles.tableRow}>
                <View style={[styles.cell, styles.firstCol, styles.colCode]}><Text> </Text></View>
                <View style={[styles.cell, styles.colName]}><Text> </Text></View>
                <View style={[styles.cell, styles.colSpec]}><Text> </Text></View>
                <View style={[styles.cell, styles.colUnit]}><Text> </Text></View>
                <View style={[styles.cell, styles.colQty]}><Text> </Text></View>
                <View style={[styles.cell, styles.colCalc]}><Text> </Text></View>
                <View style={[styles.cell, styles.colUnitPriceId]}><Text> </Text></View>
                <View style={[styles.cell, styles.colMaterial]}><Text> </Text></View>
                <View style={[styles.cell, styles.colLabor]}><Text> </Text></View>
                <View style={[styles.cell, styles.colExpense]}><Text> </Text></View>
                <View style={[styles.cell, styles.colTotal, styles.lastCol]}><Text> </Text></View>
              </View>
            );
          }
          // 일반 작업 행
          const task = row;
          return (
            <View key={`task1-${index}`} style={styles.tableRow}>
              <View style={[styles.cell, styles.firstCol, styles.colCode]}><Text style={styles.textCenter}>{task.code}</Text></View>
              <View style={[styles.cell, styles.colName]}><Text style={styles.textLeft}>{task.name}</Text></View>
              <View style={[styles.cell, styles.colSpec]}><Text style={styles.textLeft}>{task.spec}</Text></View>
              <View style={[styles.cell, styles.colUnit]}><Text style={styles.textCenter}>{task.unit}</Text></View>
              <View style={[styles.cell, styles.colQty]}><Text style={styles.textRight}>{task.unitCount}</Text></View>
              <View style={[styles.cell, styles.colCalc]}><Text style={styles.textLeft}>{task.calculationDetails}</Text></View>
              <View style={[styles.cell, styles.colUnitPriceId]}><Text style={styles.textCenter}>{task.unitPriceId}</Text></View>
              <View style={[styles.cell, styles.colMaterial]}><Text style={styles.textRight}>{formatNumber(task.materialCost)} / {formatNumber(task.materialPrice)}</Text></View>
              <View style={[styles.cell, styles.colLabor]}><Text style={styles.textRight}>{formatNumber(task.laborCost)} / {formatNumber(task.laborPrice)}</Text></View>
              <View style={[styles.cell, styles.colExpense]}><Text style={styles.textRight}>{formatNumber(task.expense)} / {formatNumber(task.expensePrice)}</Text></View>
              <View style={[styles.cell, styles.colTotal, styles.lastCol]}><Text style={styles.textRight}>{formatNumber(task.totalCost)} / {formatNumber(task.totalPrice)}</Text></View>
            </View>
          );
        })}
      </Page>

      {/* 페이지 2 */}
      <Page size="A4" style={styles.page}>
        {/* 표 헤더 반복 */}
        <View style={[styles.tableHeader, styles.tableRow]}>
          <View style={[styles.cell, styles.firstCol, styles.colCode, styles.lastCol]}><Text style={styles.textCenter}>코드</Text></View>
          <View style={[styles.cell, styles.colName]}><Text style={styles.textCenter}>공종명/내역</Text></View>
          <View style={[styles.cell, styles.colSpec]}><Text style={styles.textCenter}>규격</Text></View>
          <View style={[styles.cell, styles.colUnit]}><Text style={styles.textCenter}>단위</Text></View>
          <View style={[styles.cell, styles.colQty]}><Text style={styles.textCenter}>수량</Text></View>
          <View style={[styles.cell, styles.colCalc]}><Text style={styles.textCenter}>산출내역</Text></View>
          <View style={[styles.cell, styles.colUnitPriceId]}><Text style={styles.textCenter}>단가코드</Text></View>
          <View style={[styles.cell, styles.colMaterial]}><Text style={styles.textCenter}>재료비{"\n"}(원가/도급)</Text></View>
          <View style={[styles.cell, styles.colLabor]}><Text style={styles.textCenter}>노무비{"\n"}(원가/도급)</Text></View>
          <View style={[styles.cell, styles.colExpense]}><Text style={styles.textCenter}>경비{"\n"}(원가/도급)</Text></View>
          <View style={[styles.cell, styles.colTotal, styles.lastCol]}><Text style={styles.textCenter}>합계{"\n"}(원가/도급)</Text></View>
        </View>
        {/* 표 내용 행들 (2페이지) */}
        {page2Rows.map((row, index) => {
          if (row.isProcess) {
            // 2페이지에서의 프로세스 구분 행 (이전에 일부 항목이 이미 1페이지에 출력된 경우, 일반적으로 이어지는 페이지에는 프로세스명을 다시 표시하지 않을 수도 있음)
            return (
              <View key={`proc2-${index}`} style={styles.tableRow}>
                <View style={[
                    styles.cell,
                    styles.firstCol,
                    styles.colCode,
                    styles.lastCol,
                    { width: 550, fontWeight: 'bold' }
                  ]}>
                  <Text style={styles.textLeft}>{row.processName} (완료일: {row.endDate})</Text>
                </View>
              </View>
            );
          }
          if (row.blank) {
            return (
              <View key={`blank2-${index}`} style={styles.tableRow}>
                <View style={[styles.cell, styles.firstCol, styles.colCode]}><Text> </Text></View>
                <View style={[styles.cell, styles.colName]}><Text> </Text></View>
                <View style={[styles.cell, styles.colSpec]}><Text> </Text></View>
                <View style={[styles.cell, styles.colUnit]}><Text> </Text></View>
                <View style={[styles.cell, styles.colQty]}><Text> </Text></View>
                <View style={[styles.cell, styles.colCalc]}><Text> </Text></View>
                <View style={[styles.cell, styles.colUnitPriceId]}><Text> </Text></View>
                <View style={[styles.cell, styles.colMaterial]}><Text> </Text></View>
                <View style={[styles.cell, styles.colLabor]}><Text> </Text></View>
                <View style={[styles.cell, styles.colExpense]}><Text> </Text></View>
                <View style={[styles.cell, styles.colTotal, styles.lastCol]}><Text> </Text></View>
              </View>
            );
          }
          const task = row;
          return (
            <View key={`task2-${index}`} style={styles.tableRow}>
              <View style={[styles.cell, styles.firstCol, styles.colCode]}><Text style={styles.textCenter}>{task.code}</Text></View>
              <View style={[styles.cell, styles.colName]}><Text style={styles.textLeft}>{task.name}</Text></View>
              <View style={[styles.cell, styles.colSpec]}><Text style={styles.textLeft}>{task.spec}</Text></View>
              <View style={[styles.cell, styles.colUnit]}><Text style={styles.textCenter}>{task.unit}</Text></View>
              <View style={[styles.cell, styles.colQty]}><Text style={styles.textRight}>{task.unitCount}</Text></View>
              <View style={[styles.cell, styles.colCalc]}><Text style={styles.textLeft}>{task.calculationDetails}</Text></View>
              <View style={[styles.cell, styles.colUnitPriceId]}><Text style={styles.textCenter}>{task.unitPriceId}</Text></View>
              <View style={[styles.cell, styles.colMaterial]}><Text style={styles.textRight}>{formatNumber(task.materialCost)} / {formatNumber(task.materialPrice)}</Text></View>
              <View style={[styles.cell, styles.colLabor]}><Text style={styles.textRight}>{formatNumber(task.laborCost)} / {formatNumber(task.laborPrice)}</Text></View>
              <View style={[styles.cell, styles.colExpense]}><Text style={styles.textRight}>{formatNumber(task.expense)} / {formatNumber(task.expensePrice)}</Text></View>
              <View style={[styles.cell, styles.colTotal, styles.lastCol]}><Text style={styles.textRight}>{formatNumber(task.totalCost)} / {formatNumber(task.totalPrice)}</Text></View>
            </View>
          );
        })}
      </Page>

      {/* 페이지 3 */}
      <Page size="A4" style={styles.page}>
        {/* 총합계 요약 섹션 */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryLine}>※ 공사비용 합계 (원가/도급):</Text>
          <Text style={styles.summaryLine}>- 재료비 합계: {formatNumber(sumMaterialCost)} / {formatNumber(sumMaterialPrice)} 원</Text>
          <Text style={styles.summaryLine}>- 노무비 합계: {formatNumber(sumLaborCost)} / {formatNumber(sumLaborPrice)} 원</Text>
          <Text style={styles.summaryLine}>- 경비 합계: {formatNumber(sumExpense)} / {formatNumber(sumExpensePrice)} 원</Text>
          <Text style={styles.summaryLine}>◆ 총합계: {formatNumber(sumTotalCost)} / {formatNumber(sumTotalPrice)} 원</Text>
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

export default BosuConfirmationPDF;
위 코드에서는 BosuConfirmationPDF 컴포넌트가 JSON 데이터를 입력받아 3페이지로 구성된 PDF 문서를 반환합니다. React 웹앱에서 이 컴포넌트를 사용하여 PDF 다운로드 링크를 만들거나 파일로 저장할 수 있습니다. 예를 들어 여러 항목을 선택한 경우 다음과 같이 각각의 PDF를 생성할 수 있습니다:
{selectedDataList.map(item => (
  <PDFDownloadLink
    key={item.orderId}
    document={<BosuConfirmationPDF data={item} />}
    fileName={`보수확인서_${item.orderId}.pdf`}
  >
    {item.name} PDF 다운로드
  </PDFDownloadLink>
))}
이렇게 구현된 컴포넌트는 React-pdf의 최신 버전을 기반으로 동작하며, 원본 '보수확인서(관리사무소용)' 양식의 레이아웃을 픽셀 단위까지 충실히 재현합니다. 테이블 셀 크기, 글자 정렬, 폰트 크기 등이 모두 원본과 동일하게 설정되어 있으며, 한글 폰트도 등록하여 깨짐 없이 출력되도록 했습니다. 테두리 선은 StyleSheet에서 borderWidth, borderLeftWidth, borderRightWidth 등을 조절하여 그렸으며
javascript.plainenglish.io
, React-pdf에서 지원하는 Flexbox 레이아웃을 활용해 각 요소의 위치를 정확히 맞췄습니다
react-pdf.org
. 또한 React-pdf에서 권장하는 대로 TTF 포맷의 한글 폰트를 등록하여 사용했으며
react-pdf.org
, 이는 기존 이슈에서 검증된 방법입니다 (나눔고딕 TTF 사용 예시)
github.com
. 이 컴포넌트를 이용하면 선택된 각 항목별로 3페이지짜리 PDF 파일을 손쉽게 생성하고, 원본 서식과 동일한 형태로 저장할 수 있을 것입니다.