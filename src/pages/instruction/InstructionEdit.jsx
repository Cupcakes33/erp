import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useInstruction,
  useUpdateInstruction,
} from "../../lib/api/instructionQueries";
import {
  FormButton,
  FormInput,
  FormSelect,
  FormTextArea,
  FormCard,
  Loading,
  showSuccess,
} from "../../components/molecules";
import { ArrowLeft } from "lucide-react";

// 상태 및 우선순위 상수
const STATUS_OPTIONS = [
  { value: "RECEIVED", label: "접수" },
  { value: "IN_PROGRESS", label: "진행중" },
  { value: "COMPLETED", label: "완료" },
  { value: "CANCELED", label: "취소" },
];

const PRIORITY_OPTIONS = [
  { value: "HIGH", label: "높음" },
  { value: "MEDIUM", label: "중간" },
  { value: "LOW", label: "낮음" },
];

const InstructionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: instruction, isLoading, isError } = useInstruction(id);
  const updateInstructionMutation = useUpdateInstruction();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    priority: "MEDIUM",
    status: "RECEIVED",
    dueDate: "",
    address: "",
    manager: "",
    receiver: "",
    channel: "PHONE",
  });

  const [errors, setErrors] = useState({});

  // 지시 데이터 로드 시 폼 초기화
  useEffect(() => {
    if (instruction) {
      setFormData({
        title: instruction.title || "",
        description: instruction.description || "",
        location: instruction.location || "",
        priority: instruction.priority || "MEDIUM",
        status: instruction.status || "RECEIVED",
        dueDate: instruction.dueDate || "",
        address: instruction.address || "",
        manager: instruction.manager || "",
        receiver: instruction.receiver || "",
        channel: instruction.channel || "PHONE",
      });
    }
  }, [instruction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 입력 시 해당 필드의 오류 메시지 삭제
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력해주세요";
    }

    if (!formData.description.trim()) {
      newErrors.description = "내용을 입력해주세요";
    }

    if (!formData.location.trim()) {
      newErrors.location = "위치를 입력해주세요";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "마감일을 선택해주세요";
    }

    if (!formData.manager) {
      newErrors.manager = "관리자를 입력해주세요";
    }

    if (!formData.receiver) {
      newErrors.receiver = "담당자를 입력해주세요";
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
      await updateInstructionMutation.mutateAsync({
        id,
        ...formData,
      });

      showSuccess("지시가 성공적으로 수정되었습니다.");
      navigate(`/instructions/${id}`);
    } catch (error) {
      console.error("지시 수정 실패:", error);
      setErrors({
        submit: "지시를 수정하는 중 오류가 발생했습니다.",
      });
    }
  };

  const handleCancel = () => {
    navigate(`/instructions/${id}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="px-4 py-6 mx-auto">
        <div className="px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded">
          지시를 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 mx-auto">
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
        <h1 className="text-2xl font-bold">지시 수정</h1>
      </div>

      <FormCard>
        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div>
              <FormInput
                id="title"
                name="title"
                label="제목"
                placeholder="지시 제목을 입력하세요"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                required
              />
            </div>

            <div>
              <FormInput
                id="location"
                name="location"
                label="위치"
                placeholder="작업 위치를 입력하세요"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <FormInput
              id="address"
              name="address"
              label="주소"
              placeholder="상세 주소를 입력하세요"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
            />
          </div>

          <div className="mb-6">
            <FormTextArea
              id="description"
              name="description"
              label="상세 내용"
              placeholder="지시 내용을 상세하게 입력하세요"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
            <div>
              <FormSelect
                id="status"
                name="status"
                label="상태"
                value={formData.status}
                onChange={handleChange}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </FormSelect>
            </div>

            <div>
              <FormSelect
                id="priority"
                name="priority"
                label="우선순위"
                value={formData.priority}
                onChange={handleChange}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </FormSelect>
            </div>

            <div>
              <FormInput
                id="dueDate"
                name="dueDate"
                label="마감일"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                error={errors.dueDate}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
            <div>
              <FormInput
                id="manager"
                name="manager"
                label="관리자"
                placeholder="관리자 이름을 입력하세요"
                value={formData.manager}
                onChange={handleChange}
                error={errors.manager}
                required
              />
            </div>

            <div>
              <FormInput
                id="receiver"
                name="receiver"
                label="담당자"
                placeholder="담당자 이름을 입력하세요"
                value={formData.receiver}
                onChange={handleChange}
                error={errors.receiver}
                required
              />
            </div>

            <div>
              <FormSelect
                id="channel"
                name="channel"
                label="접수 채널"
                value={formData.channel}
                onChange={handleChange}
              >
                <option value="PHONE">전화</option>
                <option value="EMAIL">이메일</option>
                <option value="SYSTEM">시스템</option>
                <option value="OTHER">기타</option>
              </FormSelect>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <FormButton type="button" variant="outline" onClick={handleCancel}>
              취소
            </FormButton>
            <FormButton
              type="submit"
              disabled={updateInstructionMutation.isLoading}
            >
              {updateInstructionMutation.isLoading ? "처리 중..." : "저장"}
            </FormButton>
          </div>
        </form>
      </FormCard>
    </div>
  );
};

export default InstructionEdit;
