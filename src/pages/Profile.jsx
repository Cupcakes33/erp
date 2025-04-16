import React, { useState } from "react";
import { FormButton, FormInput, FormCard } from "../components/molecules";
import { useAuthStore } from "../lib/zustand";

const Profile = () => {
  const { user } = useAuthStore((state) => ({
    user: state.user,
  }));

  const [profile, setProfile] = useState({
    username: user?.username || "admin",
    name: user?.name || "관리자",
    email: "admin@example.com",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!password.current) {
      newErrors.current = "현재 비밀번호를 입력하세요";
    }

    if (!password.new) {
      newErrors.new = "새 비밀번호를 입력하세요";
    } else if (password.new.length < 8) {
      newErrors.new = "비밀번호는 8자 이상이어야 합니다";
    }

    if (!password.confirm) {
      newErrors.confirm = "비밀번호 확인을 입력하세요";
    } else if (password.new !== password.confirm) {
      newErrors.confirm = "비밀번호가 일치하지 않습니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // 프로필 업데이트 로직 (실제로는 API 호출)
    setIsEditing(false);
    alert("프로필이 업데이트되었습니다");
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (validatePassword()) {
      // 비밀번호 변경 로직 (실제로는 API 호출)
      alert("비밀번호가 변경되었습니다");
      setPassword({
        current: "",
        new: "",
        confirm: "",
      });
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">내 프로필</h1>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* 프로필 정보 카드 */}
        <FormCard className="flex-1">
          <form onSubmit={handleUpdateProfile}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">기본 정보</h2>
              <FormButton
                type="button"
                variant={isEditing ? "danger" : "primary"}
                onClick={handleEditToggle}
              >
                {isEditing ? "취소" : "수정"}
              </FormButton>
            </div>

            <div className="mb-4">
              <FormInput
                id="username"
                name="username"
                label="아이디"
                placeholder="아이디"
                value={profile.username}
                onChange={handleProfileChange}
                disabled={!isEditing || profile.username === "admin"}
              />
            </div>

            <div className="mb-4">
              <FormInput
                id="name"
                name="name"
                label="이름"
                placeholder="이름"
                value={profile.name}
                onChange={handleProfileChange}
                disabled={!isEditing}
              />
            </div>

            <div className="mb-4">
              <FormInput
                id="email"
                name="email"
                type="email"
                label="이메일"
                placeholder="이메일"
                value={profile.email}
                onChange={handleProfileChange}
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <FormButton type="submit" variant="success">
                  저장
                </FormButton>
              </div>
            )}
          </form>
        </FormCard>

        {/* 비밀번호 변경 카드 */}
        <FormCard className="flex-1">
          <form onSubmit={handleUpdatePassword}>
            <h2 className="mb-4 text-xl font-bold">비밀번호 변경</h2>

            <div className="mb-4">
              <FormInput
                id="current-password"
                name="current"
                type="password"
                label="현재 비밀번호"
                placeholder="현재 비밀번호"
                value={password.current}
                onChange={handlePasswordChange}
                error={errors.current}
              />
            </div>

            <div className="mb-4">
              <FormInput
                id="new-password"
                name="new"
                type="password"
                label="새 비밀번호"
                placeholder="새 비밀번호 (8자 이상)"
                value={password.new}
                onChange={handlePasswordChange}
                error={errors.new}
              />
            </div>

            <div className="mb-5">
              <FormInput
                id="confirm-password"
                name="confirm"
                type="password"
                label="비밀번호 확인"
                placeholder="비밀번호 확인"
                value={password.confirm}
                onChange={handlePasswordChange}
                error={errors.confirm}
              />
            </div>

            <div className="flex justify-end">
              <FormButton type="submit" variant="primary">
                비밀번호 변경
              </FormButton>
            </div>
          </form>
        </FormCard>
      </div>
    </div>
  );
};

export default Profile;
