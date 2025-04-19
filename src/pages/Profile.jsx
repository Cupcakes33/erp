import React, { useEffect, useState } from "react"
import { FormButton, FormInput, FormCard } from "../components/molecules"
import { useAuthStore } from "../lib/zustand"
import {
  useMyProfile,
  useUpdateProfile,
  useChangePassword,
} from "@/lib/api/userQueries"

const Profile = () => {
  const { user } = useAuthStore((state) => ({
    user: state.user,
  }))

  const [profile, setProfile] = useState({
    username: user?.username || "admin",
    name: user?.name || "관리자",
    email: "",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [errors, setErrors] = useState({})

  const { data, isSuccess, isError, error } = useMyProfile()
  const { mutate: updateProfileMutate, isLoading: isUpdating } =
    useUpdateProfile()
  const { mutate: changePasswordMutate, isLoading: isChangingPassword } =
    useChangePassword()

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear errors when typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validatePassword = () => {
    const newErrors = {}

    if (!password.current) {
      newErrors.current = "현재 비밀번호를 입력하세요"
    }

    if (!password.new) {
      newErrors.new = "새 비밀번호를 입력하세요"
    } else if (password.new.length < 8) {
      newErrors.new = "비밀번호는 8자 이상이어야 합니다"
    }

    if (!password.confirm) {
      newErrors.confirm = "비밀번호 확인을 입력하세요"
    } else if (password.new !== password.confirm) {
      newErrors.confirm = "비밀번호가 일치하지 않습니다"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev)
    setErrors({})
  }

  const handleUpdateProfile = (e) => {
    e.preventDefault()
    if (
      !profile.name ||
      !/^([가-힣]{2,10}|[a-zA-Z]{2,20})$/.test(profile.name)
    ) {
      setErrors({ name: "이름은 한글 2~10자 또는 영문 2~20자여야 합니다." })
      return
    }
    updateProfileMutate(
      { name: profile.name },
      {
        onSuccess: () => {
          setIsEditing(false)
          setErrors({})
        },
        onError: (err) => {
          setErrors({ name: err?.response?.data?.message || "이름 변경 실패" })
        },
      },
    )
  }

  const handleUpdatePassword = (e) => {
    e.preventDefault()
    if (validatePassword()) {
      changePasswordMutate(
        {
          oldPassword: password.current,
          newPassword: password.new,
        },
        {
          onSuccess: () => {
            alert("비밀번호가 변경되었습니다")
            setPassword({
              current: "",
              new: "",
              confirm: "",
            })
          },
          onError: (err) => {
            setErrors({
              current: err?.response?.data?.message || "비밀번호 변경 실패",
            })
          },
        },
      )
    }
  }

  useEffect(() => {
    if (isSuccess && data?.data) {
      setProfile(data.data)
    }
  }, [isSuccess, data])

  if (isError) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-6 text-2xl font-bold">내 프로필</h1>
        <div className="text-red-500">
          프로필 정보를 불러오는 중 오류가 발생했습니다.
          <br />
          {error?.response?.data?.message ||
            error?.message ||
            "알 수 없는 오류"}
        </div>
      </div>
    )
  }

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
                {isEditing ? "취소" : "이름 수정"}
              </FormButton>
            </div>

            <div className="mb-4">
              <FormInput
                id="username"
                name="username"
                label="아이디"
                placeholder="아이디"
                value={profile.username}
                disabled
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
                error={errors.name}
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
                disabled
              />
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <FormButton
                  type="submit"
                  variant="success"
                  disabled={isUpdating}
                >
                  {isUpdating ? "저장 중..." : "저장"}
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
              <FormButton
                type="submit"
                variant="primary"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? "변경 중..." : "비밀번호 변경"}
              </FormButton>
            </div>
          </form>
        </FormCard>
      </div>
    </div>
  )
}

export default Profile
