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
    phone: "",
    rank: "",
    status: "ACTIVE",
    brith: "",
    note: "",
  });

  const [errors, setErrors] = useState({});

  // 작업자 데이터 로드 시 폼 초기화
  useEffect(() => {
    if (worker) {
      setFormData({
        name: worker.name || "",
        phone: worker.phone || "",
        rank: worker.rank || "",
        status: worker.status === true || worker.status === "ACTIVE" ? "ACTIVE" : "RESIGNED",
        brith: worker.brith || "",
        note: worker.note || "",
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
      await updateWorkerMutation.mutateAsync({
        id,
        workerData: {
          name: formData.name,
          phone: formData.phone,
          rank: formData.rank,
          status: formData.status === "ACTIVE",
          brith: formData.brith,
          note: formData.note,
        },
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
