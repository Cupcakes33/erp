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

// 작업자 매출 조회 (mock)
export const getWorkerSales = async (params) => {
  console.log("Fetching worker sales with params:", params)
  // Mock data
  const mockData = [
    { id: 1, name: "홍길동", sales: 1200000 },
    { id: 2, name: "김철수", sales: 2500000 },
    { id: 3, name: "이영희", sales: 850000 },
    { id: 4, name: "박보검", sales: 3100000 },
    { id: 5, name: "송혜교", sales: 1750000 },
  ];

  // Mock filtering
  let filteredData = mockData;
  if (params?.name) {
    filteredData = filteredData.filter(item => item.name.includes(params.name));
  }
  
  // Mock API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    data: filteredData,
    totalCount: filteredData.length,
    totalPage: 1,
    currentPage: 1,
  };
};
