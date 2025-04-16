import api from './index';

/**
 * 사용자 관련 API 모듈
 * 마이페이지 조회, 프로필 수정, 비밀번호 변경, 비밀번호 초기화 기능 제공
 */

// 현재 로그인된 Mock 사용자 가져오기 함수
const getMockCurrentUser = () => {
  const userJson = localStorage.getItem('currentUser');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Mock 사용자 정보 파싱 오류:', error);
    return null;
  }
};

/**
 * 마이페이지 조회 API
 * @returns {Promise<Object>} 사용자 정보
 */
export const getMyProfile = async () => {
  try {
    // 실제 API 호출
    const response = await api.get('/users/my');
    return response.data;
  } catch (error) {
    console.error('마이페이지 조회 실패:', error);
    throw error;
  }
};

/**
 * Mock 마이페이지 조회 API
 * @returns {Promise<Object>} 사용자 정보
 */
export const mockGetMyProfile = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const currentUser = getMockCurrentUser();
      
      if (!currentUser) {
        reject(new Error('로그인이 필요합니다.'));
        return;
      }
      
      resolve({
        message: '요청에 성공하였습니다.',
        data: {
          username: currentUser.username,
          name: currentUser.name,
          email: currentUser.email || `${currentUser.username}@example.com`
        }
      });
    }, 500);
  });
};

/**
 * 프로필 수정 API
 * @param {Object} profileData - 수정할 프로필 정보
 * @param {string} profileData.username - 사용자 아이디
 * @param {string} profileData.name - 사용자 이름
 * @param {string} profileData.email - 사용자 이메일
 * @returns {Promise<Object>} 수정된 프로필 정보
 */
export const updateProfile = async (profileData) => {
  try {
    // 실제 API 호출
    const response = await api.patch('/users/my', profileData);
    return response.data;
  } catch (error) {
    console.error('프로필 수정 실패:', error);
    throw error;
  }
};

/**
 * Mock 프로필 수정 API
 * @param {Object} profileData - 수정할 프로필 정보
 * @returns {Promise<Object>} 수정된 프로필 정보
 */
export const mockUpdateProfile = async (profileData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const currentUser = getMockCurrentUser();
      
      if (!currentUser) {
        reject(new Error('로그인이 필요합니다.'));
        return;
      }
      
      // 이름 검증 (한글만 허용)
      if (profileData.name && !/^[가-힣]+$/.test(profileData.name)) {
        reject({
          message: '이름 검증 오류(한글)'
        });
        return;
      }
      
      // 사용자 정보 업데이트
      const updatedUser = {
        ...currentUser,
        ...profileData
      };
      
      // 로컬 스토리지 업데이트
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      resolve({
        message: '요청에 성공하였습니다.',
        data: {
          username: updatedUser.username,
          name: updatedUser.name,
          email: updatedUser.email || `${updatedUser.username}@example.com`
        }
      });
    }, 500);
  });
};

/**
 * 비밀번호 변경 API
 * @param {Object} passwordData - 비밀번호 정보
 * @param {string} passwordData.oldPassword - 현재 비밀번호
 * @param {string} passwordData.newPassword - 새 비밀번호
 * @returns {Promise<Object>} 비밀번호 변경 결과
 */
export const changePassword = async (passwordData) => {
  try {
    // 실제 API 호출
    const response = await api.put('/users/pw', passwordData);
    return response.data;
  } catch (error) {
    console.error('비밀번호 변경 실패:', error);
    throw error;
  }
};

/**
 * Mock 비밀번호 변경 API
 * @param {Object} passwordData - 비밀번호 정보
 * @returns {Promise<Object>} 비밀번호 변경 결과
 */
export const mockChangePassword = async (passwordData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const currentUser = getMockCurrentUser();
      
      if (!currentUser) {
        reject(new Error('로그인이 필요합니다.'));
        return;
      }
      
      // 현재 비밀번호 확인을 위해 MockUsers 배열에서 검색
      const { oldPassword, newPassword } = passwordData;
      
      // 비밀번호 유효성 검사
      if (!/^[a-zA-Z0-9]{5,12}$/.test(newPassword)) {
        reject({
          message: '비밀번호는 영문자와 숫자로 구성된 5~12자리여야 합니다.'
        });
        return;
      }
      
      resolve({
        message: '비밀번호가 변경되었습니다.'
      });
    }, 500);
  });
};

/**
 * 비밀번호 초기화 API
 * @param {Object} resetData - 비밀번호 초기화 정보
 * @param {string} resetData.username - 사용자 아이디
 * @returns {Promise<Object>} 비밀번호 초기화 결과
 */
export const resetPassword = async (resetData) => {
  try {
    // 실제 API 호출
    const response = await api.post('/users/pw/reset', resetData);
    return response.data;
  } catch (error) {
    console.error('비밀번호 초기화 실패:', error);
    throw error;
  }
};

/**
 * Mock 비밀번호 초기화 API
 * @param {Object} resetData - 비밀번호 초기화 정보
 * @returns {Promise<Object>} 비밀번호 초기화 결과
 */
export const mockResetPassword = async (resetData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { username } = resetData;
      
      // 모의 사용자 ID 확인 (mockUsers 배열에서 찾아야 하지만 이 예제에서는 단순화)
      if (!username || username.length < 3) {
        reject({
          message: '존재하지 않는 id입니다.'
        });
        return;
      }
      
      // 임의의 임시 비밀번호 생성 (실제 서비스에서는 서버에서 생성)
      const tempPassword = 'temp' + Math.floor(1000 + Math.random() * 9000) + '!';
      resolve({
        message: '등록된 email로 임시 비밀번호가 발급되었습니다.',
        password: tempPassword
      });
    }, 500);
  });
};

// 개발 환경에서 Mock API 사용을 위한 설정
const isDevelopment = import.meta.env.DEV;

// 실제 API와 Mock API 중 환경에 맞게 내보내기
export default {
  getMyProfile: isDevelopment ? mockGetMyProfile : getMyProfile,
  updateProfile: isDevelopment ? mockUpdateProfile : updateProfile,
  changePassword: isDevelopment ? mockChangePassword : changePassword,
  resetPassword: isDevelopment ? mockResetPassword : resetPassword
};