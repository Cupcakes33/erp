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
  FileText,
  Info,
  MapPin,
  Calendar,
  User,
  Star,
  Layout,
  Activity,
  Star as StarIcon,
  FileCheck,
  Send,
  Globe,
  AlignLeft,
  ThumbsUp,
  Wrench,
} from "lucide-react";
import Card from "../../components/atoms/Card";
import { formatDateTime } from "../../lib/utils/dateUtils";

// 상태와 우선순위 매핑 객체
const STATUS_MAP = {
  RECEIVED: { label: "접수", color: "blue" },
  IN_PROGRESS: { label: "진행중", color: "orange" },
  COMPLETED_WORK: { label: "작업완료", color: "green" },
  IN_APPROVAL: { label: "결재중", color: "yellow" },
  COMPLETED: { label: "완료", color: "green" },
  CANCELED: { label: "취소", color: "red" },
  CONFIRMED: { label: "확정", color: "purple" },
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
  const [activeTab, setActiveTab] = useState("info"); // 'info', 'works', 'history', 'files'

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
      showSuccess(
        instruction.favorite
          ? "즐겨찾기가 해제되었습니다."
          : "즐겨찾기에 추가되었습니다."
      );
    } catch (error) {
      console.error("즐겨찾기 토글 실패:", error);
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
    {
      value: "COMPLETED_WORK",
      label: "작업완료",
      color: "bg-teal-100 text-teal-800",
    },
    {
      value: "IN_APPROVAL",
      label: "결재중",
      color: "bg-orange-100 text-orange-800",
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
          COMPLETED_WORK: "bg-teal-100 text-teal-800",
          IN_APPROVAL: "bg-orange-100 text-orange-800",
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
            {STATUS_MAP[rowData.status]?.label || rowData.status}
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
        return (
          <div className="p-6 mt-6 bg-white rounded-lg shadow">
            <h2 className="flex items-center mb-4 text-lg font-medium">
              <Wrench className="w-5 h-5 mr-2 text-blue-600" />
              관련 작업
            </h2>
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
              <div className="p-4 text-center text-gray-500 rounded-md bg-gray-50">
                관련 작업이 없습니다.
              </div>
            )}
          </div>
        );
      case "history":
        // 예시 데이터
        const historyData = [
          {
            date: formatDate(instruction.createdAt),
            action: "지시 생성",
            user: instruction.manager,
          },
          {
            date: formatDate(instruction.lastModifiedAt),
            action: "정보 수정",
            user: instruction.lastModifiedBy,
          },
        ];

        return (
          <div className="p-6 mt-6 bg-white rounded-lg shadow">
            <h2 className="flex items-center mb-4 text-lg font-medium">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              변경 이력
            </h2>
            <Table columns={historyColumns} data={historyData} />
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
      case "info":
      default:
        return (
          <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="flex items-center mb-4 text-lg font-medium">
                <Info className="w-5 h-5 mr-2 text-blue-600" />
                기본 정보
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">ID</p>
                    <p className="font-medium">{instruction.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">위치</p>
                    <p className="font-medium">{instruction.location}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">상태</p>
                    <p className="font-medium">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          statusOptions.find(
                            (s) => s.value === instruction.status
                          )?.color || "bg-gray-100"
                        }`}
                      >
                        {status.label}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      우선순위
                    </p>
                    <p
                      className={`font-medium ${
                        priorityColors[instruction.priority]
                      }`}
                    >
                      {priority.label}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">생성일</p>
                    <p className="font-medium">
                      {formatDate(instruction.createdAt)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">마감일</p>
                    <p className="font-medium">
                      {formatDate(instruction.dueDate)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">관리자</p>
                    <p className="font-medium">{instruction.manager}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">담당자</p>
                    <p className="font-medium">{instruction.receiver}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      접수 채널
                    </p>
                    <p className="font-medium">{channel}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      즐겨찾기
                    </p>
                    <p className="flex items-center font-medium">
                      {instruction.favorite ? (
                        <span className="flex items-center text-yellow-500">
                          <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                          즐겨찾기됨
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      기성 회차
                    </p>
                    <p className="font-medium">
                      {instruction.paymentRound || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      최종 수정자
                    </p>
                    <p className="font-medium">
                      {instruction.lastModifiedBy || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      최종 수정일
                    </p>
                    <p className="font-medium">
                      {formatDate(instruction.lastModifiedAt)}
                    </p>
                  </div>
                </div>
                <div className="pt-4 space-y-1 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-500">주소</p>
                  <p className="font-medium">{instruction.address}</p>
                </div>
                <div className="pt-4 space-y-1 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-500">설명</p>
                  <p className="p-3 rounded-md bg-gray-50">
                    {instruction.description}
                  </p>
                </div>
                {instruction.workContent && (
                  <div className="pt-4 space-y-1 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-500">
                      작업내용
                    </p>
                    <p className="p-3 rounded-md bg-gray-50">
                      {instruction.workContent}
                    </p>
                  </div>
                )}
                {instruction.note && (
                  <div className="pt-4 space-y-1 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-500">비고</p>
                    <p className="p-3 rounded-md bg-gray-50">
                      {instruction.note}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="flex items-center mb-4 text-lg font-medium">
                  <Layout className="w-5 h-5 mr-2 text-blue-600" />
                  작업 정보
                </h2>
                {instruction.worker || instruction.workStatus ? (
                  <div className="space-y-4">
                    {instruction.worker && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">
                          작업자
                        </p>
                        <p className="font-medium">{instruction.worker}</p>
                      </div>
                    )}
                    {instruction.workStatus && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">
                          작업 현황
                        </p>
                        <p className="p-3 font-medium rounded-md bg-gray-50">
                          {instruction.workStatus}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 rounded-md bg-gray-50">
                    작업 정보가 없습니다.
                  </div>
                )}
              </div>

              {canEdit && (
                <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="flex items-center mb-4 text-lg font-medium">
                    <Activity className="w-5 h-5 mr-2 text-blue-600" />
                    상태 변경
                  </h2>
                  <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-2">
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
                          instruction.status === option.value
                            ? "opacity-75"
                            : ""
                        }
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="flex items-center mb-4 text-lg font-medium">
                  <Send className="w-5 h-5 mr-2 text-blue-600" />
                  액션
                </h2>
                <div className="flex flex-wrap gap-2">
                  <FormButton
                    variant="outline"
                    size="sm"
                    onClick={handleToggleFavorite}
                    className="flex items-center"
                  >
                    <Star
                      className={`w-4 h-4 mr-2 ${
                        instruction.favorite
                          ? "fill-yellow-400 text-yellow-400"
                          : ""
                      }`}
                    />
                    {instruction.favorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                  </FormButton>
                  {canEdit && (
                    <>
                      <FormButton
                        onClick={handleEdit}
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        수정
                      </FormButton>
                      <FormButton
                        onClick={() => setShowDeleteDialog(true)}
                        variant="outline"
                        size="sm"
                        className="flex items-center text-red-500 border-red-300 hover:bg-red-50"
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
              {instruction.title}
              {instruction.favorite && (
                <Star className="w-5 h-5 ml-2 text-yellow-400 fill-yellow-400" />
              )}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {canEdit && (
              <>
                <FormButton
                  onClick={handleComplete}
                  variant="success"
                  size="sm"
                  className="flex items-center h-10"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  완료 처리
                </FormButton>
                {isCompleted && !isConfirmed && (
                  <FormButton
                    onClick={handleConfirm}
                    variant="primary"
                    size="sm"
                    className="flex items-center h-10"
                  >
                    <FileCheck className="w-4 h-4 mr-2" />
                    확정
                  </FormButton>
                )}
                <FormButton
                  onClick={handleEdit}
                  variant="primary"
                  size="sm"
                  className="flex items-center h-10"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  수정
                </FormButton>
                <FormButton
                  onClick={() => setShowDeleteDialog(true)}
                  variant="danger"
                  size="sm"
                  className="flex items-center h-10"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  삭제
                </FormButton>
              </>
            )}
          </div>
        </div>

        {/* 상태 요약 영역 */}
        <div className="grid grid-cols-2 gap-4 p-4 mb-6 rounded-lg sm:grid-cols-3 md:grid-cols-5 bg-gray-50">
          <div className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-600">상태</span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                statusOptions.find((s) => s.value === instruction.status)
                  ?.color || "bg-gray-100"
              } inline-block text-center`}
            >
              {status.label}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-600">
              우선순위
            </span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full bg-${priority.color}-100 text-${priority.color}-800 inline-block text-center`}
            >
              {priority.label}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-600">
              생성일
            </span>
            <span className="inline-block text-sm font-medium">
              {formatDate(instruction.createdAt)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-600">
              마감일
            </span>
            <span className="inline-block text-sm font-medium">
              {formatDate(instruction.dueDate)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-600">
              담당자
            </span>
            <span className="inline-block text-sm font-medium">
              {instruction.receiver}
            </span>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab("info")}
              className={`py-3 px-1 ${
                activeTab === "info"
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <Info className="w-4 h-4 mr-2" />
                기본 정보
              </div>
            </button>
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
                {instruction.works && instruction.works.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium rounded-full px-2 py-0.5">
                    {instruction.works.length}
                  </span>
                )}
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
