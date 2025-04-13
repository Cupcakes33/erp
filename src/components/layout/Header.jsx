import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store";

const Header = () => {
  const { user, logout } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
  }));

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleToggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isNotificationOpen) setIsNotificationOpen(false);
  };

  const handleToggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  const handleKeyProfileMenu = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggleProfileMenu();
    }
  };

  const handleKeyNotification = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggleNotification();
    }
  };

  const handleLogout = () => {
    // Zustand 스토어의 logout 함수 호출
    logout();
    window.location.href = "/login";
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              보수작업관리시스템
            </h1>
          </div>

          <div className="flex items-center">
            {/* 알림 아이콘 */}
            <div className="relative ml-3">
              <button
                className="p-1 rounded-full text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleToggleNotification}
                onKeyDown={handleKeyNotification}
                tabIndex="0"
                aria-label="알림 보기"
                aria-expanded={isNotificationOpen}
                aria-haspopup="true"
              >
                <span className="sr-only">알림 보기</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              {isNotificationOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-labelledby="notification-menu"
                >
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700">
                        알림
                      </h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-100 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">
                          새로운 지시가 등록되었습니다.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">방금 전</p>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-100 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">
                          작업 상태가 변경되었습니다.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">1시간 전</p>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-100">
                        <p className="text-sm font-medium text-gray-800">
                          시스템 점검 안내
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          오늘 오후 6시
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200">
                      <Link
                        to="#"
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        모든 알림 보기
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 프로필 메뉴 */}
            <div className="relative ml-3">
              <div>
                <button
                  className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  id="user-menu"
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="true"
                  onClick={handleToggleProfileMenu}
                  onKeyDown={handleKeyProfileMenu}
                  tabIndex="0"
                >
                  <span className="sr-only">사용자 메뉴 열기</span>
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="ml-2 text-gray-700">
                    {user ? user.name : "관리자"}
                  </span>
                  <svg
                    className="ml-1 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {isProfileMenuOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="py-1" role="none">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="0"
                    >
                      내 프로필
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="0"
                    >
                      설정
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="0"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
