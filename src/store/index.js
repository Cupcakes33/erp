import create from 'zustand';

// 인증 스토어
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  // 로그인
  login: (credentials) => {
    set({ isLoading: true, error: null });
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      // 간단한 인증 체크 (실제 구현에서는 서버에서 검증)
      if (credentials.username === 'admin' && credentials.password === 'admin') {
        const user = {
          id: 1,
          username: 'admin',
          name: '관리자',
          role: 'admin'
        };
        
        // JWT 토큰 저장 (실제 구현에서는 서버에서 발급받은 토큰 사용)
        localStorage.setItem('token', 'mock-jwt-token');
        
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        set({ 
          isLoading: false, 
          error: '아이디 또는 비밀번호가 올바르지 않습니다.' 
        });
      }
    }, 500);
  },
  
  // 로그아웃
  logout: () => {
    // 토큰 제거
    localStorage.removeItem('token');
    
    set({ 
      user: null, 
      isAuthenticated: false 
    });
  },
  
  // 인증 상태 확인
  checkAuth: () => {
    set({ isLoading: true });
    
    // 실제 구현에서는 토큰 유효성 검증
    const token = localStorage.getItem('token');
    
    if (token) {
      // 토큰이 있으면 사용자 정보 설정 (실제 구현에서는 토큰 검증 후 사용자 정보 가져오기)
      const user = {
        id: 1,
        username: 'admin',
        name: '관리자',
        role: 'admin'
      };
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } else {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  }
}));

// 지시 관리 스토어
export const useInstructionStore = create((set, get) => ({
  instructions: [
    {
      id: 'INS-2025-0001',
      title: '강북구 도로 보수 지시',
      priority: '높음',
      status: '진행중',
      dueDate: '2025-04-15',
      location: '강북구 수유동',
      budget: 5000000,
      manager: '홍길동',
      description: '강북구 수유동 일대의 도로 파손이 심각하여 긴급 보수 작업이 필요합니다. 우천시 안전사고 위험이 있으니 신속히 처리해주세요.',
      createdAt: '2025-03-20',
      updatedAt: '2025-03-25'
    },
    {
      id: 'INS-2025-0002',
      title: '서초구 가로등 교체 지시',
      priority: '중간',
      status: '대기중',
      dueDate: '2025-04-20',
      location: '서초구 반포대로',
      budget: 3000000,
      manager: '김영수',
      description: '서초구 반포대로의 가로등이 노후화되어 교체가 필요합니다. LED 가로등으로 교체하여 에너지 효율을 높이고 밝기를 개선해주세요.',
      createdAt: '2025-03-22',
      updatedAt: '2025-03-22'
    },
    {
      id: 'INS-2025-0003',
      title: '강남구 보도블럭 교체 지시',
      priority: '중간',
      status: '완료',
      dueDate: '2025-03-30',
      location: '강남구 삼성동',
      budget: 2000000,
      manager: '박철수',
      description: '강남구 삼성동 일대의 보도블럭이 파손되어 보행자 안전을 위협하고 있습니다. 파손된 보도블럭을 교체하고 주변 정비를 진행해주세요.',
      createdAt: '2025-03-05',
      updatedAt: '2025-03-30'
    }
  ],
  currentInstruction: null,
  isLoading: false,
  error: null,
  
  // 지시 목록 로드
  loadInstructions: () => {
    set({ isLoading: true });
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      set({ isLoading: false });
    }, 500);
  },
  
  // 특정 지시 로드
  loadInstruction: (id) => {
    set({ isLoading: true });
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      const instruction = get().instructions.find(instruction => instruction.id === id);
      set({ currentInstruction: instruction, isLoading: false });
    }, 500);
  },
  
  // 지시 생성
  createInstruction: (instructionData) => {
    set({ isLoading: true });
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      const newInstruction = {
        id: `INS-2025-${String(get().instructions.length + 1).padStart(4, '0')}`,
        ...instructionData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      
      set(state => ({
        instructions: [...state.instructions, newInstruction],
        isLoading: false
      }));
    }, 500);
  },
  
  // 지시 수정
  updateInstruction: (id, instructionData) => {
    set({ isLoading: true });
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      set(state => ({
        instructions: state.instructions.map(instruction => 
          instruction.id === id 
            ? { 
                ...instruction, 
                ...instructionData, 
                updatedAt: new Date().toISOString().split('T')[0] 
              } 
            : instruction
        ),
        currentInstruction: state.currentInstruction && state.currentInstruction.id === id 
          ? { 
              ...state.currentInstruction, 
              ...instructionData, 
              updatedAt: new Date().toISOString().split('T')[0] 
            } 
          : state.currentInstruction,
        isLoading: false
      }));
    }, 500);
  },
  
  // 지시 삭제
  deleteInstruction: (id) => {
    set({ isLoading: true });
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      set(state => ({
        instructions: state.instructions.filter(instruction => instruction.id !== id),
        currentInstruction: state.currentInstruction && state.currentInstruction.id === id ? null : state.currentInstruction,
        isLoading: false
      }));
    }, 500);
  },
  
  // 엑셀 가져오기
  importInstructions: (instructionList) => {
    set({ isLoading: true });
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      const newInstructions = instructionList.map((instruction, index) => ({
        id: `INS-2025-${String(get().instructions.length + index + 1).padStart(4, '0')}`,
        ...instruction,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }));
      
      set(state => ({
        instructions: [...state.instructions, ...newInstructions],
        isLoading: false
      }));
    }, 500);
  }
}));

// 작업 관리 스토어
export const useWorkStore = create((set, get) => ({
  works: [
    {
      id: 'WRK-2025-0001',
      name: '강북구 수유동 도로 균열 보수',
      status: '진행중',
      completionRate: 65,
      assignedTo: '김철수',
      instructionId: 'INS-2025-0001',
      startDate: '2025-04-01',
      endDate: '2025-04-15',
      materials: '아스팔트 3톤, 시멘트 2톤',
      equipments: '포장기 1대, 롤러 1대',
      description: '강북구 수유동 도로의 균열을 보수하는 작업입니다. 도로 상태가 매우 좋지 않아 전면 보수가 필요합니다.',
      createdAt: '2025-03-25',
      updatedAt: '2025-04-05'
    },
    {
      id: 'WRK-2025-0002',
      name: '서초구 반포대로 가로등 교체',
      status: '대기중',
      completionRate: 0,
      assignedTo: '박영희',
      instructionId: 'INS-2025-0002',
      startDate: '2025-04-10',
      endDate: '2025-04-20',
      materials: 'LED 가로등 15개, 전선 100m',
      equipments: '고소작업차 1대',
      description: '서초구 반포대로의 노후화된 가로등을 에너지 효율이 높은 LED 가로등으로 교체하는 작업입니다.',
      createdAt: '2025-03-28',
      updatedAt: '2025-03-28'
    },
    {
      id: 'WRK-2025-0003',
      name: '강남구 삼성동 보도블럭 교체',
      status: '완료',
      completionRate: 100,
      assignedTo: '이민수',
      instructionId: 'INS-2025-0003',
      startDate: '2025-03-15',
      endDate: '2025-03-30',
      materials: '보도블럭 500개, 모래 2톤',
      equipments: '소형 굴삭기 1대',
      description: '강남구 삼성동 일대의 파손된 보도블럭을 교체하는 작업입니다. 보행자 안전을 위해 신속히 진행되었습니다.',
      createdAt: '2025-03-10',
      updatedAt: '2025-03-30'
    }
  ],
  currentWork: null,
  isLoading: false,
  error: null,
  
  // 작업 목록 로드
  loadWorks: () => {
    set({ isLoading: true });
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      set({ isLoading: false });
    }, 500);
  },
  
  // 특정 작업 로드
  loadWork: (id) => {
    set({ isLoading: true });
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      const work = get().works.find(work => work.id === id);
      set({ currentWork: work, isLoading: false });
    }, 500);
  },
  
  // 작업 생성
  createWork: (workData) => {
    set({ isLoading: true });
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      const newWork = {
        id: `WRK-2025-${String(get().works.length + 1).padStart(4, '0')}`,
        ...workData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      
      set(state => ({
        works: [...state.works, newWork],
        isLoading: false
      }));
    }, 500);
  },
  
  // 작업 수정
  updateWork: (id, workData) => {
    set({ isLoading: true });
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      set(state => ({
        works: state.works.map(work => 
          work.id === id 
            ? { 
                ...work, 
                ...workData, 
                updatedAt: new Date().toISOString().split('T')[0] 
              } 
            : work
        ),
        currentWork: state.currentWork && state.currentWork.id === id 
          ? { 
              ...state.currentWork, 
              ...workData, 
              updatedAt: new Date().toISOString().split('T')[0] 
            } 
          : state.currentWork,
        isLoading: false
      }));
    }, 500);
  },
  
  // 작업 삭제
  deleteWork: (id) => {
    set({ isLoading: true });
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      set(state => ({
        works: state.works.filter(work => work.id !== id),
        currentWork: state.currentWork && state.currentWork.id === id ? null : state.currentWork,
        isLoading: false
      }));
    }, 500);
  },
  
  // 엑셀 가져오기
  importWorks: (workList) => {
    set({ isLoading: true });
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      const newWorks = workList.map((work, index) => ({
        id: `WRK-2025-${String(get().works.length + index + 1).padStart(4, '0')}`,
        ...work,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }));
      
      set(state => ({
        works: [...state.works, ...newWorks],
        isLoading: false
      }));
    }, 500);
  }
}));
