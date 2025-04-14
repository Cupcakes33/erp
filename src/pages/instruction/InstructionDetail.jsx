import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useInstruction,
  useUpdateInstruction,
  useUpdateInstructionStatus,
  useToggleInstructionFavorite,
  useDeleteInstruction,
  useConfirmInstruction,
} from "../../lib/api/instructionQueries";
import {
  FormButton,
  FormInput,
  FormCard,
  FormTextArea,
  FormGroup,
  Table,
  DataTable,
  showConfirm,
  showSuccess,
  showDeleteConfirm,
  showTextAreaPrompt,
  Badge,
  Button,
  DetailItem,
  DetailSection,
  Loading,
  ConfirmDialog,
} from "../../components/molecules";
import {
  ArrowLeft,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
} from "lucide-react";
import Card from "../../components/atoms/Card";
import { formatDateTime } from "../../lib/utils/dateUtils";

// 상태와 우선순위 매핑 객체
const STATUS_MAP = {
  RECEIVED: { label: "접수", color: "blue" },
  IN_PROGRESS: { label: "진행중", color: "orange" },
  COMPLETED: { label: "완료", color: "green" },
  CANCELED: { label: "취소", color: "red" },
};

const PRIORITY_MAP = {
  HIGH: { label: "높음", color: "red" },
  MEDIUM: { label: "중간", color: "yellow" },
  LOW: { label: "낮음", color: "green" },
};

const CHANNEL_MAP = {
  PHONE: "전화",
  EMAIL: "이메일",
  SYSTEM: "시스템",
  OTHER: "기타",
};

const InstructionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: instruction, isLoading, error } = useInstruction(id);
  const updateInstructionMutation = useUpdateInstruction();
  const updateStatusMutation = useUpdateInstructionStatus();
  const toggleFavoriteMutation = useToggleInstructionFavorite();
  const deleteInstructionMutation = useDeleteInstruction();
  const confirmInstructionMutation = useConfirmInstruction();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
          status: "COMPLETED",
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

  const handleToggleFavorite = async () => {
    try {
      await toggleFavoriteMutation.mutateAsync(id);
    } catch (error) {
      console.error("즐겨찾기 토글 실패:", error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container px-4 py-6 mx-auto">
        <div className="px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded">
          <p>지시 정보를 불러오는 중 오류가 발생했습니다.</p>
          <FormButton onClick={handleBack} className="mt-2">
            목록으로 돌아가기
          </FormButton>
        </div>
      </div>
    );
  }

  if (!instruction) {
    return (
      <div className="container px-4 py-6 mx-auto">
        <div className="px-4 py-3 text-yellow-700 bg-yellow-100 border border-yellow-400 rounded">
          <p>지시 정보를 찾을 수 없습니다.</p>
          <FormButton onClick={handleBack} className="mt-2">
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
  const priority = PRIORITY_MAP[instruction.priority] || {
    label: instruction.priority,
    color: "gray",
  };
  const channel = CHANNEL_MAP[instruction.channel] || instruction.channel;

  const statusOptions = [
    { value: "RECEIVED", label: "접수", color: "bg-blue-100 text-blue-800" },
    {
      value: "IN_PROGRESS",
      label: "진행중",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "COMPLETED", label: "완료", color: "bg-green-100 text-green-800" },
    { value: "CANCELED", label: "취소", color: "bg-red-100 text-red-800" },
    {
      value: "CONFIRMED",
      label: "확정",
      color: "bg-purple-100 text-purple-800",
    },
  ];

  const priorityColors = {
    HIGH: "text-red-600",
    MEDIUM: "text-yellow-600",
    LOW: "text-green-600",
  };

  const workColumns = [
    { title: "작업 ID", dataIndex: "id" },
    { title: "작업명", dataIndex: "name" },
    {
      title: "상태",
      dataIndex: "status",
      render: (rowData) => {
        const statusClasses = {
          RECEIVED: "bg-blue-100 text-blue-800",
          IN_PROGRESS: "bg-yellow-100 text-yellow-800",
          COMPLETED: "bg-green-100 text-green-800",
          CANCELED: "bg-red-100 text-red-800",
          CONFIRMED: "bg-purple-100 text-purple-800",
        };

        return (
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              statusClasses[rowData.status] || "bg-gray-100"
            }`}
          >
            {STATUS_MAP[rowData.status]?.label}
          </span>
        );
      },
    },
    { title: "담당자", dataIndex: "assignedTo" },
  ];

  const materialColumns = [
    { title: "자재명", dataIndex: "name" },
    { title: "수량", dataIndex: "quantity" },
    { title: "단위", dataIndex: "unit" },
  ];

  const historyColumns = [
    { title: "날짜", dataIndex: "date" },
    { title: "작업", dataIndex: "action" },
    { title: "담당자", dataIndex: "user" },
  ];

  const isCompleted = instruction.status === "COMPLETED";
  const isCanceled = instruction.status === "CANCELED";
  const isConfirmed = instruction.status === "CONFIRMED";
  const canEdit = !isCompleted && !isCanceled && !isConfirmed;

  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FormButton
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로
          </FormButton>
          <h1 className="text-2xl font-bold">{instruction.title}</h1>
        </div>
        <div className="flex space-x-2">
          {canEdit && (
            <>
              <FormButton onClick={handleComplete} variant="success" size="sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                완료 처리
              </FormButton>
              {isCompleted && !isConfirmed && (
                <FormButton onClick={handleConfirm} variant="primary" size="sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  확정
                </FormButton>
              )}
              <FormButton onClick={handleEdit} variant="primary" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                수정
              </FormButton>
              <FormButton
                onClick={() => setShowDeleteDialog(true)}
                variant="danger"
                size="sm"
              >
                <Trash className="w-4 h-4 mr-2" />
                삭제
              </FormButton>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormCard className="p-6">
          <h2 className="mb-4 text-xl font-semibold">기본 정보</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-medium">{instruction.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">위치</p>
                <p className="font-medium">{instruction.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">상태</p>
                <p className="font-medium">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      statusOptions.find((s) => s.value === instruction.status)
                        ?.color || "bg-gray-100"
                    }`}
                  >
                    {status.label}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">우선순위</p>
                <p
                  className={`font-medium ${
                    priorityColors[instruction.priority]
                  }`}
                >
                  {priority.label}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">생성일</p>
                <p className="font-medium">
                  {formatDateTime(instruction.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">마감일</p>
                <p className="font-medium">{instruction.dueDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">관리자</p>
                <p className="font-medium">{instruction.manager}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">담당자</p>
                <p className="font-medium">{instruction.receiver}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">접수 채널</p>
                <p className="font-medium">{channel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">즐겨찾기</p>
                <p className="font-medium">
                  {instruction.favorite ? "⭐ 즐겨찾기됨" : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">기성 회차</p>
                <p className="font-medium">{instruction.paymentRound}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">최종 수정자</p>
                <p className="font-medium">{instruction.lastModifiedBy}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">최종 수정일</p>
                <p className="font-medium">{instruction.lastModifiedAt}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">주소</p>
              <p className="font-medium">{instruction.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">설명</p>
              <p className="p-3 bg-gray-50 rounded-md">
                {instruction.description}
              </p>
            </div>
          </div>
        </FormCard>

        <div className="space-y-6">
          <FormCard className="p-6">
            <h2 className="mb-4 text-xl font-semibold">관련 작업</h2>
            {instruction.works && instruction.works.length > 0 ? (
              <Table
                columns={workColumns}
                data={instruction.works.map((workId) => ({
                  id: workId,
                  name: `작업 ${workId}`,
                  status: "IN_PROGRESS",
                  assignedTo: instruction.receiver,
                }))}
              />
            ) : (
              <p className="text-gray-500">관련 작업이 없습니다.</p>
            )}
          </FormCard>

          {canEdit && (
            <FormCard className="p-6">
              <h2 className="mb-4 text-xl font-semibold">상태 변경</h2>
              <div className="flex space-x-2">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      instruction.status === option.value
                        ? "primary"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => handleStatusChange(option.value)}
                    disabled={instruction.status === option.value}
                    className={
                      option.value === instruction.status ? "opacity-50" : ""
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </FormCard>
          )}

          <FormCard className="p-6">
            <h2 className="mb-4 text-xl font-semibold">액션</h2>
            <div className="flex flex-wrap gap-2">
              <FormButton
                variant="outline"
                size="sm"
                onClick={handleToggleFavorite}
              >
                {instruction.favorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
              </FormButton>
              {canEdit && (
                <>
                  <FormButton onClick={handleEdit} variant="outline" size="sm">
                    수정
                  </FormButton>
                  <FormButton
                    onClick={() => setShowDeleteDialog(true)}
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-300 hover:bg-red-50"
                  >
                    삭제
                  </FormButton>
                </>
              )}
            </div>
          </FormCard>
        </div>
      </div>

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
