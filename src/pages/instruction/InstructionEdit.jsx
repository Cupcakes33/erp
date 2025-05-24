import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useInstruction,
  useUpdateInstruction,
  useAllProcesses,
} from "../../lib/api/instructionQueries";
import {
  FormButton,
  FormInput,
  FormSelect,
  FormTextArea,
  FormCard,
  showSuccess,
  showError,
  Loading,
} from "../../components/molecules";
import { ArrowLeft, Save } from "lucide-react";

// 채널 상수
// const CHANNEL_OPTIONS = [
//   { value: "전화", label: "전화" },
//   { value: "이메일", label: "이메일" },
//   { value: "직접방문", label: "직접방문" },
//   { value: "기타", label: "기타" },
// ];

const InstructionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useInstruction(id);
  const updateInstructionMutation = useUpdateInstruction();
  const { data: processesData, isLoading: processesLoading } = useAllProcesses(
    id,
    { size: 100 }
  );

  const [formData, setFormData] = useState({
    orderId: 0,
    orderNumber: "",
    orderDate: "",
    name: "",
    manager: "",
    delegator: "",
    channel: "",
    district: "",
    dong: "",
    lotNumber: "",
    detailAddress: "",
    structure: "",
    memo: "",
    status: "접수",
    processId: "",
    contact1: "",
    contact2: "",
    contact3: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (response) {
      const instruction = response;
      setFormData({
        orderId: instruction.orderId || 0,
        orderNumber: instruction.orderNumber || "",
        orderDate: instruction.orderDate || "",
        name: instruction.name || "",
        manager: instruction.manager || "",
        delegator: instruction.delegator || "",
        channel: instruction.channel || "",
        district: instruction.district || "",
        dong: instruction.dong || "",
        lotNumber: instruction.lotNumber || "",
        detailAddress: instruction.detailAddress || "",
        structure: instruction.structure || "",
        memo: instruction.memo || "",
        status: instruction.status || "접수",
        processId: instruction.processId
          ? instruction.processId.toString()
          : "",
        contact1: instruction.contact1 || "",
        contact2: instruction.contact2 || "",
        contact3: instruction.contact3 || "",
      });
    }
  }, [response]);

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
        status: formData.status,
        processId: formData.processId ? Number(formData.processId) : null,
        contact1: formData.contact1,
        contact2: formData.contact2,
        contact3: formData.contact3,
      };

      await updateInstructionMutation.mutateAsync({
        id,
        ...payload,
      });
      showSuccess("지시가 성공적으로 수정되었습니다.");
      navigate(`/instructions/${id}`);
    } catch (error) {
      console.error("지시 수정 실패:", error);
      setErrors({
        submit: "지시 수정 중 오류가 발생했습니다.",
      });
    }
  };

  const handleCancel = () => {
    navigate(`/instructions/${id}`);
  };

  // 공종 목록 가공
  const processOptions =
    processesData?.processes?.map((process) => ({
      value: process.id.toString(),
      label: process.name,
    })) || [];

  // 공종 선택 옵션에 빈 값 추가
  const processSelectOptions = [
    { value: "", label: "공종 선택" },
    ...processOptions,
  ];

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="px-4 py-6 mx-auto bg-gray-50">
        <div className="px-6 py-4 text-red-700 bg-red-100 border border-red-400 rounded-lg shadow">
          <p className="mb-2">지시 정보를 불러오는 중 오류가 발생했습니다.</p>
          <FormButton
            onClick={() => navigate("/instructions")}
            variant="outline"
            className="mt-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로 돌아가기
          </FormButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">지시 수정</h1>

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
                required
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
                isLoading={processesLoading}
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
            {/* <FormSelect
              id="channel"
              name="channel"
              label="채널"
              value={formData.channel}
              onChange={handleChange}
              options={CHANNEL_OPTIONS}
            /> */}
            <FormInput
              id="channel"
              name="channel"
              label="채널"
              placeholder="채널을 입력하세요"
              value={formData.channel}
              onChange={handleChange}
            />
          </div>

          <h2 className="text-lg font-semibold mb-4 mt-6">위치 정보</h2>
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

          <div className="mb-6">
            <FormTextArea
              id="memo"
              name="memo"
              label="비고"
              placeholder="비고 사항을 입력하세요"
              value={formData.memo}
              onChange={handleChange}
              rows={3}
            />
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
              isLoading={updateInstructionMutation.isLoading}
            >
              저장
            </FormButton>
          </div>
        </form>
      </FormCard>
    </div>
  );
};

export default InstructionEdit;
