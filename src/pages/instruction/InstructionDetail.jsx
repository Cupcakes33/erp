import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useInstruction,
  useUpdateInstruction,
  useUpdateInstructionStatus,
  useDeleteInstruction,
  useConfirmInstruction,
} from "../../lib/api/instructionQueries";
import {
  FormButton,
  Table,
  showConfirm,
  showSuccess,
  showDeleteConfirm,
  Button,
  Loading,
  ConfirmDialog,
} from "../../components/molecules";
import {
  ArrowLeft,
  Edit,
  Trash,
  CheckCircle,
  Clock,
  FileText,
  Info,
  Layout,
  Activity,
  FileCheck,
  Send,
  Wrench,
} from "lucide-react";
import { formatDateTime } from "../../lib/utils/dateUtils";

// 상태 매핑 객체
const STATUS_MAP = {
  접수: { label: "접수", color: "blue" },
  진행중: { label: "진행중", color: "orange" },
  작업완료: { label: "작업완료", color: "green" },
  결재중: { label: "결재중", color: "yellow" },
  완료: { label: "완료", color: "green" },
  취소: { label: "취소", color: "red" },
  확정: { label: "확정", color: "purple" },
  // 기존 영문 상태 코드도 유지 (이전 코드와의 호환성을 위해)
  RECEIVED: { label: "접수", color: "blue" },
  IN_PROGRESS: { label: "진행중", color: "orange" },
  COMPLETED_WORK: { label: "작업완료", color: "green" },
  IN_APPROVAL: { label: "결재중", color: "yellow" },
  COMPLETED: { label: "완료", color: "green" },
  CANCELED: { label: "취소", color: "red" },
  CONFIRMED: { label: "확정", color: "purple" },
};

const InstructionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: response, isLoading, error } = useInstruction(id);
  const instruction = response;
  const updateInstructionMutation = useUpdateInstruction();
  const updateStatusMutation = useUpdateInstructionStatus();
  const deleteInstructionMutation = useDeleteInstruction();
  const confirmInstructionMutation = useConfirmInstruction();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("works"); // 'works', 'history', 'files'

  const handleEdit = () => {
    navigate(`/instructions/${id}/edit`);
  };

  const handleBack = () => {
    navigate("/instructions");
  };

  const handleDelete = async () => {
    const result = await showDeleteConfirm(
      "지시 삭제 확인",
      "이 작업은 되돌릴 수 없으며, 관련된 모든 작업에 영향을 줄 수 있습니다."
    );

    if (result.isConfirmed) {
      try {
        await deleteInstructionMutation.mutateAsync(id);
        showSuccess("지시가 삭제되었습니다.");
        navigate("/instructions");
      } catch (error) {
        console.error("지시 삭제 실패:", error);
      }
    }
  };

  const handleComplete = async () => {
    const result = await showConfirm({
      title: "지시 완료 처리",
      message:
        "이 지시를 완료 처리하시겠습니까? 지시가 완료되면 더 이상 수정할 수 없습니다.",
      confirmText: "완료 처리",
      icon: "success",
    });

    if (result.isConfirmed) {
      try {
        await updateStatusMutation.mutateAsync({
          id,
          status: "완료",
        });
        showSuccess("지시가 완료 처리되었습니다.");
      } catch (error) {
        console.error("지시 완료 처리 실패:", error);
      }
    }
  };

  const handleConfirm = async () => {
    const result = await showConfirm({
      title: "지시 확정",
      message: "이 지시를 확정하시겠습니까? 확정된 지시는 기성에 반영됩니다.",
      confirmText: "확정",
      icon: "question",
    });

    if (result.isConfirmed) {
      try {
        await confirmInstructionMutation.mutateAsync(id);
        showSuccess("지시가 확정되었습니다.");
      } catch (error) {
        console.error("지시 확정 실패:", error);
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        id,
        status: newStatus,
      });
      showSuccess(`상태가 ${STATUS_MAP[newStatus]?.label}로 변경되었습니다.`);
    } catch (error) {
      console.error("상태 변경 실패:", error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="px-4 py-6 mx-auto bg-gray-50">
        <div className="px-6 py-4 text-red-700 bg-red-100 border border-red-400 rounded-lg shadow">
          <p className="mb-2">지시 정보를 불러오는 중 오류가 발생했습니다.</p>
          <FormButton onClick={handleBack} variant="outline" className="mt-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로 돌아가기
          </FormButton>
        </div>
      </div>
    );
  }

  if (!instruction) {
    return (
      <div className="px-4 py-6 mx-auto bg-gray-50">
        <div className="px-6 py-4 text-yellow-700 bg-yellow-100 border border-yellow-400 rounded-lg shadow">
          <p className="mb-2">지시 정보를 찾을 수 없습니다.</p>
          <FormButton onClick={handleBack} variant="outline" className="mt-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로 돌아가기
          </FormButton>
        </div>
      </div>
    );
  }

  const status = STATUS_MAP[instruction.status] || {
    label: instruction.status,
    color: "gray",
  };

  const statusOptions = [
    { value: "접수", label: "접수", color: "bg-blue-100 text-blue-800" },
    {
      value: "진행중",
      label: "진행중",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "작업완료",
      label: "작업완료",
      color: "bg-teal-100 text-teal-800",
    },
    {
      value: "결재중",
      label: "결재중",
      color: "bg-orange-100 text-orange-800",
    },
    { value: "완료", label: "완료", color: "bg-green-100 text-green-800" },
    { value: "취소", label: "취소", color: "bg-red-100 text-red-800" },
    { value: "확정", label: "확정", color: "bg-purple-100 text-purple-800" },
  ];

  const isCompleted = instruction?.status === "완료";
  const isCanceled = instruction?.status === "취소";
  const isConfirmed = instruction?.status === "확정";
  const canEdit = !isCompleted && !isCanceled && !isConfirmed;

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "works":
      default:
        return (
          <div className="p-6 mt-6 bg-white rounded-lg shadow">
            <h2 className="flex items-center mb-4 text-lg font-medium">
              <Wrench className="w-5 h-5 mr-2 text-blue-600" />
              관련 작업
            </h2>
            <div className="p-4 text-center text-gray-500 rounded-md bg-gray-50">
              관련 작업이 없습니다.
            </div>
          </div>
        );
      case "history":
        return (
          <div className="p-6 mt-6 bg-white rounded-lg shadow">
            <h2 className="flex items-center mb-4 text-lg font-medium">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              변경 이력
            </h2>
            <div className="p-4 text-center text-gray-500 rounded-md bg-gray-50">
              변경 이력이 없습니다.
            </div>
          </div>
        );
      case "files":
        return (
          <div className="p-6 mt-6 bg-white rounded-lg shadow">
            <h2 className="flex items-center mb-4 text-lg font-medium">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              첨부 파일
            </h2>
            <div className="p-4 text-center text-gray-500 rounded-md bg-gray-50">
              첨부된 파일이 없습니다.
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 mx-auto bg-gray-50">
      {/* 헤더 영역 */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow">
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <FormButton
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="h-10 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </FormButton>
            <h1 className="flex items-center text-2xl font-bold text-gray-800">
              <FileText className="w-6 h-6 mr-2 text-blue-600" />
              {instruction?.title}
            </h1>
          </div>
        </div>

        {/* 상세 정보 영역 */}
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
          <div className="bg-white rounded-lg">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">상태</p>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      statusOptions.find((s) => s.value === instruction?.status)
                        ?.color || "bg-gray-100"
                    } inline-block text-center`}
                  >
                    {status.label}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">지시번호</p>
                  <p className="font-medium">{instruction?.orderNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">지시일자</p>
                  <p className="font-medium">
                    {formatDate(instruction?.orderDate)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">구분</p>
                  <p className="font-medium">{instruction?.structure || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">동</p>
                  <p className="font-medium">{instruction?.dong || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">호수</p>
                  <p className="font-medium">{instruction?.lotNumber || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">관리자</p>
                  <p className="font-medium">{instruction?.manager || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">위임자</p>
                  <p className="font-medium">{instruction?.delegator || "-"}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">주소</p>
                  <p className="font-medium">
                    {instruction?.district} {instruction?.dong}{" "}
                    {instruction?.lotNumber} {instruction?.detailAddress}
                  </p>
                </div>
              </div>
              {instruction?.description && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">설명</p>
                    <p className="p-3 rounded-md bg-gray-50">
                      {instruction.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 bg-white rounded-lg">
            {canEdit && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="flex items-center mb-4 text-md font-medium">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  상태 변경
                </h3>
                <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-2">
                  {statusOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        instruction?.status === option.value
                          ? "primary"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleStatusChange(option.value)}
                      disabled={instruction?.status === option.value}
                      className={
                        instruction?.status === option.value ? "opacity-75" : ""
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="flex items-center mb-4 text-md font-medium">
                <Send className="w-5 h-5 mr-2 text-blue-600" />
                액션
              </h3>
              <div className="flex flex-wrap gap-2">
                {canEdit && (
                  <>
                    <FormButton
                      onClick={handleComplete}
                      variant="success"
                      size="sm"
                      className="flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      완료 처리
                    </FormButton>
                    {isCompleted && !isConfirmed && (
                      <FormButton
                        onClick={handleConfirm}
                        variant="primary"
                        size="sm"
                        className="flex items-center"
                      >
                        <FileCheck className="w-4 h-4 mr-2" />
                        확정
                      </FormButton>
                    )}
                    <FormButton
                      onClick={handleEdit}
                      variant="primary"
                      size="sm"
                      className="flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      수정
                    </FormButton>
                    <FormButton
                      onClick={() => setShowDeleteDialog(true)}
                      variant="danger"
                      size="sm"
                      className="flex items-center"
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      삭제
                    </FormButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab("works")}
              className={`py-3 px-1 ${
                activeTab === "works"
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <Wrench className="w-4 h-4 mr-2" />
                작업
              </div>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-3 px-1 ${
                activeTab === "history"
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                변경 이력
              </div>
            </button>
            <button
              onClick={() => setActiveTab("files")}
              className={`py-3 px-1 ${
                activeTab === "files"
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                첨부 파일
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* 탭 콘텐츠 영역 */}
      {renderTabContent()}

      {/* 삭제 확인 대화상자 */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="지시 삭제"
        message="이 지시를 삭제하시겠습니까? 이 작업은 취소할 수 없습니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};

export default InstructionDetail;
