import React from "react";
import { Page, Text, View } from "@react-pdf/renderer";

export default function Pdf1({
  pageStyle,
  contentStyles,
  data,
  recipient = "서울주택도시공사 성북주거안정통합센터",
  sender = "주식회사 중앙종합학안전기술연구원",
  subject = "시설물 보수확인서 제출",
  pageInfo = "1/1",
}) {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const printDate = `${year}.${month}.${day} ${hours}:${minutes}`;

  const formatDate = (dateStr) => {
    if (!dateStr) return "날짜 미정";
    return dateStr.includes("-") ? dateStr.replace(/-/g, ".") : dateStr;
  };

  const instructionDate = formatDate(data?.orderDate);
  const instructionId = data?.orderId || "ID 미정";
  const additionalInfo = data?.orderNumber || "번호 미정";
  const prtId = data?.orderNumber
    ? `HMFM${data.orderNumber.replace(/-/g, "")}`
    : "PRT-ID 미정";

  const structureName = data?.structure || "시설물 정보 없음";
  const mainTitle = data?.name || "제목 없음";

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
      <Text
        style={[
          contentStyles.title,
          {
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
          },
        ]}
      >
        보수확인서
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Text style={{ width: 80, fontSize: 12 }}>수</Text>
            <Text style={{ width: 80, fontSize: 12 }}>신:</Text>
            <Text style={{ fontSize: 12 }}>{splitText(recipient, 40)}</Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Text style={{ width: 80, fontSize: 12 }}>발</Text>
            <Text style={{ width: 80, fontSize: 12 }}>신:</Text>
            <Text style={{ fontSize: 12 }}>{splitText(sender, 40)}</Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Text style={{ width: 80, fontSize: 12 }}>제</Text>
            <Text style={{ width: 80, fontSize: 12 }}>목:</Text>
            <Text style={{ fontSize: 12 }}>{splitText(subject, 40)}</Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Text style={{ width: 160, fontSize: 12 }}>보수지시일자:</Text>
            <Text style={{ fontSize: 12 }}>{instructionDate}</Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Text style={{ width: 160, fontSize: 12 }}>지시 사ID:</Text>
            <Text style={{ fontSize: 12 }}>{instructionId}</Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Text style={{ width: 160, fontSize: 12 }}>보수작업지시서 제</Text>
            <Text style={{ fontSize: 12 }}>{additionalInfo}</Text>
          </View>
        </View>

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

          <View style={{ marginTop: 8, border: "1pt solid black" }}>
            <View
              style={{ flexDirection: "row", borderBottom: "1pt solid black" }}
            >
              <Text
                style={{
                  fontSize: 8,
                  textAlign: "center",
                  flex: 1,
                  padding: 2,
                  borderRight: "1pt solid black",
                }}
              >
                담당
              </Text>
              <Text
                style={{
                  fontSize: 8,
                  textAlign: "center",
                  flex: 1,
                  padding: 2,
                  borderRight: "1pt solid black",
                }}
              >
                검측
              </Text>
              <Text
                style={{
                  fontSize: 8,
                  textAlign: "center",
                  flex: 1,
                  padding: 2,
                }}
              >
                부장
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  flex: 1,
                  height: 20,
                  borderRight: "1pt solid black",
                }}
              ></View>
              <View
                style={{
                  flex: 1,
                  height: 20,
                  borderRight: "1pt solid black",
                }}
              ></View>
              <View
                style={{
                  flex: 1,
                  height: 20,
                }}
              ></View>
            </View>
          </View>
        </View>
      </View>

      <Text style={{ fontSize: 10, marginBottom: 15, textAlign: "center" }}>
        호에 의거 보수공사를 완료하고 아래와 같이 확인서를 제출합니다.
      </Text>

      <View
        style={{
          flexDirection: "row",
          border: "1pt solid black",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Text
          style={{
            fontSize: 10,
            textAlign: "center",
            width: 80,
            padding: 8,
            borderRight: "1pt solid black",
          }}
        >
          공종번호
        </Text>
        <Text
          style={{
            fontSize: 10,
            textAlign: "center",
            width: 120,
            padding: 8,
            borderRight: "1pt solid black",
          }}
        >
          공종
        </Text>
        <Text
          style={{
            fontSize: 10,
            textAlign: "center",
            width: 250,
            padding: 8,
            borderRight: "1pt solid black",
          }}
        >
          시설물
        </Text>
        <Text
          style={{ fontSize: 10, textAlign: "center", width: 80, padding: 8 }}
        >
          보수처리일
        </Text>
      </View>

      {(data?.processes || []).map((process, index) => (
        <View
          key={`process-${index}`}
          style={{
            flexDirection: "row",
            border: "1pt solid black",
            borderTop: "none",
            minHeight: 30,
          }}
        >
          <View
            style={{
              width: 80,
              padding: 6,
              borderRight: "1pt solid black",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Text style={{ fontSize: 10, textAlign: "center" }}>
              {process.processId || "미정"}
            </Text>
          </View>
          <View
            style={{
              width: 120,
              padding: 6,
              borderRight: "1pt solid black",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Text style={{ fontSize: 9, textAlign: "left" }}>
              {splitText(process.processName, 15)}
            </Text>
          </View>
          <View
            style={{
              width: 250,
              padding: 6,
              borderRight: "1pt solid black",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Text style={{ fontSize: 8, textAlign: "left" }}>
              {splitText(structureName, 40)}
            </Text>
          </View>
          <View
            style={{
              width: 80,
              padding: 6,
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Text style={{ fontSize: 10, textAlign: "center" }}>
              {formatDate(process.endDate)}
            </Text>
          </View>
        </View>
      ))}
      {(data?.processes?.length || 0) === 0 && (
        <View
          style={{
            flexDirection: "row",
            border: "1pt solid black",
            borderTop: "none",
            minHeight: 30,
          }}
        >
          <View
            style={{ width: 80, padding: 6, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View
            style={{ width: 120, padding: 6, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View
            style={{ width: 250, padding: 6, borderRight: "1pt solid black" }}
          >
            <Text> </Text>
          </View>
          <View style={{ width: 80, padding: 6 }}>
            <Text> </Text>
          </View>
        </View>
      )}

      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 10 }}>
          ● 물량내역 총 목록
        </Text>

        <View
          style={{
            flexDirection: "row",
            border: "1pt solid black",
            backgroundColor: "#f0f0f0",
          }}
        >
          <Text
            style={{
              fontSize: 10,
              textAlign: "center",
              width: 120,
              padding: 6,
              borderRight: "1pt solid black",
            }}
          >
            지시서제목
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: "center",
              width: 120,
              padding: 6,
              borderRight: "1pt solid black",
            }}
          >
            단가내역 공종명
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: "center",
              width: 80,
              padding: 6,
              borderRight: "1pt solid black",
            }}
          >
            규격
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: "center",
              width: 50,
              padding: 6,
              borderRight: "1pt solid black",
            }}
          >
            단위
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: "center",
              width: 50,
              padding: 6,
              borderRight: "1pt solid black",
            }}
          >
            수량
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: "center",
              width: 100,
              padding: 6,
            }}
          >
            효과 (코드)
          </Text>
        </View>

        {(data?.processes || []).flatMap((process, pIndex) =>
          (process.tasks || []).map((task, tIndex) => (
            <View
              key={`task-${pIndex}-${tIndex}`}
              style={{
                flexDirection: "row",
                border: "1pt solid black",
                borderTop: "none",
                minHeight: 25,
              }}
            >
              <View
                style={{
                  width: 120,
                  padding: 4,
                  borderRight: "1pt solid black",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <Text style={{ fontSize: 8, textAlign: "left" }}>
                  {splitText(mainTitle, 18)}
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
                <Text style={{ fontSize: 8, textAlign: "left" }}>
                  {splitText(task.name, 18)}
                </Text>
              </View>
              <View
                style={{
                  width: 80,
                  padding: 4,
                  borderRight: "1pt solid black",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <Text style={{ fontSize: 8, textAlign: "center" }}>
                  {splitText(task.spec, 10)}
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
                <Text style={{ fontSize: 8, textAlign: "center" }}>
                  {task.unit}
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
                <Text style={{ fontSize: 8, textAlign: "center" }}>
                  {task.unitCount}
                </Text>
              </View>
              <View
                style={{
                  width: 100,
                  padding: 4,
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <Text style={{ fontSize: 8, textAlign: "center" }}>
                  {task.code}
                </Text>
              </View>
            </View>
          ))
        )}
        {!(data?.processes || []).some(
          (p) => p.tasks && p.tasks.length > 0
        ) && (
          <View
            style={{
              flexDirection: "row",
              border: "1pt solid black",
              borderTop: "none",
              height: 25,
            }}
          >
            <View style={{ width: 120, borderRight: "1pt solid black" }}>
              <Text> </Text>
            </View>
            <View style={{ width: 120, borderRight: "1pt solid black" }}>
              <Text> </Text>
            </View>
            <View style={{ width: 80, borderRight: "1pt solid black" }}>
              <Text> </Text>
            </View>
            <View style={{ width: 50, borderRight: "1pt solid black" }}>
              <Text> </Text>
            </View>
            <View style={{ width: 50, borderRight: "1pt solid black" }}>
              <Text> </Text>
            </View>
            <View style={{ width: 100 }}>
              <Text> </Text>
            </View>
          </View>
        )}
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 10, marginBottom: 8 }}>
          첨부: 1. 물량산출내역 1부.
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 8 }}>
          2. 보수 전, 중, 후 사진 각 1부. 끝.
        </Text>

        <Text style={{ fontSize: 12, textAlign: "right", marginTop: 20 }}>
          확인일자
        </Text>
      </View>
    </Page>
  );
}
