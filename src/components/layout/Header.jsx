import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../lib/zustand";

const Header = () => {
  const { user, logout } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
  }));
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // Zustand 스토어의 logout 함수 호출 (API 호출 등 비동기 처리 가능성 고려)
    useAuthStore.setState({ user: null, isAuthenticated: false }); // 명시적으로 user 상태 null 처리 및 isAuthenticated false 처리
    navigate("/login");
  };

  return (
    <header className="z-10 bg-white shadow-sm">
      <div className="max-w-full px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-semibold text-gray-800 no-underline hover:text-blue-600"
            >
              보수작업관리시스템
            </Link>
          </div>

          <div className="flex items-center">
            {user && (
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                로그아웃
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
