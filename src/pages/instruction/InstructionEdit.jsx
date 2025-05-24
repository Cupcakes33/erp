import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useInstruction,
  useUpdateInstruction,
} from "../../lib/api/instructionQueries";
import {
  fetchContractsByCenter,
  fetchPaymentsByContract,
} from "../../lib/api/instructionAPI";
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

// 센터 선택 옵션 상수 추가 (InstructionCreate.jsx와 동일하게 사용 가능)
const CENTER_OPTIONS = [
  { value: "강동", label: "강동" },
  { value: "성북", label: "성북" },
  // 필요에 따라 다른 센터 추가
];

const InstructionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: instructionData,
    isLoading: isInstructionLoading,
    error: instructionError,
  } = useInstruction(id);
  const updateInstructionMutation = useUpdateInstruction();

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
    contact1: "",
    contact2: "",
    contact3: "",
  });

  const [selectedCenter, setSelectedCenter] = useState("");
  const [contracts, setContracts] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState("");
  const [payments, setPayments] = useState([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");

  const [initialCenter, setInitialCenter] = useState("");
  const [initialContractId, setInitialContractId] = useState("");
  const [initialPaymentId, setInitialPaymentId] = useState("");

  const [isContractsLoading, setIsContractsLoading] = useState(false);
  const [isPaymentsLoading, setIsPaymentsLoading] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (instructionData && instructionData.data) {
      const instruction = instructionData.data;
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
        contact1: instruction.contact1 || "",
        contact2: instruction.contact2 || "",
        contact3: instruction.contact3 || "",
      });

      const centerFromServer = instruction.center;
      const paymentIdFromServer = instruction.paymentId;

      if (centerFromServer) {
        setInitialCenter(centerFromServer);
        setSelectedCenter(centerFromServer);
      }
      if (paymentIdFromServer) {
        setInitialPaymentId(paymentIdFromServer.toString());
      }
    }
  }, [instructionData]);

  useEffect(() => {
    if (selectedCenter) {
      const fetchAndSetContracts = async () => {
        setIsContractsLoading(true);
        setContracts([]);
        setSelectedContractId("");
        setPayments([]);
        setSelectedPaymentId("");
        try {
          const contractsResponse = await fetchContractsByCenter(
            selectedCenter
          );
          const fetchedContracts = contractsResponse.data
            ? contractsResponse.data.map((c) => ({
                value: c.id.toString(),
                label: c.name || `계약 ID: ${c.id}`,
              }))
            : [];
          setContracts(fetchedContracts);
        } catch (error) {
          console.error("계약 목록 조회 실패:", error);
          setErrors((prev) => ({ ...prev, contracts: "계약 목록 조회 실패" }));
        } finally {
          setIsContractsLoading(false);
        }
      };
      fetchAndSetContracts();
    } else {
      setContracts([]);
      setSelectedContractId("");
      setPayments([]);
      setSelectedPaymentId("");
    }
  }, [selectedCenter]);

  useEffect(() => {
    if (selectedContractId) {
      const fetchAndSetPayments = async () => {
        setIsPaymentsLoading(true);
        setPayments([]);
        setSelectedPaymentId("");
        try {
          const paymentsResponse = await fetchPaymentsByContract(
            selectedContractId
          );
          const fetchedPayments = paymentsResponse.data
            ? paymentsResponse.data.map((p) => ({
                value: p.id.toString(),
                label: p.name || `회차 ID: ${p.id} (Round: ${p.round})`,
              }))
            : [];
          setPayments(fetchedPayments);

          if (
            initialPaymentId &&
            fetchedPayments.some((p) => p.value === initialPaymentId)
          ) {
            setSelectedPaymentId(initialPaymentId);
            setInitialPaymentId("");
          }
        } catch (error) {
          console.error("회차 목록 조회 실패:", error);
          setErrors((prev) => ({ ...prev, payments: "회차 목록 조회 실패" }));
        } finally {
          setIsPaymentsLoading(false);
        }
      };
      fetchAndSetPayments();
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
      if (errors.center) setErrors((prev) => ({ ...prev, center: "" }));
    } else if (name === "contractId") {
      setSelectedContractId(value);
      setSelectedPaymentId("");
      setPayments([]);
      if (errors.contractId) setErrors((prev) => ({ ...prev, contractId: "" }));
    } else if (name === "paymentId") {
      setSelectedPaymentId(value);
      if (errors.paymentId) setErrors((prev) => ({ ...prev, paymentId: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name] && !["center", "contractId", "paymentId"].includes(name)) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "제목을 입력해주세요";
    if (!selectedCenter) newErrors.center = "센터를 선택해주세요.";
    if (!selectedContractId) newErrors.contractId = "계약을 선택해주세요.";
    if (!selectedPaymentId) newErrors.paymentId = "회차를 선택해주세요.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        center: selectedCenter,
        paymentId: selectedPaymentId ? Number(selectedPaymentId) : null,
      };

      if (payload.orderId && typeof payload.orderId !== "number") {
        payload.orderId = Number(payload.orderId);
      }

      await updateInstructionMutation.mutateAsync({
        id,
        instructionData: payload,
      });
      showSuccess("지시가 성공적으로 수정되었습니다.");
      navigate(`/instructions/${id}`);
    } catch (error) {
      console.error("지시 수정 실패:", error);
      let submitError = "지시 수정 중 오류가 발생했습니다.";
      if (error.response?.data?.message) {
        submitError = error.response.data.message;
      }
      setErrors({ submit: submitError });
    }
  };

  const handleCancel = () => {
    navigate(`/instructions/${id}`);
  };

  const contractSelectOptions = [...contracts];
  const paymentSelectOptions = [...payments];

  if (isInstructionLoading) return <Loading />;
  if (instructionError) {
    return (
      <div className="px-4 py-6 mx-auto bg-gray-50">
        <div className="px-6 py-4 text-red-700 bg-red-100 border border-red-400 rounded-lg shadow">
          <p className="mb-2">
            지시 정보를 불러오는 중 오류가 발생했습니다:{" "}
            {instructionError.message}
          </p>
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
    <div className="px-4 py-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">지시 수정</h1>
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
                options={contractSelectOptions}
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
                options={paymentSelectOptions}
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
                label="지시ID (선택)"
                placeholder="지시ID (숫자)"
                value={formData.orderId === 0 ? "" : formData.orderId}
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

          <div className="mb-6">
            <FormSelect
              id="status"
              name="status"
              label="상태"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: "접수", label: "접수" },
                { value: "작업중", label: "작업중" },
                { value: "작업완료", label: "작업완료" },
                { value: "결재중", label: "결재중" },
                { value: "완료", label: "완료" },
              ]}
            />
          </div>

          <h2 className="mt-6 mb-4 text-lg font-semibold">위치 정보</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
          <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
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
            <FormButton
              type="button"
              onClick={handleCancel}
              variant="outline"
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              취소
            </FormButton>
            <FormButton
              type="submit"
              disabled={
                updateInstructionMutation.isPending ||
                isInstructionLoading ||
                isContractsLoading ||
                isPaymentsLoading
              }
              loading={updateInstructionMutation.isPending}
              className="flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              저장
            </FormButton>
          </div>
        </form>
      </FormCard>
    </div>
  );
};

export default InstructionEdit;
