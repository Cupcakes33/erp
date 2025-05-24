import React from "react";
import { Page, Text, View } from "@react-pdf/renderer";

export default function Pdf3({
  styles,
  instructionNumber = "컨셉2025-단기-0194",
  instructionName = "우이동 21-16 502호 방 창가 단열물탈 보수",
  prtId = "HMFMQB0201R05",
  pageInfo = "1/1",
  printDate = "2025.03.21 09:19",
  detailItems = [
    {
      code: "3101050",
      typeName: "건축-수장-단열층 (3101050)",
      facility: "",
      workName: "절곡막지 도매비롤(황밸, 석고보드면)-절거포함, 초마지시설",
      spec: "20mm",
      unit: "M2",
      quantity: "1",
      materialUnitPrice: "11,806",
      materialAmount: "11,806",
      laborUnitPrice: "11,456",
      laborAmount: "11,456",
      expenseUnitPrice: "0",
      expenseAmount: "0",
      totalUnitPrice: "23,262",
      totalAmount: "23,262",
      note: "노원도북시설 신7",
    },
    {
      code: "3101051",
      typeName: "건축-수장-도배 (3101051)",
      facility: "",
      workName: "실크벽지 도매비롤(황밸, 석고보드면)-절거포함, 초마지시설",
      spec: "벽면",
      unit: "M2",
      quantity: "1",
      materialUnitPrice: "2,666",
      materialAmount: "2,666",
      laborUnitPrice: "8,563",
      laborAmount: "8,563",
      expenseUnitPrice: "0",
      expenseAmount: "0",
      totalUnitPrice: "11,229",
      totalAmount: "11,229",
      note: "건축No.9",
    },
  ],
  totalMaterialAmount = "14,472",
  totalLaborAmount = "20,019",
  totalExpenseAmount = "0",
  grandTotalAmount = "34,491",
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
          내역서
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
          재료비{"\n"}단가{"\t"}금액
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
          노무비{"\n"}단가{"\t"}금액
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
          경비{"\n"}단가{"\t"}금액
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
          합계{"\n"}단가{"\t"}금액
        </Text>
        <Text
          style={{
            fontSize: 8,
            textAlign: "center",
            width: 40,
            padding: 4,
          }}
        >
          비고
        </Text>
      </View>

      {/* 메인 테이블 데이터 */}
      {detailItems.map((item, index) => (
        <View
          key={index}
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
              {splitText(item.typeName, 10)}
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
              {splitText(item.facility, 8)}
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
              {splitText(item.workName, 18)}
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
              {item.spec}
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
              {item.unit}
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
              {item.quantity}
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
            <Text style={{ fontSize: 7 }}>{item.materialUnitPrice}</Text>
            <Text style={{ fontSize: 7 }}>{item.materialAmount}</Text>
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
            <Text style={{ fontSize: 7 }}>{item.laborUnitPrice}</Text>
            <Text style={{ fontSize: 7 }}>{item.laborAmount}</Text>
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
            <Text style={{ fontSize: 7 }}>{item.expenseUnitPrice}</Text>
            <Text style={{ fontSize: 7 }}>{item.expenseAmount}</Text>
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
            <Text style={{ fontSize: 7 }}>{item.totalUnitPrice}</Text>
            <Text style={{ fontSize: 7 }}>{item.totalAmount}</Text>
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
              {splitText(item.note, 6)}
            </Text>
          </View>
        </View>
      ))}

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
            width: 310,
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
          {totalMaterialAmount}
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
          {totalLaborAmount}
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
          {totalExpenseAmount}
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
          {grandTotalAmount}
        </Text>
        <Text
          style={{
            fontSize: 9,
            textAlign: "center",
            width: 40,
            padding: 6,
          }}
        ></Text>
      </View>
    </Page>
  );
}
