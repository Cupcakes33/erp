import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateWorker } from "../../lib/api/personnelQueries";
import { FormButton, FormCard, FormInput, FormTextArea, FormSelect } from "../../components/molecules";

/**
 * 작업자 추가 페이지
 */
const PersonnelCreate = () => {
  const navigate = useNavigate();
  const createWorkerMutation = useCreateWorker();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    rank: "",
    status: "ACTIVE",
    brith: "",
    note: "",
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
    if (!formData.phone.trim()) {
      newErrors.phone = "연락처를 입력해주세요";
    } else if (!/^\d{3}-\d{4}-\d{4}$|^\d{11}$/.test(formData.phone.replace(/-/g, "").trim())) {
      newErrors.phone = "유효한 연락처 형식이 아닙니다";
    }
    if (!formData.rank.trim()) {
      newErrors.rank = "직급을 입력해주세요";
    }
    if (!formData.brith) {
      newErrors.brith = "생년월일을 선택해주세요";
    }
    if (!["ACTIVE", "RESIGNED"].includes(formData.status)) {
      newErrors.status = "재직 여부를 선택해주세요";
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
      const newWorker = {
        name: formData.name,
        phone: formData.phone,
        rank: formData.rank,
        status: formData.status === "ACTIVE",
        brith: formData.brith,
        note: formData.note,
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
              id="rank"
              name="rank"
              label="직급"
              placeholder="직급을 입력하세요"
              value={formData.rank}
              onChange={handleChange}
              error={errors.rank}
              required
            />
            <FormSelect
              id="status"
              name="status"
              label="재직 여부"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: "ACTIVE", label: "재직중" },
                { value: "RESIGNED", label: "퇴사" },
              ]}
              error={errors.status}
              required
            />
            <FormInput
              id="brith"
              name="brith"
              type="date"
              label="생년월일"
              value={formData.brith}
              onChange={handleChange}
              error={errors.brith}
              required
            />
          </div>
          <div className="mb-6">
            <FormTextArea
              id="note"
              name="note"
              label="비고"
              placeholder="비고를 입력하세요"
              value={formData.note}
              onChange={handleChange}
              rows={3}
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
