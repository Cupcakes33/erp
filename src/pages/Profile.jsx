import React from "react";
import { useAuthStore } from "../lib/zustand";
import Button from "../components/atoms/Button";

const Profile = () => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">사용자 프로필</h1>

      <div className="p-6 mb-6 bg-white rounded-lg shadow">
        <div className="flex items-center mb-6">
          <div className="flex items-center justify-center w-20 h-20 mr-6 text-4xl bg-gray-200 rounded-full">
            👤
          </div>
          <div>
            <h2 className="text-xl font-bold">관리자</h2>
            <p className="text-gray-600">admin</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">이메일</p>
            <p>admin@example.com</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">부서</p>
            <p>관리부서</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">역할</p>
            <p>시스템 관리자</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">가입일</p>
            <p>2025-01-01</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" className="mr-2">
            프로필 수정
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="mb-4 text-lg font-bold">계정 설정</h3>

        <div className="mb-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">비밀번호 변경</p>
              <p className="text-sm text-gray-500">
                주기적으로 비밀번호를 변경하여 계정 보안을 유지하세요
              </p>
            </div>
            <Button variant="outline" size="sm">
              변경
            </Button>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">알림 설정</p>
              <p className="text-sm text-gray-500">
                시스템 알림 수신 여부를 설정합니다
              </p>
            </div>
            <Button variant="outline" size="sm">
              설정
            </Button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">로그인 기록</p>
              <p className="text-sm text-gray-500">
                최근 로그인 활동을 확인합니다
              </p>
            </div>
            <Button variant="outline" size="sm">
              보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
