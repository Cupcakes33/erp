import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateInstruction,
  useAllProcesses,
} from "../../lib/api/instructionQueries";
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
  // 지시 생성 화면에서는 공종 목록을 불러오지 않음 (특정 지시 ID가 필요하기 때문)
  // 실제 화면에서는 공종 목록이 필요할 수 있으므로, 임시로 빈 배열 할당
  const [processOptions, setProcessOptions] = useState([]);
  const [isProcessesLoading, setIsProcessesLoading] = useState(false);

  // 오늘 날짜 YYYY-MM-DD 형식으로 가져오기
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    orderId: 0,
    orderNumber: "",
    orderDate: today,
    name: "",
    manager: "",
    delegator: "",
    channel: "전화",
    district: "",
    dong: "",
    lotNumber: "",
    detailAddress: "",
    structure: "",
    memo: "",
    processId: "",
    contact1: "",
    contact2: "",
    contact3: "",
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

    if (!formData.name.trim()) {
      newErrors.name = "제목을 입력해주세요";
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
      // 새 스키마에 맞게 데이터 형식 변환
      const payload = {
        orderId: formData.orderId,
        orderNumber: formData.orderNumber,
        name: formData.name,
        orderDate: formData.orderDate,
        manager: formData.manager,
        delegator: formData.delegator,
        channel: formData.channel,
        district: formData.district,
        dong: formData.dong,
        lotNumber: formData.lotNumber,
        detailAddress: formData.detailAddress,
        structure: formData.structure,
        memo: formData.memo,
        status: "접수", // 기본 상태
        processId: formData.processId ? Number(formData.processId) : null,
        contact1: formData.contact1,
        contact2: formData.contact2,
        contact3: formData.contact3,
      };

      await createInstructionMutation.mutateAsync(payload);
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

  // 공종 선택 옵션에 빈 값 추가
  const processSelectOptions = [
    { value: "", label: "공종 선택" },
    ...processOptions,
  ];

  return (
    <div className="px-4 py-6 mx-auto">
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
                id="name"
                name="name"
                label="제목"
                placeholder="지시 제목을 입력하세요"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
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
                id="orderId"
                name="orderId"
                label="지시ID"
                placeholder="지시ID를 입력하세요"
                value={formData.orderId}
                onChange={handleChange}
                type="number"
              />
            </div>
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
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div>
              <FormSelect
                id="processId"
                name="processId"
                label="공종"
                value={formData.processId}
                onChange={handleChange}
                options={processSelectOptions}
                isLoading={isProcessesLoading}
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

          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
            <div>
              <FormInput
                id="contact1"
                name="contact1"
                label="연락처1"
                placeholder="연락처1을 입력하세요"
                value={formData.contact1}
                onChange={handleChange}
              />
            </div>
            <div>
              <FormInput
                id="contact2"
                name="contact2"
                label="연락처2"
                placeholder="연락처2를 입력하세요"
                value={formData.contact2}
                onChange={handleChange}
              />
            </div>
            <div>
              <FormInput
                id="contact3"
                name="contact3"
                label="연락처3"
                placeholder="연락처3을 입력하세요"
                value={formData.contact3}
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

          <h2 className="mt-6 mb-4 text-lg font-semibold">위치 정보</h2>
          <div className="grid grid-cols-3 gap-6">
            <FormInput
              id="district"
              name="district"
              label="시/군/구"
              placeholder="시/군/구를 입력하세요"
              value={formData.district}
              onChange={handleChange}
            />
            <FormInput
              id="dong"
              name="dong"
              label="동/읍/면"
              placeholder="동/읍/면을 입력하세요"
              value={formData.dong}
              onChange={handleChange}
            />
            <FormInput
              id="lotNumber"
              name="lotNumber"
              label="지번"
              placeholder="지번을 입력하세요"
              value={formData.lotNumber}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-6 mt-6">
            <FormInput
              id="detailAddress"
              name="detailAddress"
              label="상세주소"
              placeholder="상세주소를 입력하세요"
              value={formData.detailAddress}
              onChange={handleChange}
            />
            <FormInput
              id="structure"
              name="structure"
              label="건물구조"
              placeholder="건물구조를 입력하세요"
              value={formData.structure}
              onChange={handleChange}
            />
          </div>

          <div className="mt-6">
            <FormTextArea
              id="memo"
              name="memo"
              label="비고"
              placeholder="추가 정보를 입력하세요"
              value={formData.memo}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="flex justify-end mt-8 space-x-4">
            <FormButton
              type="button"
              className="w-32"
              onClick={() => navigate(-1)}
              outline
            >
              취소
            </FormButton>
            <FormButton
              type="submit"
              className="w-32"
              disabled={createInstructionMutation.isPending}
              loading={createInstructionMutation.isPending}
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
