import axios from 'axios'
import api from './index'

// 지시 관리 관련 API 함수
export const instructionAPI = {
  // 지시 목록 조회
  getInstructions: async (params = {}) => {
    // 백엔드 연동 전 임시 데이터
    const mockInstructions = [
      {
        id: 'INS-2025-042',
        title: '강북구 수도관 보수',
        location: '강북구 미아동 123-45',
        status: '진행중',
        priority: '높음',
        createdAt: '2025-04-10',
        dueDate: '2025-04-20',
        assignedTo: '김철수'
      },
      {
        id: 'INS-2025-041',
        title: '서초구 도로 보수',
        location: '서초구 서초동 456-78',
        status: '완료',
        priority: '중간',
        createdAt: '2025-04-08',
        dueDate: '2025-04-15',
        assignedTo: '박영희'
      },
      {
        id: 'INS-2025-040',
        title: '마포구 가로등 교체',
        location: '마포구 합정동 789-12',
        status: '완료',
        priority: '낮음',
        createdAt: '2025-04-05',
        dueDate: '2025-04-12',
        assignedTo: '이민수'
      },
      {
        id: 'INS-2025-039',
        title: '강남구 하수구 정비',
        location: '강남구 역삼동 234-56',
        status: '대기중',
        priority: '높음',
        createdAt: '2025-04-03',
        dueDate: '2025-04-18',
        assignedTo: '최지영'
      },
      {
        id: 'INS-2025-038',
        title: '송파구 보도블럭 교체',
        location: '송파구 잠실동 345-67',
        status: '진행중',
        priority: '중간',
        createdAt: '2025-04-01',
        dueDate: '2025-04-16',
        assignedTo: '김철수'
      }
    ]
    
    // 실제 구현 시 아래 코드 사용
    // const response = await api.get('/instructions', { params })
    // return response.data
    
    return mockInstructions
  },
  
  // 지시 상세 조회
  getInstructionDetail: async (id) => {
    // 백엔드 연동 전 임시 데이터
    const mockInstructionDetail = {
      id: 'INS-2025-042',
      title: '강북구 수도관 보수',
      description: '강북구 미아동 123-45 인근 수도관 누수 현상으로 인한 긴급 보수 작업',
      location: '강북구 미아동 123-45',
      status: '진행중',
      priority: '높음',
      createdAt: '2025-04-10',
      dueDate: '2025-04-20',
      assignedTo: '김철수',
      budget: 2500000,
      materials: [
        { name: '수도관 파이프', quantity: 5, unit: '개' },
        { name: '밸브', quantity: 2, unit: '개' },
        { name: '시멘트', quantity: 3, unit: '포대' }
      ],
      attachments: [
        { name: '현장사진1.jpg', url: '/attachments/현장사진1.jpg' },
        { name: '설계도면.pdf', url: '/attachments/설계도면.pdf' }
      ],
      works: [
        { id: 'WRK-2025-089', name: '수도관 교체 작업', status: '진행중', assignedTo: '김철수' },
        { id: 'WRK-2025-090', name: '도로 복구 작업', status: '대기중', assignedTo: '박영희' }
      ],
      history: [
        { date: '2025-04-10', action: '지시 생성', user: '관리자' },
        { date: '2025-04-11', action: '작업 할당', user: '관리자' },
        { date: '2025-04-12', action: '작업 시작', user: '김철수' }
      ]
    }
    
    // 실제 구현 시 아래 코드 사용
    // const response = await api.get(`/instructions/${id}`)
    // return response.data
    
    return mockInstructionDetail
  },
  
  // 지시 생성
  createInstruction: async (instructionData) => {
    // 백엔드 연동 전 임시 로직
    const newInstruction = {
      id: `INS-2025-${Math.floor(Math.random() * 1000)}`,
      ...instructionData,
      createdAt: new Date().toISOString().split('T')[0],
      status: '대기중'
    }
    
    // 실제 구현 시 아래 코드 사용
    // const response = await api.post('/instructions', instructionData)
    // return response.data
    
    return newInstruction
  },
  
  // 지시 업데이트
  updateInstruction: async (id, instructionData) => {
    // 백엔드 연동 전 임시 로직
    const updatedInstruction = {
      id,
      ...instructionData,
      updatedAt: new Date().toISOString().split('T')[0]
    }
    
    // 실제 구현 시 아래 코드 사용
    // const response = await api.put(`/instructions/${id}`, instructionData)
    // return response.data
    
    return updatedInstruction
  },
  
  // 지시 삭제
  deleteInstruction: async (id) => {
    // 백엔드 연동 전 임시 로직
    const success = true
    
    // 실제 구현 시 아래 코드 사용
    // await api.delete(`/instructions/${id}`)
    // return id
    
    return id
  }
}
