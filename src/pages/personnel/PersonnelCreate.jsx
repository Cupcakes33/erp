import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateWorker } from "../../lib/api/personnelQueries";
import { FormButton, FormInput, FormSelect, FormCard } from "../../components/molecules";

/**
 * 작업자 추가 페이지
 */
const PersonnelCreate = () => {
  const navigate = useNavigate();
  const createWorkerMutation = useCreateWorker();

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    phone: "",
    birthDate: "",
    email: "",
    address: "",
    status: "active",
    department: "",
    hireDate: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 입력 시 해당 필드의 오류 메시지 삭제
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }

    if (!formData.position.trim()) {
      newErrors.position = "직급을 입력해주세요";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "연락처를 입력해주세요";
    } else if (!/^(\d{3}-\d{4}-\d{4}|\d{11})$/.test(formData.phone.replace(/-/g, "").trim())) {
      newErrors.phone = "유효한 연락처 형식이 아닙니다";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "생년월일을 선택해주세요";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "유효한 이메일 형식이 아닙니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // ID는 실제 API에서 생성될 것임, 여기서는 데모 ID 생성
      const newWorker = {
        ...formData,
        id: `WRK-${new Date().getFullYear()}-${String(
          Math.floor(Math.random() * 10000)
        ).padStart(4, "0")}`,
      };

      await createWorkerMutation.mutateAsync(newWorker);
      navigate("/personnel");
    } catch (error) {
      console.error("작업자 생성 실패:", error);
      setErrors({
        submit: "작업자를 생성하는 중 오류가 발생했습니다.",
      });
    }
  };

  const handleCancel = () => {
    navigate("/personnel");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">새 작업자 등록</h1>

      <FormCard>
        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormInput
              id="name"
              name="name"
              label="이름"
              placeholder="작업자 이름을 입력하세요"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            <FormInput
              id="position"
              name="position"
              label="직급"
              placeholder="직급을 입력하세요"
              value={formData.position}
              onChange={handleChange}
              error={errors.position}
              required
            />

            <FormInput
              id="phone"
              name="phone"
              label="연락처"
              placeholder="010-0000-0000"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
            />

            <FormInput
              id="email"
              name="email"
              type="email"
              label="이메일"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <FormInput
              id="birthDate"
              name="birthDate"
              type="date"
              label="생년월일"
              value={formData.birthDate}
              onChange={handleChange}
              error={errors.birthDate}
              required
            />

            <FormInput
              id="hireDate"
              name="hireDate"
              type="date"
              label="입사일"
              value={formData.hireDate}
              onChange={handleChange}
            />

            <FormSelect
              id="status"
              name="status"
              label="재직 상태"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: "active", label: "재직중" },
                { value: "inactive", label: "퇴사" },
              ]}
            />

            <FormInput
              id="department"
              name="department"
              label="부서"
              placeholder="부서를 입력하세요"
              value={formData.department}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <FormInput
              id="address"
              name="address"
              label="주소"
              placeholder="주소를 입력하세요"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <FormButton type="button" variant="outline" onClick={handleCancel}>
              취소
            </FormButton>
            <FormButton type="submit" disabled={createWorkerMutation.isLoading}>
              {createWorkerMutation.isLoading ? "처리 중..." : "저장"}
            </FormButton>
          </div>
        </form>
      </FormCard>
    </div>
  );
};

export default PersonnelCreate;
