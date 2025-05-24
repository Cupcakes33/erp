import React from "react";
import { Page, Text, View } from "@react-pdf/renderer";

export default function Pdf1({
  styles,
  name,
  structure,
  orderNumber,
  orderDate,
  page1Rows,
  formatNumber,
}) {
  return (
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
          style={[styles.cell, styles.firstCol, styles.colCode, styles.lastCol]}
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
                {formatNumber(task.laborCost)} / {formatNumber(task.laborPrice)}
              </Text>
            </View>
            <View style={[styles.cell, styles.colExpense]}>
              <Text style={styles.textRight}>
                {formatNumber(task.expense)} / {formatNumber(task.expensePrice)}
              </Text>
            </View>
            <View style={[styles.cell, styles.colTotal, styles.lastCol]}>
              <Text style={styles.textRight}>
                {formatNumber(task.totalCost)} / {formatNumber(task.totalPrice)}
              </Text>
            </View>
          </View>
        );
      })}
    </Page>
  );
}
