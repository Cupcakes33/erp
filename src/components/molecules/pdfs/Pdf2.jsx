import React from "react";
import { Page, Text, View } from "@react-pdf/renderer";

export default function Pdf2({ styles, page2Rows, formatNumber }) {
  return (
    <Page size="A4" style={styles.page}>
      {/* 표 헤더 반복 */}
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
      {/* 표 내용 행들 (2페이지) */}
      {page2Rows.map((row, index) => {
        if (row.isProcess) {
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
