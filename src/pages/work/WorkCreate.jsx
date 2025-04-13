import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateWork } from "../../lib/api/workQueries";
import { useInstructions } from "../../lib/api/instructionQueries";
import {
  FormButton,
  FormInput,
  FormSelect,
  FormTextArea,
  FormCard,
} from "../../components/molecules";
import { ArrowLeft } from "lucide-react";

const WorkCreate = () => {
  const navigate = useNavigate();
  const createWorkMutation = useCreateWork();
  const { data: instructions = [], isLoading: isLoadingInstructions } =
    useInstructions();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instructionId: "",
    location: "",
    assignedTo: "",
    status: "대기중",
    completionRate: 0,
    startDate: "",
    dueDate: "",
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

    // 지시 선택 시 위치 자동 설정
    if (name === "instructionId" && value) {
      const selectedInstruction = instructions.find(
        (instruction) => instruction.id === value
      );
      if (selectedInstruction) {
        setFormData((prev) => ({
          ...prev,
          location: selectedInstruction.location,
          instructionId: value,
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "작업명을 입력해주세요";
    }

    if (!formData.location.trim()) {
      newErrors.location = "위치를 입력해주세요";
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = "담당자를 입력해주세요";
    }

    if (
      formData.startDate &&
      formData.dueDate &&
      new Date(formData.startDate) > new Date(formData.dueDate)
    ) {
      newErrors.dueDate = "마감일은 시작일 이후여야 합니다";
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
      const newWork = {
        ...formData,
        id: `WRK-${new Date().getFullYear()}-${String(
          Math.floor(Math.random() * 10000)
        ).padStart(4, "0")}`,
        createdAt: new Date().toISOString().split("T")[0],
        completionRate: parseInt(formData.completionRate) || 0,
      };

      // 지시 제목 추가
      if (formData.instructionId) {
        const instruction = instructions.find(
          (i) => i.id === formData.instructionId
        );
        if (instruction) {
          newWork.instructionTitle = instruction.title;
        }
      }

      await createWorkMutation.mutateAsync(newWork);
      navigate("/works");
    } catch (error) {
      console.error("작업 생성 실패:", error);
      setErrors({
        submit: "작업을 생성하는 중 오류가 발생했습니다.",
      });
    }
  };

  const handleCancel = () => {
    navigate("/works");
  };

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
        <h1 className="text-2xl font-bold">새 작업 등록</h1>
      </div>

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
                id="name"
                name="name"
                label="작업명"
                placeholder="작업명을 입력하세요"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
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
              placeholder="작업 내용을 상세하게 입력하세요"
              value={formData.description}
              onChange={handleChange}
              rows={5}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <FormSelect
                id="instructionId"
                name="instructionId"
                label="연결된 지시"
                value={formData.instructionId}
                onChange={handleChange}
                options={[
                  { value: "", label: "선택 안함" },
                  ...instructions.map((instruction) => ({
                    value: instruction.id,
                    label: `${instruction.id} - ${instruction.title}`,
                  })),
                ]}
              />
            </div>

            <div>
              <FormInput
                id="assignedTo"
                name="assignedTo"
                label="담당자"
                placeholder="담당자 이름을 입력하세요"
                value={formData.assignedTo}
                onChange={handleChange}
                error={errors.assignedTo}
                required
              />
            </div>

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
              <FormInput
                id="completionRate"
                name="completionRate"
                type="number"
                label="진행률 (%)"
                placeholder="0"
                min="0"
                max="100"
                value={formData.completionRate}
                onChange={handleChange}
              />
            </div>

            <div>
              <FormInput
                id="startDate"
                name="startDate"
                type="date"
                label="시작일"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <FormInput
                id="dueDate"
                name="dueDate"
                type="date"
                label="마감일"
                value={formData.dueDate}
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
            <FormButton type="submit" disabled={createWorkMutation.isLoading}>
              {createWorkMutation.isLoading ? "처리 중..." : "저장"}
            </FormButton>
          </div>
        </form>
      </FormCard>
    </div>
  );
};

export default WorkCreate;
