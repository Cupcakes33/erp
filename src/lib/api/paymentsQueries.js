import { useQuery } from "@tanstack/react-query";
import {
  getContracts,
  getPayments,
  getPaymentDetail,
} from "./paymentsApi"; // 경로 수정: 동일 디렉토리 내의 paymentsApi.js를 참조

// 쿼리 키 정의
const PAYMENTS_CONTRACTS_KEY = "paymentContracts";
const PAYMENTS_KEY = "payments";
const PAYMENT_DETAIL_KEY = "paymentDetail";

/**
 * 계약 목록 조회 React Query 훅
 * @param {object} params - API 요청 파라미터 (예: { center: "강동" })
 * @param {object} options - React Query 옵션
 */
export const useGetContracts = (params, options) => {
  return useQuery({
    queryKey: [PAYMENTS_CONTRACTS_KEY, params],
    queryFn: () => getContracts(params),
    // select: (data) => data, // 기본적으로 API 함수가 response.data.data를 반환하므로 추가 변환 불필요시 생략 가능
    ...options,
  });
};

/**
 * 기성회차 목록 조회 React Query 훅
 * @param {object} params - API 요청 파라미터 (예: { contractId: 1 })
 * @param {object} options - React Query 옵션
 */
export const useGetPayments = (params, options) => {
  return useQuery({
    queryKey: [PAYMENTS_KEY, params],
    queryFn: () => getPayments(params),
    enabled: !!params?.contractId, // contractId가 있을 때만 쿼리 실행
    // select: (data) => data,
    ...options,
  });
};

/**
 * 특정 기성회차에 대한 작업/보수지시 상세 목록 조회 React Query 훅.
 * (API 함수 getPaymentDetail이 해당 데이터를 반환합니다)
 * @param {number} id - 기성회차 ID
 * @param {object} options - React Query 옵션
 * @returns {UseQueryResult<Array<object>>} 특정 기성회차에 연결된 작업/보수지시 상세 객체들의 배열.
 * 각 객체는 예시로 round, center, orderId, materialCost 등의 필드를 포함할 수 있습니다.
 */
export const useGetPaymentDetail = (id, options) => {
  return useQuery({
    queryKey: [PAYMENT_DETAIL_KEY, id],
    queryFn: () => getPaymentDetail(id), // getPaymentDetail은 이제 작업/보수지시 상세 목록을 가져옴
    enabled: !!id, // id가 있을 때만 쿼리 실행
    ...options,
  });
}; 