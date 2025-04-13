import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInstructions } from "../../lib/api/instructionQueries";
import { useWork, useUpdateWork } from "../../lib/api/workQueries";
import Button from "../../components/atoms/Button";
import Input from "../../components/atoms/Input";
import Select from "../../components/atoms/Select";
import TextArea from "../../components/atoms/TextArea";
import Card from "../../components/atoms/Card";
import FormGroup from "../../components/molecules/FormGroup";

const WorkEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: instructions = [] } = useInstructions();
  const {
    data: currentWork,
    isLoading: isLoadingWork,
    error: workError,
  } = useWork(id);

  const updateWorkMutation = useUpdateWork();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instructionId: "",
    instructionTitle: "",
    location: "",
    assignedTo: "",
    startDate: "",
    endDate: "",
    status: "",
    completionRate: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentWork) {
      // 폼 데이터 초기화
      setFormData({
        name: currentWork.name || "",
        description: currentWork.description || "",
        instructionId: currentWork.instructionId || "",
        instructionTitle: currentWork.instructionTitle || "",
        location: currentWork.location || "",
        assignedTo: currentWork.assignedTo || "",
        startDate: currentWork.startDate || "",
        endDate: currentWork.endDate || "",
        status: currentWork.status || "",
        completionRate: currentWork.completionRate
          ? String(currentWork.completionRate)
          : "",
      });
    }
  }, [currentWork]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
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
          instructionTitle: selectedInstruction.title,
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "작업명을 입력해주세요.";
    }

    if (!formData.instructionId) {
      newErrors.instructionId = "지시를 선택해주세요.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "위치를 입력해주세요.";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      newErrors.endDate = "종료일은 시작일 이후여야 합니다.";
    }

    if (
      formData.completionRate &&
      (isNaN(Number(formData.completionRate)) ||
        Number(formData.completionRate) < 0 ||
        Number(formData.completionRate) > 100)
    ) {
      newErrors.completionRate = "진행률은 0에서 100 사이의 숫자여야 합니다.";
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
      // 숫자 필드 변환
      const workData = {
        ...formData,
        completionRate: formData.completionRate
          ? Number(formData.completionRate)
          : 0,
      };

      await updateWorkMutation.mutateAsync({
        id,
        data: workData,
      });

      navigate(`/works/${id}`);
    } catch (error) {
      setErrors({
        ...errors,
        submit: error.message || "작업 수정 중 오류가 발생했습니다.",
      });
    }
  };

  if (isLoadingWork && !currentWork) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (workError) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        {workError instanceof Error
          ? workError.message
          : "데이터를 불러오는 중 오류가 발생했습니다."}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">작업 수정</h1>
        <Button
          variant="outline"
          onClick={() => navigate(`/works/${id}`)}
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md"
        >
          취소
        </Button>
      </div>

      <Card className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormGroup
                label="작업명"
                htmlFor="name"
                required
                error={errors.name}
              >
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="작업명을 입력하세요"
                  required
                  error={errors.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormGroup>
            </div>

            <div className="md:col-span-2">
              <FormGroup label="설명" htmlFor="description">
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="작업에 대한 상세 설명을 입력하세요"
                  rows={4}
                />
              </FormGroup>
            </div>

            <FormGroup
              label="지시"
              htmlFor="instructionId"
              required
              error={errors.instructionId}
            >
              <Select
                id="instructionId"
                name="instructionId"
                value={formData.instructionId}
                onChange={handleChange}
                required
                error={errors.instructionId}
                options={[
                  { value: "", label: "지시 선택" },
                  ...instructions.map((instruction) => ({
                    value: instruction.id,
                    label: `${instruction.id} - ${instruction.title}`,
                  })),
                ]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>

            <FormGroup
              label="위치"
              htmlFor="location"
              required
              error={errors.location}
            >
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="작업 위치를 입력하세요"
                required
                error={errors.location}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>

            <FormGroup label="담당자" htmlFor="assignedTo">
              <Input
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="담당자 이름"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>

            <FormGroup label="상태" htmlFor="status">
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: "대기중", label: "대기중" },
                  { value: "진행중", label: "진행중" },
                  { value: "완료", label: "완료" },
                  { value: "취소", label: "취소" },
                ]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>

            <FormGroup
              label="진행률 (%)"
              htmlFor="completionRate"
              error={errors.completionRate}
            >
              <Input
                id="completionRate"
                name="completionRate"
                type="number"
                value={formData.completionRate}
                onChange={handleChange}
                placeholder="0-100 사이의 값"
                min="0"
                max="100"
                error={errors.completionRate}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>

            <FormGroup label="시작일" htmlFor="startDate">
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>

            <FormGroup label="종료일" htmlFor="endDate" error={errors.endDate}>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                error={errors.endDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>
          </div>

          {errors.submit && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md my-4">
              {errors.submit}
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              variant="primary"
              disabled={updateWorkMutation.isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateWorkMutation.isLoading ? "저장 중..." : "변경사항 저장"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default WorkEdit;
