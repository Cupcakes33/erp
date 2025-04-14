import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useWorkerDetail,
  useUpdateWorker,
} from "../../lib/api/personnelQueries";
import {
  FormButton,
  FormInput,
  FormSelect,
  FormCard,
  FormTextArea,
  FormGroup,
} from "../../components/molecules";
import { ArrowLeft } from "lucide-react";

/**
 * 작업자 정보 수정 페이지
 */
const PersonnelEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: worker, isLoading: isLoadingWorker } = useWorkerDetail(id);
  const updateWorkerMutation = useUpdateWorker();

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

  // 작업자 데이터 로드 시 폼 초기화
  useEffect(() => {
    if (worker) {
      setFormData({
        ...worker,
      });
    }
  }, [worker]);

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
    } else if (
      !/^(\d{3}-\d{4}-\d{4}|\d{11})$/.test(
        formData.phone.replace(/-/g, "").trim()
      )
    ) {
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
      await updateWorkerMutation.mutateAsync({
        id,
        data: formData,
      });
      navigate(`/personnel/${id}`);
    } catch (error) {
      console.error("작업자 수정 실패:", error);
      setErrors({
        submit: "작업자 정보를 수정하는 중 오류가 발생했습니다.",
      });
    }
  };

  const handleCancel = () => {
    navigate(`/personnel/${id}`);
  };

  if (isLoadingWorker) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md">
        작업자 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <FormButton
          variant="outline"
          size="sm"
          onClick={handleCancel}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </FormButton>
        <h1 className="text-2xl font-bold">{worker.name} 정보 수정</h1>
      </div>

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
              value={formData.email || ""}
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
              value={formData.hireDate || ""}
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
              value={formData.department || ""}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <FormInput
              id="address"
              name="address"
              label="주소"
              placeholder="주소를 입력하세요"
              value={formData.address || ""}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <FormTextArea
              id="notes"
              name="notes"
              label="메모/특이사항"
              placeholder="메모나 특이사항을 입력하세요"
              value={formData.notes || ""}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <FormButton type="button" variant="outline" onClick={handleCancel}>
              취소
            </FormButton>
            <FormButton type="submit" disabled={updateWorkerMutation.isLoading}>
              {updateWorkerMutation.isLoading ? "처리 중..." : "저장"}
            </FormButton>
          </div>
        </form>
      </FormCard>
    </div>
  );
};

export default PersonnelEdit;
