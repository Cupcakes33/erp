import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateInstruction } from "../../lib/api/instructionQueries";
import {
  FormButton,
  FormInput,
  FormSelect,
  FormTextArea,
  FormCard,
  showSuccess,
} from "../../components/molecules";

// 상태 및 채널 상수
const STATUS_OPTIONS = [
  { value: "접수", label: "접수" },
  { value: "작업중", label: "작업중" },
  { value: "작업완료", label: "작업완료" },
  { value: "결재중", label: "결재중" },
  { value: "완료", label: "완료" },
];

const CHANNEL_OPTIONS = [
  { value: "전화", label: "전화" },
  { value: "이메일", label: "이메일" },
  { value: "직접방문", label: "직접방문" },
  { value: "기타", label: "기타" },
];

const InstructionCreate = () => {
  const navigate = useNavigate();
  const createInstructionMutation = useCreateInstruction();

  // 오늘 날짜 YYYY-MM-DD 형식으로 가져오기
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    orderId: 0,
    orderNumber: "",
    orderDate: today,
    title: "",
    manager: "",
    delegator: "",
    channel: "전화",
    district: "",
    dong: "",
    lotNumber: "",
    detailAddress: "",
    structure: "",
    round: 1,
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createInstructionMutation.mutateAsync(formData);
      showSuccess("지시가 성공적으로 생성되었습니다.");
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

  return (
    <div className="mx-auto px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">새 지시 등록</h1>

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
                id="orderNumber"
                name="orderNumber"
                label="지시번호"
                placeholder="지시번호를 입력하세요"
                value={formData.orderNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div>
              <FormInput
                id="orderDate"
                name="orderDate"
                label="지시일자"
                type="date"
                value={formData.orderDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <FormInput
                id="round"
                name="round"
                label="회차"
                type="number"
                min="1"
                value={formData.round}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div>
              <FormInput
                id="manager"
                name="manager"
                label="관리자"
                placeholder="관리자 이름을 입력하세요"
                value={formData.manager}
                onChange={handleChange}
              />
            </div>
            <div>
              <FormInput
                id="delegator"
                name="delegator"
                label="위임자"
                placeholder="위임자 이름을 입력하세요"
                value={formData.delegator}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-6">
            <FormSelect
              id="channel"
              name="channel"
              label="채널"
              value={formData.channel}
              onChange={handleChange}
              options={CHANNEL_OPTIONS}
            />
          </div>

          <h3 className="mb-3 text-lg font-medium">위치 정보</h3>
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
            <div>
              <FormInput
                id="district"
                name="district"
                label="지역"
                placeholder="지역을 입력하세요"
                value={formData.district}
                onChange={handleChange}
              />
            </div>
            <div>
              <FormInput
                id="dong"
                name="dong"
                label="동"
                placeholder="동을 입력하세요"
                value={formData.dong}
                onChange={handleChange}
              />
            </div>
            <div>
              <FormInput
                id="lotNumber"
                name="lotNumber"
                label="지번"
                placeholder="지번을 입력하세요"
                value={formData.lotNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div>
              <FormInput
                id="detailAddress"
                name="detailAddress"
                label="상세주소"
                placeholder="상세주소를 입력하세요"
                value={formData.detailAddress}
                onChange={handleChange}
              />
            </div>
            <div>
              <FormInput
                id="structure"
                name="structure"
                label="구조물"
                placeholder="구조물을 입력하세요"
                value={formData.structure}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <FormButton
              variant="outline"
              type="button"
              onClick={handleCancel}
              className="w-24"
            >
              취소
            </FormButton>
            <FormButton
              variant="primary"
              type="submit"
              className="w-24"
              isLoading={createInstructionMutation.isLoading}
            >
              저장
            </FormButton>
          </div>
        </form>
      </FormCard>
    </div>
  );
};

export default InstructionCreate;
