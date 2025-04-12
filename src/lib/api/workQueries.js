import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// 작업 관리 관련 React Query 훅
export const useWorkQueries = () => {
  const queryClient = useQueryClient()

  // 작업 목록 조회 쿼리
  const useWorks = (params = {}) => {
    return useQuery(['works', params], async () => {
      // 백엔드 연동 전 임시 데이터
      const mockWorks = [
        {
          id: 'WRK-2025-089',
          name: '수도관 교체 작업',
          instructionId: 'INS-2025-042',
          instructionTitle: '강북구 수도관 보수',
          location: '강북구 미아동 123-45',
          status: '진행중',
          startDate: '2025-04-12',
          endDate: '2025-04-15',
          assignedTo: '김철수',
          completionRate: 60
        },
        {
          id: 'WRK-2025-088',
          name: '도로 포장 작업',
          instructionId: 'INS-2025-041',
          instructionTitle: '서초구 도로 보수',
          location: '서초구 서초동 456-78',
          status: '완료',
          startDate: '2025-04-09',
          endDate: '2025-04-11',
          assignedTo: '박영희',
          completionRate: 100
        },
        {
          id: 'WRK-2025-087',
          name: '가로등 설치',
          instructionId: 'INS-2025-040',
          instructionTitle: '마포구 가로등 교체',
          location: '마포구 합정동 789-12',
          status: '완료',
          startDate: '2025-04-06',
          endDate: '2025-04-08',
          assignedTo: '이민수',
          completionRate: 100
        },
        {
          id: 'WRK-2025-086',
          name: '하수구 청소',
          instructionId: 'INS-2025-039',
          instructionTitle: '강남구 하수구 정비',
          location: '강남구 역삼동 234-56',
          status: '대기중',
          startDate: null,
          endDate: null,
          assignedTo: '최지영',
          completionRate: 0
        },
        {
          id: 'WRK-2025-085',
          name: '보도블럭 교체',
          instructionId: 'INS-2025-038',
          instructionTitle: '송파구 보도블럭 교체',
          location: '송파구 잠실동 345-67',
          status: '진행중',
          startDate: '2025-04-03',
          endDate: '2025-04-10',
          assignedTo: '김철수',
          completionRate: 75
        }
      ]
      
      // 실제 구현 시 아래 코드 사용
      // const response = await api.get('/works', { params })
      // return response.data
      
      return mockWorks
    })
  }
  
  // 작업 상세 조회 쿼리
  const useWorkDetail = (id) => {
    return useQuery(['work', id], async () => {
      if (!id) return null
      
      // 백엔드 연동 전 임시 데이터
      const mockWorkDetail = {
        id: 'WRK-2025-089',
        name: '수도관 교체 작업',
        description: '강북구 미아동 123-45 인근 수도관 누수 현상으로 인한 교체 작업',
        instructionId: 'INS-2025-042',
        instructionTitle: '강북구 수도관 보수',
        location: '강북구 미아동 123-45',
        status: '진행중',
        startDate: '2025-04-12',
        endDate: '2025-04-15',
        assignedTo: '김철수',
        completionRate: 60,
        workHours: 24,
        cost: 1500000,
        materials: [
          { name: '수도관 파이프', quantity: 3, unit: '개', used: 2 },
          { name: '밸브', quantity: 2, unit: '개', used: 1 },
          { name: '시멘트', quantity: 3, unit: '포대', used: 2 }
        ],
        dailyReports: [
          { 
            date: '2025-04-12', 
            workHours: 8, 
            description: '수도관 파이프 교체 작업 시작', 
            completionRate: 20,
            issues: '지하 파이프 접근 어려움'
          },
          { 
            date: '2025-04-13', 
            workHours: 8, 
            description: '밸브 교체 및 파이프 연결 작업', 
            completionRate: 40,
            issues: ''
          },
          { 
            date: '2025-04-14', 
            workHours: 8, 
            description: '누수 테스트 및 보강 작업', 
            completionRate: 60,
            issues: '일부 연결부 누수 발견, 재작업 필요'
          }
        ],
        attachments: [
          { name: '작업사진1.jpg', url: '/attachments/작업사진1.jpg' },
          { name: '작업보고서.pdf', url: '/attachments/작업보고서.pdf' }
        ],
        history: [
          { date: '2025-04-11', action: '작업 생성', user: '관리자' },
          { date: '2025-04-12', action: '작업 시작', user: '김철수' },
          { date: '2025-04-14', action: '진행상황 업데이트', user: '김철수' }
        ]
      }
      
      // 실제 구현 시 아래 코드 사용
      // const response = await api.get(`/works/${id}`)
      // return response.data
      
      return mockWorkDetail
    }, {
      enabled: !!id // id가 있을 때만 쿼리 실행
    })
  }
  
  // 작업 생성 뮤테이션
  const useCreateWork = () => {
    return useMutation(
      async (workData) => {
        // 백엔드 연동 전 임시 로직
        const newWork = {
          id: `WRK-2025-${Math.floor(Math.random() * 1000)}`,
          ...workData,
          createdAt: new Date().toISOString().split('T')[0],
          status: '대기중',
          completionRate: 0
        }
        
        // 실제 구현 시 아래 코드 사용
        // const response = await api.post('/works', workData)
        // return response.data
        
        return newWork
      },
      {
        onSuccess: () => {
          // 작업 목록 쿼리 무효화하여 재요청
          queryClient.invalidateQueries(['works'])
        }
      }
    )
  }
  
  // 작업 업데이트 뮤테이션
  const useUpdateWork = () => {
    return useMutation(
      async ({ id, data }) => {
        // 백엔드 연동 전 임시 로직
        const updatedWork = {
          id,
          ...data,
          updatedAt: new Date().toISOString().split('T')[0]
        }
        
        // 실제 구현 시 아래 코드 사용
        // const response = await api.put(`/works/${id}`, data)
        // return response.data
        
        return updatedWork
      },
      {
        onSuccess: (data) => {
          // 작업 목록과 상세 쿼리 모두 무효화
          queryClient.invalidateQueries(['works'])
          queryClient.invalidateQueries(['work', data.id])
        }
      }
    )
  }
  
  // 작업 삭제 뮤테이션
  const useDeleteWork = () => {
    return useMutation(
      async (id) => {
        // 백엔드 연동 전 임시 로직
        const success = true
        
        // 실제 구현 시 아래 코드 사용
        // await api.delete(`/works/${id}`)
        // return id
        
        return id
      },
      {
        onSuccess: () => {
          // 작업 목록 쿼리 무효화
          queryClient.invalidateQueries(['works'])
        }
      }
    )
  }
  
  // 일일 작업 보고서 추가 뮤테이션
  const useAddDailyReport = () => {
    return useMutation(
      async ({ workId, reportData }) => {
        // 백엔드 연동 전 임시 로직
        const newReport = {
          id: Math.floor(Math.random() * 10000),
          workId,
          ...reportData,
          date: reportData.date || new Date().toISOString().split('T')[0]
        }
        
        // 실제 구현 시 아래 코드 사용
        // const response = await api.post(`/works/${workId}/reports`, reportData)
        // return response.data
        
        return newReport
      },
      {
        onSuccess: (data) => {
          // 작업 상세 쿼리 무효화
          queryClient.invalidateQueries(['work', data.workId])
        }
      }
    )
  }

  return {
    useWorks,
    useWorkDetail,
    useCreateWork,
    useUpdateWork,
    useDeleteWork,
    useAddDailyReport
  }
}
