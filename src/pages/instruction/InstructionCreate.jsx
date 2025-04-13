import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateInstruction } from "../../lib/api/instructionQueries";
import {
  FormButton,
  FormInput,
  FormSelect,
  FormTextArea,
  FormCard,
} from "../../components/molecules";

const InstructionCreate = () => {
  const navigate = useNavigate();
  const createInstructionMutation = useCreateInstruction();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    priority: "중간",
    status: "대기중",
    dueDate: "",
    attachments: [],
  });

  const [errors, setErrors] = useState({});

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
      const newInstruction = {
        ...formData,
        id: `INS-${new Date().getFullYear()}-${String(
          Math.floor(Math.random() * 10000)
        ).padStart(4, "0")}`,
        createdAt: new Date().toISOString().split("T")[0],
      };

      await createInstructionMutation.mutateAsync(newInstruction);
      navigate("/instructions");
    } catch (error) {
      console.error("지시 생성 실패:", error);
      setErrors({
        submit: "지시를 생성하는 중 오류가 발생했습니다.",
      });
    }
  };

  const handleCancel = () => {
    navigate("/instructions");
  };

  // 현재 날짜로부터 1주일 후 날짜 계산 (기본 마감일)
  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">새 지시 등록</h1>

      <FormCard>
        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <FormSelect
                id="status"
                name="status"
                label="상태"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: "대기중", label: "대기중" },
                  { value: "진행중", label: "진행중" },
                  { value: "완료", label: "완료" },
                  { value: "취소", label: "취소" },
                ]}
              />
            </div>

            <div>
              <FormSelect
                id="priority"
                name="priority"
                label="우선순위"
                value={formData.priority}
                onChange={handleChange}
                options={[
                  { value: "높음", label: "높음" },
                  { value: "중간", label: "중간" },
                  { value: "낮음", label: "낮음" },
                ]}
              />
            </div>

            <div>
              <FormInput
                id="dueDate"
                name="dueDate"
                label="마감일"
                type="date"
                value={formData.dueDate || getDefaultDueDate()}
                onChange={handleChange}
                error={errors.dueDate}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <FormButton type="button" variant="outline" onClick={handleCancel}>
              취소
            </FormButton>
            <FormButton
              type="submit"
              disabled={createInstructionMutation.isLoading}
            >
              {createInstructionMutation.isLoading ? "처리 중..." : "저장"}
            </FormButton>
          </div>
        </form>
      </FormCard>
    </div>
  );
};

export default InstructionCreate;
