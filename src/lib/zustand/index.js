// UI 상태 관리용 스토어 내보내기
import useAuthStore from './auth';
import useInstructionStore from './instruction';
import useWorkStore from './work';
import usePersonnelStore from './personnel';

export {
  useAuthStore,       // 인증 및 사용자 상태 관리
  useInstructionStore, // 지시 관련 UI 상태 관리
  useWorkStore,       // 작업 관련 UI 상태 관리
  usePersonnelStore   // 인사 관련 UI 상태 관리
}; 