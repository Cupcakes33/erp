import React from "react";
import { Page, Text, View } from "@react-pdf/renderer";

export default function Pdf2({
  pageStyle,
  contentStyles,
  data,
  pageInfo = "1/1",
}) {
  // 현재 날짜/시간 생성 (YYYY.MM.DD HH:MM 형식)
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const printDate = `${year}.${month}.${day} ${hours}:${minutes}`;

  // data에서 필요한 정보 추출
  const instructionNumber = data?.orderNumber || "번호 미정";
  const instructionName = data?.name || "이름 미정";
  const prtId = data?.orderNumber
    ? `HMFM${data.orderNumber.replace(/-/g, "")}R04`
    : "PRT-ID 미정";
  const structureName = data?.structure || "시설물 정보 없음";

  // 긴 텍스트를 지정된 길이로 분할하는 함수
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
            contentStyles.title,
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
          style={{ fontSize: 9, textAlign: "center", width: 60, padding: 6 }}
        >
          효과 (코드)
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
                {process.processId || "미정"}
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
                {splitText(process.processName, 12)}
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
                {splitText(structureName, 12)}
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
                {splitText(task.name, 20)}
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
                {task.spec}
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
                {task.unit}
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
                {task.unitCount}
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
                {splitText(task.calculationDetails, 12)}
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
                {splitText(task.code, 8)}
              </Text>
            </View>
          </View>
        ))
      )}
      {/* 물량 내역이 없을 경우 빈 행 표시 (선택적) */}
      {!(data?.processes || []).some((p) => p.tasks && p.tasks.length > 0) && (
        <View
          style={{
            flexDirection: "row",
            border: "1pt solid black",
            borderTop: "none",
            minHeight: 35,
          }}
        >
          <View
            style={{ width: 60, padding: 4, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View
            style={{ width: 80, padding: 4, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View
            style={{ width: 80, padding: 4, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View
            style={{ width: 120, padding: 4, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View
            style={{ width: 50, padding: 4, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View
            style={{ width: 40, padding: 4, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View
            style={{ width: 40, padding: 4, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View
            style={{ width: 80, padding: 4, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View style={{ width: 60, padding: 4 }}>
            <Text> </Text>
          </View>
        </View>
      )}
    </Page>
  );
}
