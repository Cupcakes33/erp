import api from "."

/**
 * 작업자 목록을 조회하는 API
 * @returns {Promise<Object>} 작업자 목록
 */
export const fetchWorkers = async () => {
  try {
    const response = await api.get(`/worker`)
    return response.data
  } catch (error) {
    console.error("작업자 목록 조회 실패:", error)
    throw error
  }
}

/**
 * 작업자를 생성하는 API
 * @param {Object} workerData - 작업자 데이터
 * @param {string} workerData.name - 작업자 이름
 * @returns {Promise<Object>} 생성된 작업자 정보
 */
export const createWorker = async (workerData) => {
  try {
    const response = await api.post(`/worker`, workerData)
    return response.data
  } catch (error) {
    console.error("작업자 생성 실패:", error)
    throw error
  }
}

/**
 * 작업자 정보를 수정하는 API
 * @param {number} id - 작업자 ID
 * @param {Object} workerData - 수정할 작업자 데이터
 * @returns {Promise<Object>} 수정된 작업자 정보
 */
export const updateWorker = async (id, workerData) => {
  try {
    const response = await api.put(`/worker/${id}`, workerData)
    return response.data
  } catch (error) {
    console.error(`작업자 ID ${id} 수정 실패:`, error)
    throw error
  }
}

// 작업자 매출 조회 (API 연동)
export const getWorkerSales = async (params) => {
  // params: { start, end, worker } 또는 { startDate, endDate, ... }
  // start, end 보정
  let start = params?.start;
  let end = params?.end;
  if (!start && params?.startDate) start = params.startDate;
  if (!end && params?.endDate) end = params.endDate;
  const query = new URLSearchParams();
  if (start) query.append('start', start);
  if (end) query.append('end', end);
  if (params?.worker) query.append('worker', params.worker);

  const response = await api.get(`/payment/worker?${query.toString()}`);
  // API 응답 구조에 따라 아래를 조정하세요
  return {
    data: response.data?.data || [],
    totalCount: response.data?.totalCount || 0,
    totalPage: response.data?.totalPage || 1,
    currentPage: response.data?.currentPage || 1,
  };
};
