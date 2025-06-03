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