import React from "react";
import { Page, Text, View } from "@react-pdf/renderer";

export default function Pdf2({
  styles,
  instructionNumber = "컨셉2025-단기-0194",
  instructionName = "우이동 21-16 502호 방 창가 단열물탈 보수",
  prtId = "HMFMQB0201R04",
  pageInfo = "1/1",
  printDate = "2025.03.21 09:18",
  quantityItems = [
    {
      code: "3101050",
      typeName: "건축-수장-단열층 (3101050)",
      facility: "다가구매입임대(경북구) 0121 - 0502",
      workName: "절곡막지 도매비롤(황밸, 석고보드면)-절거포함, 초마지시설",
      spec: "20mm",
      unit: "M2",
      quantity: "1",
      calculation: "노원도북시설",
      effect: "",
    },
    {
      code: "3101051",
      typeName: "건축-수장-도배 (3101051)",
      facility: "",
      workName: "실크벽지 도매비롤(황밸, 석고보드면)-절거포함, 초마지시설",
      spec: "벽면",
      unit: "M2",
      quantity: "1",
      calculation: "",
      effect: "건축No.9",
    },
  ],
}) {
  // 긴 텍스트를 지정된 길이로 분할하는 함수
  const splitText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;

    const words = text.split(" ");
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
    <Page size="A4" style={styles.page}>
      {/* 문서 제목 */}
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
            styles.title,
            { fontSize: 18, fontWeight: "bold", flex: 1, textAlign: "center" },
          ]}
        >
          물량산출근거
        </Text>

        {/* 우측 정보박스 */}
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

      {/* 지시 정보 */}
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
            fontSize: 9,
            textAlign: "center",
            width: 60,
            padding: 6,
            borderRight: "1pt solid black",
          }}
        >
          공종번호
        </Text>
        <Text
          style={{
            fontSize: 9,
            textAlign: "center",
            width: 80,
            padding: 6,
            borderRight: "1pt solid black",
          }}
        >
          공종명
        </Text>
        <Text
          style={{
            fontSize: 9,
            textAlign: "center",
            width: 80,
            padding: 6,
            borderRight: "1pt solid black",
          }}
        >
          시설물
        </Text>
        <Text
          style={{
            fontSize: 9,
            textAlign: "center",
            width: 120,
            padding: 6,
            borderRight: "1pt solid black",
          }}
        >
          작업명
        </Text>
        <Text
          style={{
            fontSize: 9,
            textAlign: "center",
            width: 50,
            padding: 6,
            borderRight: "1pt solid black",
          }}
        >
          규격
        </Text>
        <Text
          style={{
            fontSize: 9,
            textAlign: "center",
            width: 40,
            padding: 6,
            borderRight: "1pt solid black",
          }}
        >
          단위
        </Text>
        <Text
          style={{
            fontSize: 9,
            textAlign: "center",
            width: 40,
            padding: 6,
            borderRight: "1pt solid black",
          }}
        >
          수량
        </Text>
        <Text
          style={{
            fontSize: 9,
            textAlign: "center",
            width: 80,
            padding: 6,
            borderRight: "1pt solid black",
          }}
        >
          산출내역
        </Text>
        <Text
          style={{
            fontSize: 9,
            textAlign: "center",
            width: 60,
            padding: 6,
          }}
        >
          효과
        </Text>
      </View>

      {/* 메인 테이블 데이터 */}
      {quantityItems.map((item, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            border: "1pt solid black",
            borderTop: "none",
            minHeight: 35,
          }}
        >
          <View
            style={{
              width: 60,
              padding: 4,
              borderRight: "1pt solid black",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Text style={{ fontSize: 9, textAlign: "center" }}>
              {item.code}
            </Text>
          </View>
          <View
            style={{
              width: 80,
              padding: 4,
              borderRight: "1pt solid black",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Text style={{ fontSize: 8, textAlign: "left" }}>
              {splitText(item.typeName, 12)}
            </Text>
          </View>
          <View
            style={{
              width: 80,
              padding: 4,
              borderRight: "1pt solid black",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Text style={{ fontSize: 8, textAlign: "left" }}>
              {splitText(item.facility, 12)}
            </Text>
          </View>
          <View
            style={{
              width: 120,
              padding: 4,
              borderRight: "1pt solid black",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Text style={{ fontSize: 7, textAlign: "left" }}>
              {splitText(item.workName, 20)}
            </Text>
          </View>
          <View
            style={{
              width: 50,
              padding: 4,
              borderRight: "1pt solid black",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Text style={{ fontSize: 9, textAlign: "center" }}>
              {item.spec}
            </Text>
          </View>
          <View
            style={{
              width: 40,
              padding: 4,
              borderRight: "1pt solid black",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Text style={{ fontSize: 9, textAlign: "center" }}>
              {item.unit}
            </Text>
          </View>
          <View
            style={{
              width: 40,
              padding: 4,
              borderRight: "1pt solid black",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Text style={{ fontSize: 9, textAlign: "center" }}>
              {item.quantity}
            </Text>
          </View>
          <View
            style={{
              width: 80,
              padding: 4,
              borderRight: "1pt solid black",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Text style={{ fontSize: 8, textAlign: "left" }}>
              {splitText(item.calculation, 12)}
            </Text>
          </View>
          <View
            style={{
              width: 60,
              padding: 4,
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Text style={{ fontSize: 8, textAlign: "center" }}>
              {splitText(item.effect, 8)}
            </Text>
          </View>
        </View>
      ))}
    </Page>
  );
}
