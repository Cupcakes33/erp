import React, { useState, useEffect } from "react";
import RepairConfirmationPDF, {
  RepairConfirmationDocument,
} from "./RepairConfirmationPDF";
import QuantityCalculationPDF, {
  QuantityCalculationDocument,
} from "./QuantityCalculationPDF";
import DetailStatementPDF, {
  DetailStatementDocument,
} from "./DetailStatementPDF";
import {
  pdf,
  Document,
  Page,
  StyleSheet,
  View,
  Text,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";

// 전체 문서를 위한 스타일
const combinedStyles = StyleSheet.create({
  page: {
    padding: 10,
    fontFamily: "NotoSansKR",
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});

// 통합 PDF 문서 컴포넌트
const AllDocumentsWrapper = ({ data }) => (
  <Document>
    <Page size="A4" style={combinedStyles.page}>
      <View>
        <Text style={combinedStyles.title}>통합 보수 문서</Text>

        <View style={combinedStyles.section}>
          <Text>이 PDF에는 다음 문서가 포함되어 있습니다:</Text>
          <Text>1. 보수확인서</Text>
          <Text>2. 물량산출근거</Text>
          <Text>3. 내역서</Text>
          <Text style={{ marginTop: 10 }}>
            지시번호: {data?.orderNumber || "경북2025-단가-0194"}
          </Text>
          <Text>
            지시명: {data?.name || "우이동 21-16 502호 방 창가 단열불량 보수"}
          </Text>
        </View>
      </View>
    </Page>

    <RepairConfirmationDocument data={data.confirmation} />
    <QuantityCalculationDocument data={data.calculation} />
    <DetailStatementDocument data={data.detail} />
  </Document>
);

// 전체 보수 문서 세트 관리 컴포넌트
const RepairDocumentSetPDF = ({ data, onClose }) => {
  const [activeTab, setActiveTab] = useState("confirmation");
  const [downloadingAll, setDownloadingAll] = useState(false);

  // 모든 문서 데이터
  const documentData = {
    // 보수확인서 데이터
    confirmation: {
      orderNumber: data?.orderNumber || "경북2025-단가-0194",
      orderDate: data?.orderDate || "2025.02.11",
      id: data?.id || "3033727",
      title: "시설물 보수확인서 제출",
      receiver: "서울주택도시공사 성북주거안심센터장",
      sender: "주식회사 종합종합안전기술연구원",
      name: data?.name || "우이동 21-16 502호 방 창가 단열불량 보수",
      repairItems:
        data?.items?.map((item) => ({
          code: item.code,
          category: item.name?.split("(")[0] || "",
          facility: "다가구매입임대(강북구) 0121 - 0502",
          repairDate: "2025.02.24",
        })) || [],
      quantityItems:
        data?.items?.map((item) => ({
          title: data?.name || "우이동 21-16 502호 방 창가 단열불량 보수",
          workName: item.work || "",
          specification: item.spec || "",
          unit: item.unit || "",
          quantity: item.quantity || 1,
          marker: item.note || "",
        })) || [],
      printDate: "2025.03.21 09:19",
    },

    // 물량산출근거 데이터
    calculation: {
      orderNumber: data?.orderNumber || "경북2025-단가-0194",
      orderName: data?.name || "우이동 21-16 502호 방 창가 단열불량 보수",
      items:
        data?.items?.map((item) => ({
          code: item.code?.split("(")[1]?.replace(")", "") || "",
          name: item.code || "",
          facility: "다가구매입임대(강북구) 0121 - 0502",
          work: item.work || "",
          spec: item.spec || "",
          unit: item.unit || "",
          quantity: item.quantity || 1,
          note: item.note || "",
        })) || [],
      printDate: "2025.03.21 09:18",
    },

    // 내역서 데이터
    detail: {
      orderNumber: data?.orderNumber || "경북2025-단가-0194",
      orderName: data?.name || "우이동 21-16 502호 방 창가 단열불량 보수",
      items:
        data?.items?.map((item) => ({
          code: item.code || "",
          name: item.work || "",
          spec: item.spec || "",
          unit: item.unit || "",
          quantity: item.quantity || 1,
          materialCost: item.materialCost || 0,
          materialAmount: item.materialAmount || 0,
          laborCost: item.laborCost || 0,
          laborAmount: item.laborAmount || 0,
          expenseCost: item.expenseCost || 0,
          expenseAmount: item.expenseAmount || 0,
          totalAmount: item.totalAmount || 0,
          note: item.note || "",
        })) || [],
      summary: {
        materialAmount: data?.summary?.materialAmount || 0,
        laborAmount: data?.summary?.laborAmount || 0,
        expenseAmount: data?.summary?.expenseAmount || 0,
        totalAmount: data?.summary?.totalAmount || 0,
      },
      printDate: "2025.03.21 09:19",
    },
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // 통합 PDF 생성 및 다운로드 함수
  const handleGenerateAllPDF = async () => {
    setDownloadingAll(true);
    try {
      // 통합 PDF 생성
      const allDocumentsBlob = await pdf(
        <AllDocumentsWrapper data={documentData} />
      ).toBlob();

      // 다운로드
      saveAs(allDocumentsBlob, "보수문서_통합.pdf");
    } catch (error) {
      console.error("PDF 생성 중 오류:", error);
      alert("PDF 생성에 실패했습니다. 각 문서를 개별적으로 다운로드해 주세요.");

      // 개별 다운로드 시도
      try {
        document.getElementById("confirmation-pdf-download")?.click();
        setTimeout(() => {
          document.getElementById("calculation-pdf-download")?.click();
          setTimeout(() => {
            document.getElementById("detail-pdf-download")?.click();
          }, 1000);
        }, 1000);
      } catch (clickError) {
        console.error("버튼 클릭 오류:", clickError);
      }
    } finally {
      setDownloadingAll(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex space-x-2">
            <button
              onClick={() => handleTabChange("confirmation")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "confirmation"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              보수확인서
            </button>
            <button
              onClick={() => handleTabChange("calculation")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "calculation"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              물량산출근거
            </button>
            <button
              onClick={() => handleTabChange("detail")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "detail"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              내역서
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleGenerateAllPDF}
              disabled={downloadingAll}
              className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400"
            >
              {downloadingAll ? "PDF 생성 중..." : "전체 PDF 다운로드"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              닫기
            </button>
          </div>
        </div>

        <div className="flex-1">
          {activeTab === "confirmation" && (
            <RepairConfirmationPDF
              data={documentData.confirmation}
              onClose={onClose}
            />
          )}

          {activeTab === "calculation" && (
            <QuantityCalculationPDF
              data={documentData.calculation}
              onClose={onClose}
            />
          )}

          {activeTab === "detail" && (
            <DetailStatementPDF data={documentData.detail} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RepairDocumentSetPDF;
