import api from "@/lib/api";

/**
 * 계약 목록 조회
 * GET /api/contract
 * @param {object} params - 요청 파라미터
 * @param {string} params.center - 지점 (쿼리 파라미터)
 * @returns {Promise<Array<object>>} 계약 목록 데이터
 */
export const getContracts = async (params) => {
  const response = await api.get("/contract", { params });
  return response.data.data; // { data: [...], message: "..." } 형태를 가정
};

/**
 * 기성회차 목록 조회
 * GET /api/payment
 * @param {object} params - 요청 파라미터
 * @param {number} params.contractId - 계약 ID (쿼리 파라미터, 필수)
 * @returns {Promise<Array<object>>} 기성회차 목록 데이터
 */
export const getPayments = async (params) => {
  if (!params || typeof params.contractId === 'undefined') {
    throw new Error("contractId is required for getPayments");
  }
  const response = await api.get("/payment", { params });
  return response.data.data; // 응답 명세가 없어 추정, { data: [...], message: "..." } 형태를 가정
};

/**
 * 특정 기성회차에 대한 작업/보수지시 상세 목록 조회
 * (이전에는 "기성회차 상세 조회"로 불렸으나, 사용자의 curl 예시를 통해
 *  orderId, materialCost 등을 포함하는 작업 상세 목록임이 명확해짐)
 * GET /api/payment/{id}
 * @param {number} id - 기성회차 ID (경로 파라미터)
 * @returns {Promise<Array<object>>} 특정 기성회차에 연결된 작업/보수지시 상세 객체들의 배열.
 * 각 객체는 예시로 round, center, orderId, orderNumber, orderDate, materialCost, laborCost, expenseCost, totalCost 등의 필드를 포함할 수 있습니다.
 */
export const getPaymentDetail = async (id) => {
  const response = await api.get(`/payment/${id}`);
  // 사용자의 세 번째 curl 예시 ('GET /api/payment/0')에 따르면
  // response.data.data는 orderId, materialCost 등을 포함하는 객체들의 배열입니다.
  return response.data.data;
};

export const getPaymentDocumentData = async (paymentId) => {
  const { data } = await api.get(`/payments/${paymentId}/documents`);
  return data;
};

// 공종별 금액 조회
export const getPaymentsByTrade = async (params) => {
  console.log("Fetching payments by trade with params:", params);

  const mockData = [
    { id: 1, type: "재료비", code: "MAT-001", tradeName: "시멘트", unitPriceSum: 500000, cumulative: 2500000 },
    { id: 2, type: "노무비", code: "LAB-001", tradeName: "보통인부", unitPriceSum: 1200000, cumulative: 10200000 },
    { id: 3, type: "경비", code: "EXP-001", tradeName: "운반비", unitPriceSum: 150000, cumulative: 800000 },
    { id: 4, type: "재료비", code: "MAT-002", tradeName: "모래", unitPriceSum: 300000, cumulative: 1500000 },
    { id: 5, type: "노무비", code: "LAB-002", tradeName: "특별인부", unitPriceSum: 1800000, cumulative: 15000000 },
  ];

  let filteredData = mockData;
  if (params?.tradeName) {
    filteredData = filteredData.filter(item => item.tradeName.includes(params.tradeName));
  }
  if (params?.type && params.type !== "all") {
    // Assuming type is '재료비', '노무비', '경비'
    const typeMap = { material: "재료비", labor: "노무비", expense: "경비" };
    filteredData = filteredData.filter(item => item.type === typeMap[params.type]);
  }

  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    data: filteredData,
    totalCount: filteredData.length,
    totalPage: 1,
    currentPage: 1,
  };
}; 