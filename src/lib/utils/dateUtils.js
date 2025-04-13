/**
 * 날짜 관련 유틸리티 함수들을 모아둔 모듈
 */

/**
 * 날짜를 YYYY-MM-DD 형식의 문자열로 포맷팅
 * @param {string|Date} date - 포맷팅할 날짜 (Date 객체 또는 날짜 문자열)
 * @returns {string} 포맷팅된 날짜 문자열, 유효하지 않은 경우 '-' 반환
 */
export const formatDate = (date) => {
  if (!date) return "-";
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // 유효한 날짜인지 확인
    if (isNaN(dateObj.getTime())) {
      return "-";
    }
    
    // YYYY-MM-DD 형식으로 변환
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("날짜 포맷팅 오류:", error);
    return "-";
  }
};

/**
 * 날짜를 YYYY년 MM월 DD일 형식의 한국어 문자열로 포맷팅
 * @param {string|Date} date - 포맷팅할 날짜 (Date 객체 또는 날짜 문자열)
 * @returns {string} 포맷팅된 한국어 날짜 문자열, 유효하지 않은 경우 '-' 반환
 */
export const formatKoreanDate = (date) => {
  if (!date) return "-";
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // 유효한 날짜인지 확인
    if (isNaN(dateObj.getTime())) {
      return "-";
    }
    
    // YYYY년 MM월 DD일 형식으로 변환
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    
    return `${year}년 ${month}월 ${day}일`;
  } catch (error) {
    console.error("날짜 포맷팅 오류:", error);
    return "-";
  }
};

/**
 * 날짜에 일수를 더하거나 빼는 함수
 * @param {string|Date} date - 기준 날짜 (Date 객체 또는 날짜 문자열)
 * @param {number} days - 더하거나 뺄 일수 (양수는 더하기, 음수는 빼기)
 * @returns {Date} 계산된 날짜 객체
 */
export const addDays = (date, days) => {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
};

/**
 * 두 날짜 사이의 일수를 계산하는 함수
 * @param {string|Date} startDate - 시작 날짜
 * @param {string|Date} endDate - 종료 날짜
 * @returns {number} 두 날짜 사이의 일수
 */
export const daysBetween = (startDate, endDate) => {
  const start = typeof startDate === 'string' ? new Date(startDate) : new Date(startDate);
  const end = typeof endDate === 'string' ? new Date(endDate) : new Date(endDate);
  
  // 시간 정보 제거
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  // 밀리초 단위 차이를 일수로 변환
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * 날짜가 유효한지 확인하는 함수
 * @param {string|Date} date - 확인할 날짜
 * @returns {boolean} 유효한 날짜인지 여부
 */
export const isValidDate = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return !isNaN(dateObj.getTime());
};

/**
 * 오늘 날짜를 반환하는 함수 (YYYY-MM-DD 형식)
 * @returns {string} 오늘 날짜 문자열
 */
export const getTodayString = () => {
  return formatDate(new Date());
};

/**
 * 날짜를 YYYY-MM-DD HH:mm 형식의 문자열로 포맷팅
 * @param {string|Date} date - 포맷팅할 날짜 (Date 객체 또는 날짜 문자열)
 * @returns {string} 포맷팅된 날짜와 시간 문자열
 */
export const formatDateTime = (date) => {
  if (!date) return "-";
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // 유효한 날짜인지 확인
    if (isNaN(dateObj.getTime())) {
      return "-";
    }
    
    // YYYY-MM-DD HH:mm 형식으로 변환
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error("날짜 포맷팅 오류:", error);
    return "-";
  }
}; 