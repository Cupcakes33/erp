import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateInstruction,
  // useAllProcesses, // 기존 공종 관련 훅 제거
} from "../../lib/api/instructionQueries";
import {
  fetchContractsByCenter, // 추가
  getPaymentsByContract, // 수정
} from "../../lib/api/instructionAPI"; // 추가
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

// 센터 선택 옵션 상수 추가
const CENTER_OPTIONS = [
  { value: "강동", label: "강동" },
  { value: "성북", label: "성북" },
  // 필요에 따라 다른 센터 추가
];

// const CHANNEL_OPTIONS = [
//   { value: "전화", label: "전화" },
//   { value: "이메일", label: "이메일" },
//   { value: "직접방문", label: "직접방문" },
//   { value: "기타", label: "기타" },
// ];

const InstructionCreate = () => {
  const navigate = useNavigate();
  const createInstructionMutation = useCreateInstruction();

  // 오늘 날짜 YYYY-MM-DD 형식으로 가져오기
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    orderId: 0,
    orderNumber: "",
    orderDate: today,
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
    // processId: "", // 기존 공종 ID 제거
    contact1: "",
    contact2: "",
    contact3: "",
  });

  // 새로운 상태 추가
  const [selectedCenter, setSelectedCenter] = useState("");
  const [contracts, setContracts] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState("");
  const [payments, setPayments] = useState([]); // 'rounds'에서 'payments'로 이름 변경
  const [selectedPaymentId, setSelectedPaymentId] = useState(""); // 'selectedRound'에서 이름 변경 및 ID 저장용

  const [isContractsLoading, setIsContractsLoading] = useState(false);
  const [isPaymentsLoading, setIsPaymentsLoading] = useState(false); // 'isRoundsLoading'에서 이름 변경

  const [errors, setErrors] = useState({});

  // 센터 변경 시 계약 목록 조회
  useEffect(() => {
    if (selectedCenter) {
      const fetchContracts = async () => {
        setIsContractsLoading(true);
        setContracts([]);
        setSelectedContractId("");
        setPayments([]); // 초기화
        setSelectedPaymentId(""); // 초기화
        try {
          const res = await fetchContractsByCenter(selectedCenter);
          setContracts(
            res.data
              ? res.data.map((c) => ({
                  value: c.id.toString(),
                  label: c.name || `계약 ID: ${c.id}`,
                }))
              : []
          );
        } catch (error) {
          console.error("계약 목록 조회 실패:", error);
          setErrors((prev) => ({
            ...prev,
            contracts: "계약 목록을 불러오는 중 오류가 발생했습니다.",
          }));
        } finally {
          setIsContractsLoading(false);
        }
      };
      fetchContracts();
    } else {
      setContracts([]);
      setSelectedContractId("");
      setPayments([]);
      setSelectedPaymentId("");
    }
  }, [selectedCenter]);

  // 계약 변경 시 회차 목록 조회
  useEffect(() => {
    if (selectedContractId) {
      const fetchPayments = async () => {
        setIsPaymentsLoading(true);
        setPayments([]);
        setSelectedPaymentId("");
        try {
          const res = await getPaymentsByContract(selectedContractId);
          const paymentsData = res.data?.data || [];
          const validPayments = paymentsData.filter((p) => p && p.id != null);
          setPayments(validPayments);
        } catch (error) {
          console.error("회차 목록 조회 실패:", error);
          setErrors((prev) => ({
            ...prev,
            payments: "회차 목록을 불러오는 중 오류가 발생했습니다.",
          }));
        } finally {
          setIsPaymentsLoading(false);
        }
      };
      fetchPayments();
    } else {
      setPayments([]);
      setSelectedPaymentId("");
    }
  }, [selectedContractId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "center") {
      setSelectedCenter(value);
      setSelectedContractId("");
      setContracts([]);
      setSelectedPaymentId("");
      setPayments([]);
      if (errors.center) {
        setErrors((prev) => ({ ...prev, center: "" }));
      }
    } else if (name === "contractId") {
      setSelectedContractId(value);
      setSelectedPaymentId("");
      setPayments([]);
      if (errors.contractId) {
        setErrors((prev) => ({ ...prev, contractId: "" }));
      }
    } else if (name === "paymentId") {
      setSelectedPaymentId(value);
      if (errors.paymentId) {
        setErrors((prev) => ({ ...prev, paymentId: "" }));
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (errors[name] && name !== "center" && name !== "contractId") {
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
    if (!selectedCenter) {
      newErrors.center = "센터를 선택해주세요.";
    }
    if (!selectedContractId) {
      newErrors.contractId = "계약을 선택해주세요.";
    }
    if (!selectedPaymentId) {
      newErrors.paymentId = "회차를 선택해주세요.";
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
      // 선택된 paymentId로 payment 객체를 찾고, 거기서 round 번호를 추출
      const selectedPayment = payments.find(
        (p) => p.id.toString() === selectedPaymentId
      );
      const roundToSubmit = selectedPayment ? selectedPayment.round : null;

      if (roundToSubmit === null) {
        setErrors((prev) => ({
          ...prev,
          paymentId: "유효한 회차를 선택해주세요.",
        }));
        return;
      }

      const payload = {
        ...formData,
        center: selectedCenter,
        contractId: Number(selectedContractId),
        paymentId: Number(selectedPaymentId),
        round: Number(roundToSubmit), // 'round' 번호를 제출
        status: "접수",
      };

      if (payload.orderId === 0 || payload.orderId === "") {
        delete payload.orderId;
      } else {
        payload.orderId = Number(payload.orderId);
      }

      await createInstructionMutation.mutateAsync(payload);
      showSuccess("지시가 성공적으로 생성되었습니다.");
      navigate("/instructions");
    } catch (error) {
      console.error("지시 생성 실패:", error);
      let submitError = "지시 생성 중 오류가 발생했습니다.";
      if (error.response?.data?.message) {
        submitError = error.response.data.message;
      }
      setErrors({ submit: submitError });
    }
  };

  const handleCancel = () => {
    navigate("/instructions");
  };

  return (
    <div className="px-4 py-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">지시 등록</h1>

      <FormCard>
        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
            <div>
              <FormSelect
                id="center"
                name="center"
                label="센터"
                value={selectedCenter}
                onChange={handleChange}
                options={CENTER_OPTIONS}
                error={errors.center}
                required
              />
            </div>
            <div>
              <FormSelect
                id="contractId"
                name="contractId"
                label="계약"
                value={selectedContractId}
                onChange={handleChange}
                options={contracts}
                isLoading={isContractsLoading}
                disabled={!selectedCenter || isContractsLoading}
                error={errors.contractId}
                required
              />
            </div>
            <div>
              <FormSelect
                id="paymentId"
                name="paymentId"
                label="회차"
                value={selectedPaymentId}
                onChange={handleChange}
                options={payments.map((p) => ({
                  value: p.id.toString(),
                  label: `${p.round}회차`,
                }))}
                isLoading={isPaymentsLoading}
                disabled={!selectedContractId || isPaymentsLoading}
                error={errors.paymentId}
                required
              />
            </div>
          </div>

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
                label="지시ID (선택)" // 사용자에게 선택 사항임을 명시
                placeholder="지시ID를 입력하세요 (숫자)"
                value={formData.orderId === 0 ? "" : formData.orderId} // 0일 경우 빈 문자열로 표시
                onChange={handleChange}
                type="number" // type을 number로 유지하되, 입력 처리는 유연하게
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
            <FormInput
              id="channel"
              name="channel"
              label="채널"
              placeholder="채널을 입력하세요"
              value={formData.channel}
              onChange={handleChange}
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

          <div className="flex items-center justify-end mt-8 space-x-3">
            <FormButton type="button" onClick={handleCancel} variant="outline">
              취소
            </FormButton>
            <FormButton
              type="submit"
              disabled={
                createInstructionMutation.isPending ||
                isContractsLoading ||
                isPaymentsLoading
              }
              loading={createInstructionMutation.isPending}
            >
              생성
            </FormButton>
          </div>
        </form>
      </FormCard>
    </div>
  );
};

export default InstructionCreate;
