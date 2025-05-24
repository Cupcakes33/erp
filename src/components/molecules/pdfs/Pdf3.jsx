import React from "react";
import { Page, Text, View } from "@react-pdf/renderer";

export default function Pdf3({
  styles,
  sumMaterialCost,
  sumMaterialPrice,
  sumLaborCost,
  sumLaborPrice,
  sumExpense,
  sumExpensePrice,
  sumTotalCost,
  sumTotalPrice,
  formatNumber,
}) {
  return (
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
          ◆ 총합계: {formatNumber(sumTotalCost)} / {formatNumber(sumTotalPrice)}{" "}
          원
        </Text>
      </View>
      {/* 확인 서명란 섹션 */}
      <View style={styles.signatureSection}>
        <Text style={styles.signatureLabel}>관리사무소장 (서명):</Text>
        <View style={styles.signatureLine}></View>
      </View>
    </Page>
  );
}
