import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/zustand";
import {
  FormButton,
  FormInput,
  FormCard,
  // FormCheckbox,
} from "../components/molecules";
import { LockKeyhole, User, AlertCircle } from "lucide-react";
import { useResetPassword } from "../lib/api/userQueries";
import Modal from "../components/molecules/Modal";

const Login = () => {
  const navigate = useNavigate();
  const {
    login,
    isAuthenticated,
    isLoading,
    error: authError,
  } = useAuthStore((state) => ({
    login: state.login,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
  }));

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetUsername, setResetUsername] = useState("");
  const [resetError, setResetError] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const {
    mutate: resetPassword,
    isLoading: isResetting,
    isSuccess: isResetSuccess,
    isError: isResetError,
    error: resetApiError,
    reset: resetResetPasswordState,
  } = useResetPassword();

  // 인증 상태 변경 감지
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/instructions");
    }

    if (authError) {
      setError(authError);
    }
  }, [isAuthenticated, authError, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 입력 시 에러 메시지 초기화
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 간단한 유효성 검사
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    // Zustand 스토어의 login 함수 호출
    login(formData);
  };

  // 비밀번호 초기화 요청 핸들러
  const handleResetPassword = (e) => {
    e.preventDefault();
    setResetError("");
    setTempPassword("");
    if (!resetUsername.trim()) {
      setResetError("아이디를 입력해주세요.");
      return;
    }
    resetPassword(
      { username: resetUsername },
      {
        onSuccess: (data) => {
          setTempPassword(data?.password || "");
        },
        onError: (err) => {
          setResetError(
            err?.response?.data?.message || err?.message || "비밀번호 초기화 실패"
          );
        },
      }
    );
  };

  // 모달 닫기 시 상태 초기화
  const handleCloseResetModal = () => {
    setShowResetModal(false);
    setResetUsername("");
    setResetError("");
    setTempPassword("");
    resetResetPasswordState();
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <FormCard className="w-full max-w-md">
        <div className="mb-6 space-y-1 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            보수작업관리시스템
          </h2>
          <p className="text-gray-600">계정 정보로 로그인하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center p-3 mb-4 space-x-2 text-sm font-medium text-red-700 bg-red-100 rounded">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <FormInput
              id="username"
              name="username"
              label="아이디"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              prefix={<User className="w-4 h-4 text-gray-400" />}
              required
              autoFocus
            />

            <FormInput
              id="password"
              name="password"
              label="비밀번호"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              prefix={<LockKeyhole className="w-4 h-4 text-gray-400" />}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* <FormCheckbox
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                label="로그인 상태 유지"
              /> */}
            </div>

            <a
              href="#"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                setShowResetModal(true);
              }}
            >
              비밀번호 초기화
            </a>
          </div>

          <FormButton type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </FormButton>

          <p className="mt-4 text-sm text-center text-gray-600">
            테스트 계정: admin / admin
          </p>
        </form>
      </FormCard>

      {/* 비밀번호 초기화 모달 */}
      <Modal
        isOpen={showResetModal}
        onClose={handleCloseResetModal}
        title="비밀번호 초기화"
        size="sm"
      >
        {tempPassword ? (
          <div className="space-y-4">
            <div className="text-green-700 text-center">
              임시 비밀번호가 발급되었습니다.
            </div>
            <div className="flex items-center justify-between border rounded p-2 bg-gray-50">
              <span className="font-mono text-blue-700">{tempPassword}</span>
              <button
                className="ml-2 px-2 py-1 text-xs bg-blue-100 rounded hover:bg-blue-200"
                onClick={() => {
                  navigator.clipboard.writeText(tempPassword);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1200);
                }}
                type="button"
              >
                {copied ? "복사됨" : "복사"}
              </button>
            </div>
            <FormButton onClick={handleCloseResetModal} className="w-full" type="button">
              닫기
            </FormButton>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <FormInput
              id="reset-username"
              name="reset-username"
              label="아이디"
              value={resetUsername}
              onChange={(e) => setResetUsername(e.target.value)}
              placeholder="비밀번호를 초기화할 아이디 입력"
              required
              autoFocus
            />
            {resetError && (
              <div className="text-red-600 text-sm">{resetError}</div>
            )}
            <FormButton type="submit" className="w-full" disabled={isResetting}>
              {isResetting ? "요청 중..." : "임시 비밀번호 발급"}
            </FormButton>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Login;
