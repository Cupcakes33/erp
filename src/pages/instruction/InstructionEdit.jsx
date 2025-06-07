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
    round: "",
  });

  const [selectedCenter, setSelectedCenter] = useState("");
  const [contracts, setContracts] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState("");
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState("");

  const [initialCenter, setInitialCenter] = useState("");
  const [initialContractId, setInitialContractId] = useState("");
  const [initialRound, setInitialRound] = useState("");

  const [isContractsLoading, setIsContractsLoading] = useState(false);
  const [isRoundsLoading, setIsRoundsLoading] = useState(false);
  const [isInitialBinding, setIsInitialBinding] = useState(true);

  const [errors, setErrors] = useState({});

  // 1. 초기 데이터 바인딩을 위한 마스터 useEffect
  useEffect(() => {
    const bindInitialData = async () => {
      if (!instructionData) return;
      setIsInitialBinding(true);

      const instruction = instructionData;

      // 1-A. 폼 데이터 설정
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
        round: instruction.round || "",
      });

      // 1-B. 센터 설정
      const centerFromServer = instruction.center;
      if (!centerFromServer) {
        setIsInitialBinding(false);
        return;
      }
      setSelectedCenter(centerFromServer);

      // 1-C. 계약 설정
      const contractIdFromServer = instruction.contractId?.toString();
      if (!contractIdFromServer) {
        setIsInitialBinding(false);
        return;
      }
      // fetchContractsByCenter 호출 및 contracts 상태 설정
      setIsContractsLoading(true);
      const contractsResponse = await fetchContractsByCenter(centerFromServer);
      const fetchedContracts =
        contractsResponse.data?.map((c) => ({
          value: c.id.toString(),
          label: c.name || `계약 ID: ${c.id}`,
        })) || [];
      setContracts(fetchedContracts);
      setIsContractsLoading(false);

      // 계약 ID가 존재하면 선택
      if (fetchedContracts.some((c) => c.value === contractIdFromServer)) {
        setSelectedContractId(contractIdFromServer);

        // 1-D. 회차 설정
        const roundFromServer = instruction.round?.toString();
        if (roundFromServer !== undefined) {
          setIsRoundsLoading(true);
          const paymentsResponse = await fetchPaymentsByContract(
            contractIdFromServer
          );
          const paymentsData = paymentsResponse.data || [];
          const uniqueRoundsMap = new Map();
          paymentsData.forEach((p) => {
            if (p && p.round != null)
              uniqueRoundsMap.set(p.round.toString(), p);
          });
          const fetchedRounds = Array.from(uniqueRoundsMap.values()).map(
            (p) => ({
              value: p.round.toString(),
              label: `${p.round} - ${
                p.orderName || p.orderNumber || "이름 없음"
              }`,
            })
          );
          setRounds(fetchedRounds);
          setIsRoundsLoading(false);

          if (fetchedRounds.some((r) => r.value === roundFromServer)) {
            setSelectedRound(roundFromServer);
          }
        }
      }

      setIsInitialBinding(false);
    };

    bindInitialData();
  }, [instructionData]);

  // 2. 사용자 입력에 의한 '센터' 변경 처리
  useEffect(() => {
    if (isInitialBinding || !selectedCenter) return;

    const fetchRelatedContracts = async () => {
      setIsContractsLoading(true);
      const contractsResponse = await fetchContractsByCenter(selectedCenter);
      const fetchedContracts =
        contractsResponse.data?.map((c) => ({
          value: c.id.toString(),
          label: c.name || `계약 ID: ${c.id}`,
        })) || [];
      setContracts(fetchedContracts);
      setIsContractsLoading(false);
    };

    fetchRelatedContracts();
  }, [selectedCenter, isInitialBinding]);

  // 3. 사용자 입력에 의한 '계약' 변경 처리
  useEffect(() => {
    if (isInitialBinding || !selectedContractId) return;

    const fetchRelatedRounds = async () => {
      setIsRoundsLoading(true);
      const paymentsResponse = await fetchPaymentsByContract(
        selectedContractId
      );
      const paymentsData = paymentsResponse.data || [];
      const uniqueRoundsMap = new Map();
      paymentsData.forEach((p) => {
        if (p && p.round != null) uniqueRoundsMap.set(p.round.toString(), p);
      });
      const fetchedRounds = Array.from(uniqueRoundsMap.values()).map((p) => ({
        value: p.round.toString(),
        label: `${p.round} - ${p.orderName || p.orderNumber || "이름 없음"}`,
      }));
      setRounds(fetchedRounds);
      setIsRoundsLoading(false);
    };

    fetchRelatedRounds();
  }, [selectedContractId, isInitialBinding]);

  // 4. 간단한 handleChange 함수
  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "center":
        setSelectedCenter(value);
        // 하위 상태 초기화
        setSelectedContractId("");
        setSelectedRound("");
        setContracts([]);
        setRounds([]);
        break;
      case "contractId":
        setSelectedContractId(value);
        // 하위 상태 초기화
        setSelectedRound("");
        setRounds([]);
        break;
      case "round":
        setSelectedRound(value);
        break;
      default:
        setFormData((prev) => ({ ...prev, [name]: value }));
        break;
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "제목을 입력해주세요";
    if (!selectedCenter) newErrors.center = "센터를 선택해주세요.";
    if (!selectedContractId) newErrors.contractId = "계약을 선택해주세요.";
    if (!selectedRound) newErrors.round = "회차를 선택해주세요.";

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
        round: selectedRound ? Number(selectedRound) : null,
      };

      // contractId는 payload에 포함하지 않음
      if ("contractId" in payload) {
        delete payload.contractId;
      }

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
  const roundSelectOptions = [...rounds];

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
                id="round"
                name="round"
                label="회차"
                value={selectedRound}
                onChange={handleChange}
                options={roundSelectOptions}
                isLoading={isRoundsLoading}
                disabled={!selectedContractId || isRoundsLoading}
                error={errors.round}
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
                { value: "진행중", label: "진행중" },
                { value: "작업완료", label: "작업완료" },
                { value: "결제중", label: "결제중" },
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
                isRoundsLoading
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
