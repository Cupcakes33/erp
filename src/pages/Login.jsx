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

  // 인증 상태 변경 감지
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
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
            >
              비밀번호를 잊으셨나요?
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
    </div>
  );
};

export default Login;
