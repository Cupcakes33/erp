import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// 인증 스토어
const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
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
        },
        
        // 비밀번호 초기화 요청
        resetPassword: (email) => {
          set({ isLoading: true, error: null });
          
          // 실제 구현에서는 API 호출
          setTimeout(() => {
            // 이메일 유효성 검사 (간단한 체크)
            if (email && email.includes('@')) {
              set({ isLoading: false });
              return true;
            } else {
              set({ 
                isLoading: false, 
                error: '유효하지 않은 이메일입니다.' 
              });
              return false;
            }
          }, 500);
        },
        
        // 비밀번호 변경
        updatePassword: (currentPassword, newPassword) => {
          set({ isLoading: true, error: null });
          
          // 실제 구현에서는 API 호출
          setTimeout(() => {
            // 현재 비밀번호 확인 (실제 구현에서는 서버에서 검증)
            if (currentPassword === 'admin') {
              // 비밀번호 유효성 검사
              const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,12}$/;
              
              if (passwordRegex.test(newPassword)) {
                set({ isLoading: false });
                return true;
              } else {
                set({
                  isLoading: false,
                  error: '비밀번호는 영문자와 숫자를 포함하여 5~12자리여야 합니다.'
                });
                return false;
              }
            } else {
              set({
                isLoading: false,
                error: '현재 비밀번호가 올바르지 않습니다.'
              });
              return false;
            }
          }, 500);
        }
      }),
      {
        name: 'auth-storage',
        getStorage: () => localStorage,
      }
    )
  )
);

export default useAuthStore; 