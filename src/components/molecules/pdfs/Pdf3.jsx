import React from "react";
import { Page, Text, View } from "@react-pdf/renderer";

// 숫자 포맷팅 함수 (예: 1000 -> 1,000)
const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(Number(num))) {
    return "0"; // 또는 "-", "N/A" 등 적절한 기본값
  }
  return Number(num).toLocaleString("en-US");
};

export default function Pdf3({
  pageStyle,
  contentStyles,
  data,
  // detailItems prop은 더 이상 직접 사용하지 않음
  pageInfo = "1/1",
  totalMaterialAmount = "0", // 이 값들은 BosuConfirmationPDF에서 이미 포맷팅되어 올 것으로 예상
  totalLaborAmount = "0",
  totalExpenseAmount = "0",
  grandTotalAmount = "0",
}) {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const printDate = `${year}.${month}.${day} ${hours}:${minutes}`;

  const instructionNumber = data?.orderNumber || "번호 미정";
  const instructionName = data?.name || "이름 미정";
  const prtId = data?.orderNumber
    ? `HMFM${data.orderNumber.replace(/-/g, "")}R05`
    : "PRT-ID 미정";
  const structureName = data?.structure || "시설물 정보 없음";

  const splitText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    const words = String(text).split(" ");
    const lines = [];
    let currentLine = "";
    words.forEach((word) => {
      if (currentLine.length + word.length + 1 <= maxLength) {
        currentLine += (currentLine ? " " : "") + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines.join("\n");
  };

  return (
    <Page size="A4" style={pageStyle}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        <Text
          style={[
            contentStyles.title,
            { fontSize: 18, fontWeight: "bold", flex: 1, textAlign: "center" },
          ]}
        >
          내역서
        </Text>

        <View
          style={{
            width: 150,
            border: "1pt solid black",
            padding: 8,
            marginLeft: 20,
          }}
        >
          <View style={{ flexDirection: "row", marginBottom: 4 }}>
            <Text style={{ fontSize: 10, width: 60 }}>PRT-ID :</Text>
            <Text style={{ fontSize: 10 }}>{prtId}</Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 4 }}>
            <Text style={{ fontSize: 10, width: 60 }}>페이지</Text>
            <Text style={{ fontSize: 10 }}>{pageInfo}</Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 4 }}>
            <Text style={{ fontSize: 10, width: 60 }}>출력일자</Text>
            <Text style={{ fontSize: 10 }}>{printDate}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: "row", marginBottom: 8 }}>
          <Text style={{ fontSize: 12, width: 80 }}>■ 지시번호 :</Text>
          <Text style={{ fontSize: 12 }}>
            {splitText(instructionNumber, 50)}
          </Text>
        </View>
        <View style={{ flexDirection: "row", marginBottom: 8 }}>
          <Text style={{ fontSize: 12, width: 80 }}>■ 지시명 :</Text>
          <Text style={{ fontSize: 12 }}>{splitText(instructionName, 50)}</Text>
        </View>
      </View>

      {/* 메인 테이블 헤더 */}
      <View
        style={{
          flexDirection: "row",
          border: "1pt solid black",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Text
          style={{
            fontSize: 8,
            textAlign: "center",
            width: 70,
            padding: 4,
            borderRight: "1pt solid black",
          }}
        >
          공종명{"\n"}(공종ID)
        </Text>
        <Text
          style={{
            fontSize: 8,
            textAlign: "center",
            width: 50,
            padding: 4,
            borderRight: "1pt solid black",
          }}
        >
          시설물
        </Text>
        <Text
          style={{
            fontSize: 8,
            textAlign: "center",
            width: 100,
            padding: 4,
            borderRight: "1pt solid black",
          }}
        >
          작업명
        </Text>
        <Text
          style={{
            fontSize: 8,
            textAlign: "center",
            width: 40,
            padding: 4,
            borderRight: "1pt solid black",
          }}
        >
          규격
        </Text>
        <Text
          style={{
            fontSize: 8,
            textAlign: "center",
            width: 25,
            padding: 4,
            borderRight: "1pt solid black",
          }}
        >
          단위
        </Text>
        <Text
          style={{
            fontSize: 8,
            textAlign: "center",
            width: 25,
            padding: 4,
            borderRight: "1pt solid black",
          }}
        >
          수량
        </Text>
        <Text
          style={{
            fontSize: 8,
            textAlign: "center",
            width: 50,
            padding: 4,
            borderRight: "1pt solid black",
          }}
        >
          재료비{"\n"}단가 금액
        </Text>{" "}
        {/* 탭 제거 */}
        <Text
          style={{
            fontSize: 8,
            textAlign: "center",
            width: 50,
            padding: 4,
            borderRight: "1pt solid black",
          }}
        >
          노무비{"\n"}단가 금액
        </Text>{" "}
        {/* 탭 제거 */}
        <Text
          style={{
            fontSize: 8,
            textAlign: "center",
            width: 50,
            padding: 4,
            borderRight: "1pt solid black",
          }}
        >
          경비{"\n"}단가 금액
        </Text>{" "}
        {/* 탭 제거 */}
        <Text
          style={{
            fontSize: 8,
            textAlign: "center",
            width: 50,
            padding: 4,
            borderRight: "1pt solid black",
          }}
        >
          합계{"\n"}단가 금액
        </Text>{" "}
        {/* 탭 제거 */}
        <Text
          style={{ fontSize: 8, textAlign: "center", width: 40, padding: 4 }}
        >
          비고
        </Text>
      </View>

      {/* 메인 테이블 데이터 */}
      {(data?.processes || []).flatMap((process, pIndex) =>
        (process.tasks || []).map((task, tIndex) => (
          <View
            key={`task-${pIndex}-${tIndex}`}
            style={{
              flexDirection: "row",
              border: "1pt solid black",
              borderTop: "none",
              minHeight: 40,
            }}
          >
            <View
              style={{
                width: 70,
                padding: 3,
                borderRight: "1pt solid black",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Text style={{ fontSize: 7, textAlign: "left" }}>
                {splitText(
                  `${process.processName} (${process.processId || "미정"})`,
                  12
                )}
              </Text>
            </View>
            <View
              style={{
                width: 50,
                padding: 3,
                borderRight: "1pt solid black",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Text style={{ fontSize: 7, textAlign: "left" }}>
                {splitText(structureName, 8)}
              </Text>
            </View>
            <View
              style={{
                width: 100,
                padding: 3,
                borderRight: "1pt solid black",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Text style={{ fontSize: 6, textAlign: "left" }}>
                {splitText(task.name, 18)}
              </Text>
            </View>
            <View
              style={{
                width: 40,
                padding: 3,
                borderRight: "1pt solid black",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <Text style={{ fontSize: 8, textAlign: "center" }}>
                {task.spec}
              </Text>
            </View>
            <View
              style={{
                width: 25,
                padding: 3,
                borderRight: "1pt solid black",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <Text style={{ fontSize: 8, textAlign: "center" }}>
                {task.unit}
              </Text>
            </View>
            <View
              style={{
                width: 25,
                padding: 3,
                borderRight: "1pt solid black",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <Text style={{ fontSize: 8, textAlign: "center" }}>
                {task.unitCount}
              </Text>
            </View>
            <View
              style={{
                width: 50,
                padding: 3,
                borderRight: "1pt solid black",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Text style={{ fontSize: 7 }}>
                {formatNumber(task.materialCost)}
              </Text>
              <Text style={{ fontSize: 7 }}>
                {formatNumber(task.materialPrice)}
              </Text>
            </View>
            <View
              style={{
                width: 50,
                padding: 3,
                borderRight: "1pt solid black",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Text style={{ fontSize: 7 }}>
                {formatNumber(task.laborCost)}
              </Text>
              <Text style={{ fontSize: 7 }}>
                {formatNumber(task.laborPrice)}
              </Text>
            </View>
            <View
              style={{
                width: 50,
                padding: 3,
                borderRight: "1pt solid black",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Text style={{ fontSize: 7 }}>{formatNumber(task.expense)}</Text>
              <Text style={{ fontSize: 7 }}>
                {formatNumber(task.expensePrice)}
              </Text>
            </View>
            <View
              style={{
                width: 50,
                padding: 3,
                borderRight: "1pt solid black",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Text style={{ fontSize: 7 }}>
                {formatNumber(task.totalCost)}
              </Text>
              <Text style={{ fontSize: 7 }}>
                {formatNumber(task.totalPrice)}
              </Text>
            </View>
            <View
              style={{
                width: 40,
                padding: 3,
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Text style={{ fontSize: 7, textAlign: "left" }}>
                {splitText(task.code, 6)}
              </Text>
            </View>
          </View>
        ))
      )}
      {/* 데이터가 없을 경우 빈 행 표시 (선택적) */}
      {!(data?.processes || []).some((p) => p.tasks && p.tasks.length > 0) && (
        <View
          style={{
            flexDirection: "row",
            border: "1pt solid black",
            borderTop: "none",
            minHeight: 40,
          }}
        >
          <View
            style={{ width: 70, padding: 3, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View
            style={{ width: 50, padding: 3, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View
            style={{ width: 100, padding: 3, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View
            style={{ width: 40, padding: 3, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View
            style={{ width: 25, padding: 3, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View
            style={{ width: 25, padding: 3, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View
            style={{ width: 50, padding: 3, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View
            style={{ width: 50, padding: 3, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View
            style={{ width: 50, padding: 3, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View
            style={{ width: 50, padding: 3, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View style={{ width: 40, padding: 3 }}>
            <Text> </Text>
          </View>
        </View>
      )}

      {/* 합계 행 */}
      <View
        style={{
          flexDirection: "row",
          border: "1pt solid black",
          borderTop: "none",
          backgroundColor: "#f8f8f8",
        }}
      >
        <Text
          style={{
            fontSize: 9,
            textAlign: "center",
            width: 310, // 공종명부터 수량까지의 너비 합산 (70+50+100+40+25+25)
            padding: 6,
            borderRight: "1pt solid black",
            fontWeight: "bold",
          }}
        >
          [ 합계 ]
        </Text>
        <Text
          style={{
            fontSize: 9,
            textAlign: "center",
            width: 50,
            padding: 6,
            borderRight: "1pt solid black",
            fontWeight: "bold",
          }}
        >
          {totalMaterialAmount} {/* 이미 포맷팅된 값 */}
        </Text>
        <Text
          style={{
            fontSize: 9,
            textAlign: "center",
            width: 50,
            padding: 6,
            borderRight: "1pt solid black",
            fontWeight: "bold",
          }}
        >
          {totalLaborAmount} {/* 이미 포맷팅된 값 */}
        </Text>
        <Text
          style={{
            fontSize: 9,
            textAlign: "center",
            width: 50,
            padding: 6,
            borderRight: "1pt solid black",
            fontWeight: "bold",
          }}
        >
          {totalExpenseAmount} {/* 이미 포맷팅된 값 */}
        </Text>
        <Text
          style={{
            fontSize: 9,
            textAlign: "center",
            width: 50,
            padding: 6,
            borderRight: "1pt solid black",
            fontWeight: "bold",
          }}
        >
          {grandTotalAmount} {/* 이미 포맷팅된 값 */}
        </Text>
        <Text
          style={{ fontSize: 9, textAlign: "center", width: 40, padding: 6 }}
        >
          {/* 비고란 합계는 없음 */}
        </Text>
      </View>
    </Page>
  );
}
