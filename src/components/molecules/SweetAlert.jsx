import Swal from "sweetalert2";

/**
 * SweetAlert2 래퍼 컴포넌트
 * 다양한 알림, 모달, 확인 대화상자 등을 표시하는 함수들을 제공합니다.
 */

// 정보 알림 표시
export const showInfo = (title, message) => {
  return Swal.fire({
    title,
    text: message,
    icon: "info",
    confirmButtonText: "확인",
    confirmButtonColor: "#3085d6",
  });
};

// 성공 알림 표시
export const showSuccess = (title, message) => {
  return Swal.fire({
    title,
    text: message,
    icon: "success",
    confirmButtonText: "확인",
    confirmButtonColor: "#28a745",
  });
};

// 경고 알림 표시
export const showWarning = (title, message) => {
  return Swal.fire({
    title,
    text: message,
    icon: "warning",
    confirmButtonText: "확인",
    confirmButtonColor: "#f8bb86",
  });
};

// 에러 알림 표시
export const showError = (title, message) => {
  return Swal.fire({
    title,
    text: message,
    icon: "error",
    confirmButtonText: "확인",
    confirmButtonColor: "#d33",
  });
};

// 확인 다이얼로그 표시
export const showConfirm = ({
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  confirmButtonColor = "#3085d6",
  cancelButtonColor = "#6c757d",
  icon = "question",
}) => {
  return Swal.fire({
    title,
    text: message,
    icon,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
  });
};

// 삭제 확인 다이얼로그 (특화된 버전)
export const showDeleteConfirm = (title, message) => {
  return Swal.fire({
    title,
    text: message || "이 작업은 되돌릴 수 없습니다.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
    reverseButtons: true,
  });
};

// 사용자 입력 다이얼로그
export const showPrompt = (title, inputPlaceholder) => {
  return Swal.fire({
    title,
    input: "text",
    inputPlaceholder,
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    inputValidator: (value) => {
      if (!value) {
        return "입력란을 채워주세요!";
      }
    },
  });
};

// 텍스트 영역 입력 다이얼로그
export const showTextAreaPrompt = (title, inputPlaceholder) => {
  return Swal.fire({
    title,
    input: "textarea",
    inputPlaceholder,
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    inputValidator: (value) => {
      if (!value) {
        return "입력란을 채워주세요!";
      }
    },
  });
};

// 커스텀 HTML 컨텐츠 모달
export const showCustomHtml = ({
  title,
  html,
  confirmText = "확인",
  showCancel = false,
  cancelText = "취소",
}) => {
  return Swal.fire({
    title,
    html,
    showCancelButton: showCancel,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
};

// 여러 필드가 있는 폼 모달
export const showMultiInputForm = ({
  title,
  html,
  confirmText = "확인",
  cancelText = "취소",
  preConfirm,
}) => {
  return Swal.fire({
    title,
    html,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    preConfirm,
  });
};

export default {
  showInfo,
  showSuccess,
  showWarning,
  showError,
  showConfirm,
  showDeleteConfirm,
  showPrompt,
  showTextAreaPrompt,
  showCustomHtml,
  showMultiInputForm,
};
