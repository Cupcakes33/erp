import axios from 'axios'

// API 기본 URL 설정 (실제 환경에서는 .env 파일에서 가져와야 함)
const API_URL = import.meta.env.VITE_API_URL || '/api'

// mockAPI 지연 시간 설정 (ms)
const MOCK_DELAY = 500

// 모의 데이터 - 실제 API 연동 전까지 사용
const mockUnitPrices = [
  {
    id: 1,
    code: 'UNP-001',
    name: '아스팔트 포장',
    spec: '두께 50mm',
    unit: '㎡',
    matrerial_cost: 15000,
    labor_cost: 25000,
    expense: 5000,
    total_cost: 45000
  },
  {
    id: 2,
    code: 'UNP-002',
    name: '보도블럭 설치',
    spec: '300x300mm',
    unit: '㎡',
    matrerial_cost: 20000,
    labor_cost: 30000,
    expense: 3000,
    total_cost: 53000
  },
  {
    id: 3,
    code: 'UNP-003',
    name: '가로등 교체',
    spec: 'LED 100W',
    unit: '개',
    matrerial_cost: 150000,
    labor_cost: 50000,
    expense: 10000,
    total_cost: 210000
  },
  {
    id: 4,
    code: 'UNP-004',
    name: '맨홀 정비',
    spec: '직경 600mm',
    unit: '개',
    matrerial_cost: 70000,
    labor_cost: 40000,
    expense: 5000,
    total_cost: 115000
  },
  {
    id: 5,
    code: 'UNP-005',
    name: '수도관 교체',
    spec: '직경 100mm',
    unit: 'm',
    matrerial_cost: 25000,
    labor_cost: 35000,
    expense: 5000,
    total_cost: 65000
  }
]

// 이전 코드와의 호환성을 위해 mockWorks를 mockUnitPrices의 별칭으로 유지
const mockWorks = mockUnitPrices.map(unitPrice => ({
  id: `W-${String(unitPrice.id).padStart(3, '0')}`,
  typeId: unitPrice.code,
  typeName: unitPrice.name,
  specification: unitPrice.spec,
  unit: unitPrice.unit,
  materialCost: unitPrice.matrerial_cost,
  laborCost: unitPrice.labor_cost,
  expenseCost: unitPrice.expense,
  totalCost: unitPrice.total_cost
}));

/**
 * 일위대가 목록을 조회하는 API
 * @param {Object} params - 검색 및 페이징 파라미터
 * @param {string} params.keyword - 검색어 (공종명)
 * @param {number} params.page - 페이지 번호
 * @param {number} params.size - 페이지 크기
 * @returns {Promise<Object>} 일위대가 목록
 */
export const fetchUnitPrices = async (params = {}) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 검색어 기반 필터링
        let filteredData = [...mockUnitPrices];
        if (params.keyword) {
          const keyword = params.keyword.toLowerCase();
          filteredData = filteredData.filter(item => 
            item.name.toLowerCase().includes(keyword)
          );
        }
        
        // 페이징 처리
        const page = params.page || 1;
        const size = params.size || 10;
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        
        resolve({
          message: "요청 성공",
          data: {
            unitpriceList: {
              unitPrice: paginatedData
            }
          }
        });
      }, MOCK_DELAY);
    });
  }

  // 실제 API 호출
  try {
    const response = await axios.get(`${API_URL}/unit-price`, { params });
    return response.data;
  } catch (error) {
    console.error('일위대가 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 일위대가 상세 정보를 조회하는 API
 * @param {number} id - 일위대가 ID
 * @returns {Promise<Object>} 일위대가 상세 정보
 */
export const fetchUnitPriceById = async (id) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const unitPrice = mockUnitPrices.find(item => item.id === Number(id));
        if (unitPrice) {
          resolve({
            message: "요청 성공",
            data: {
              unitPrice: { ...unitPrice }
            }
          });
        } else {
          reject({
            message: "일위대가를 찾을 수 없습니다."
          });
        }
      }, MOCK_DELAY);
    });
  }

  // 실제 API 호출
  try {
    const response = await axios.get(`${API_URL}/unit-price/${id}`);
    return response.data;
  } catch (error) {
    console.error(`일위대가 ID ${id} 조회 실패:`, error);
    throw error;
  }
};

/**
 * 일위대가를 생성하는 API
 * @param {Object} unitPriceData - 일위대가 데이터
 * @returns {Promise<Object>} 생성된 일위대가 정보
 */
export const createUnitPrice = async (unitPriceData) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = mockUnitPrices.length + 1;
        const newUnitPrice = {
          id: newId,
          ...unitPriceData.unitPrice,
          total_cost: Number(unitPriceData.unitPrice.matrerial_cost || 0) + 
                      Number(unitPriceData.unitPrice.labor_cost || 0) + 
                      Number(unitPriceData.unitPrice.expense || 0)
        };
        
        mockUnitPrices.push(newUnitPrice);
        
        resolve({
          message: "요청 성공",
          data: {
            unitPrice: { ...newUnitPrice }
          }
        });
      }, MOCK_DELAY);
    });
  }

  // 실제 API 호출
  try {
    const response = await axios.post(`${API_URL}/unit-price/`, unitPriceData);
    return response.data;
  } catch (error) {
    console.error('일위대가 생성 실패:', error);
    throw error;
  }
};

/**
 * 일위대가를 수정하는 API
 * @param {number} id - 일위대가 ID
 * @param {Object} unitPriceData - 수정할 일위대가 데이터
 * @returns {Promise<Object>} 수정된 일위대가 정보
 */
export const updateUnitPrice = async (id, unitPriceData) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockUnitPrices.findIndex(item => item.id === Number(id));
        if (index !== -1) {
          const updatedData = unitPriceData.unitPrice;
          const updatedUnitPrice = {
            ...mockUnitPrices[index],
            ...updatedData,
            total_cost: Number(updatedData.matrerial_cost || mockUnitPrices[index].matrerial_cost) + 
                        Number(updatedData.labor_cost || mockUnitPrices[index].labor_cost) + 
                        Number(updatedData.expense || mockUnitPrices[index].expense)
          };
          
          mockUnitPrices[index] = updatedUnitPrice;
          
          resolve({
            message: "요청 성공",
            data: {
              unitPrice: { ...updatedUnitPrice }
            }
          });
        } else {
          reject({
            message: "일위대가를 찾을 수 없습니다."
          });
        }
      }, MOCK_DELAY);
    });
  }

  // 실제 API 호출
  try {
    const response = await axios.put(`${API_URL}/unit-price/${id}`, unitPriceData);
    return response.data;
  } catch (error) {
    console.error(`일위대가 ID ${id} 수정 실패:`, error);
    throw error;
  }
};

/**
 * 일위대가를 삭제하는 API
 * @param {number} id - 일위대가 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteUnitPrice = async (id) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockUnitPrices.findIndex(item => item.id === Number(id));
        if (index !== -1) {
          mockUnitPrices.splice(index, 1);
          resolve({
            message: "요청 성공",
            data: {}
          });
        } else {
          reject({
            message: "일위대가를 찾을 수 없습니다."
          });
        }
      }, MOCK_DELAY);
    });
  }

  // 실제 API 호출
  try {
    const response = await axios.delete(`${API_URL}/unit-price/${id}`);
    return response.data;
  } catch (error) {
    console.error(`일위대가 ID ${id} 삭제 실패:`, error);
    throw error;
  }
};

/**
 * 모든 작업 목록을 가져오는 함수
 * @returns {Promise<Array>} 작업 배열
 */
export const fetchWorks = async () => {
  // 디버깅을 위한 로그
  console.log("[workAPI] fetchWorks 함수 호출됨");
  
  // mockWorks 사용
  console.log("[workAPI] mock 데이터 사용 - mockWorks:", mockWorks);
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = [...mockWorks]; // 배열 복사본 생성
      console.log("[workAPI] 반환할 데이터:", result);
      resolve(result);
    }, 500);
  });
};

/**
 * 특정 작업 정보를 가져오는 함수
 * @param {string} id 작업 ID
 * @returns {Promise<Object>} 작업 정보
 */
export const fetchWorkById = async (id) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const work = mockWorks.find(w => w.id === id)
        if (work) {
          resolve({ ...work })
        } else {
          reject(new Error('작업을 찾을 수 없습니다.'))
        }
      }, MOCK_DELAY)
    })
  }

  // 실제 API 호출
  try {
    const response = await axios.get(`${API_URL}/works/${id}`)
    return response.data
  } catch (error) {
    console.error(`작업 ID ${id} 가져오기 실패:`, error)
    throw error
  }
}

/**
 * 새 작업을 생성하는 함수
 * @param {Object} workData 작업 데이터
 * @returns {Promise<Object>} 생성된 작업 정보
 */
export const createWork = async (workData) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = `W-${String(mockWorks.length + 1).padStart(3, '0')}`
        const newWork = {
          id: newId,
          ...workData,
          totalCost: Number(workData.materialCost || 0) + Number(workData.laborCost || 0) + Number(workData.expenseCost || 0)
        }
        mockWorks.push(newWork)
        resolve({ ...newWork })
      }, MOCK_DELAY)
    })
  }

  // 실제 API 호출
  try {
    const response = await axios.post(`${API_URL}/works`, workData)
    return response.data
  } catch (error) {
    console.error('작업 생성 실패:', error)
    throw error
  }
}

/**
 * 작업 정보를 수정하는 함수
 * @param {string} id 작업 ID
 * @param {Object} workData 업데이트할 작업 데이터
 * @returns {Promise<Object>} 수정된 작업 정보
 */
export const updateWork = async (id, workData) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockWorks.findIndex(w => w.id === id)
        if (index !== -1) {
          const updatedWork = {
            ...mockWorks[index],
            ...workData,
            totalCost: 
              Number(workData.materialCost !== undefined ? workData.materialCost : mockWorks[index].materialCost) +
              Number(workData.laborCost !== undefined ? workData.laborCost : mockWorks[index].laborCost) +
              Number(workData.expenseCost !== undefined ? workData.expenseCost : mockWorks[index].expenseCost)
          }
          mockWorks[index] = updatedWork
          resolve({ ...updatedWork })
        } else {
          reject(new Error('작업을 찾을 수 없습니다.'))
        }
      }, MOCK_DELAY)
    })
  }

  // 실제 API 호출
  try {
    const response = await axios.put(`${API_URL}/works/${id}`, workData)
    return response.data
  } catch (error) {
    console.error(`작업 ID ${id} 수정 실패:`, error)
    throw error
  }
}

/**
 * 작업을 삭제하는 함수
 * @param {string} id 작업 ID
 * @returns {Promise<string>} 삭제된 작업 ID
 */
export const deleteWork = async (id) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockWorks.findIndex(w => w.id === id)
        if (index !== -1) {
          mockWorks.splice(index, 1)
          resolve(id)
        } else {
          reject(new Error('작업을 찾을 수 없습니다.'))
        }
      }, MOCK_DELAY)
    })
  }

  // 실제 API 호출
  try {
    await axios.delete(`${API_URL}/works/${id}`)
    return id
  } catch (error) {
    console.error(`작업 ID ${id} 삭제 실패:`, error)
    throw error
  }
}

/**
 * 특정 지시에 포함된 작업 목록을 가져오는 함수
 * @param {string} instructionId 지시 ID
 * @returns {Promise<Array>} 작업 배열
 */
export const fetchWorksByInstruction = async (instructionId) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 실제로는 백엔드에서 필터링하지만, 여기서는 간단한 모의 구현
        const filteredWorks = mockWorks.filter((_, index) => index < 3)
        resolve(filteredWorks)
      }, MOCK_DELAY)
    })
  }

  // 실제 API 호출
  try {
    const response = await axios.get(`${API_URL}/instructions/${instructionId}/works`)
    return response.data
  } catch (error) {
    console.error(`지시 ID ${instructionId}의 작업 목록 가져오기 실패:`, error)
    throw error
  }
}

/**
 * 일일 작업 보고서 추가하는 함수
 * @param {string} workId 작업 ID
 * @param {Object} reportData 보고서 데이터
 * @returns {Promise<Object>} 생성된 보고서 정보
 */
export const addDailyReport = async (workId, reportData) => {
  // 개발 환경에서는 모의 데이터 사용
  if (import.meta.env.DEV) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReport = {
          id: Math.floor(Math.random() * 10000),
          workId,
          ...reportData,
          date: reportData.date || new Date().toISOString().split('T')[0]
        }
        resolve(newReport)
      }, MOCK_DELAY)
    })
  }

  // 실제 API 호출
  try {
    const response = await axios.post(`${API_URL}/works/${workId}/reports`, reportData)
    return response.data
  } catch (error) {
    console.error(`작업 ID ${workId}에 보고서 추가 실패:`, error)
    throw error
  }
}
