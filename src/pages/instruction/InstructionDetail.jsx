import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useInstruction,
  useUpdateInstruction,
  useUpdateInstructionStatus,
  useDeleteInstruction,
  useConfirmInstruction,
  useProcessesByInstruction,
  useCreateProcess,
  useUpdateProcess,
  useDeleteProcess,
  useTasksByProcess,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useUnitPrices,
} from "../../lib/api/instructionQueries";
import { fetchTasksByProcess } from "../../lib/api/instructionAPI";
import {
  FormButton,
  Table,
  DataTable,
  showConfirm,
  showSuccess,
  showDeleteConfirm,
  Button,
  Loading,
  ConfirmDialog,
} from "../../components/molecules";
import { Input } from "../../components/ui/input";
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
  Plus,
  UserCheck,
  Calendar,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Check,
} from "lucide-react";
import { formatDateTime } from "../../lib/utils/dateUtils";

// 상태 매핑 객체
const STATUS_MAP = {
  접수: { label: "접수", color: "blue" },
  진행중: { label: "진행중", color: "yellow" },
  작업완료: { label: "작업완료", color: "teal" },
  결재중: { label: "결재중", color: "orange" },
  완료: { label: "완료", color: "green" },
  취소: { label: "취소", color: "red" },
  확정: { label: "확정", color: "purple" },
  // 기존 영문 상태 코드도 유지 (이전 코드와의 호환성을 위해)
  RECEIVED: { label: "접수", color: "blue" },
  IN_PROGRESS: { label: "진행중", color: "yellow" },
  COMPLETED_WORK: { label: "작업완료", color: "teal" },
  IN_APPROVAL: { label: "결재중", color: "orange" },
  COMPLETED: { label: "완료", color: "green" },
  CANCELED: { label: "취소", color: "red" },
  CONFIRMED: { label: "확정", color: "purple" },
};

// 공종 상태 매핑 객체
const PROCESS_STATUS_MAP = {
  "작업 전": { label: "작업 전", color: "bg-gray-100 text-gray-800" },
  진행중: { label: "진행중", color: "bg-yellow-100 text-yellow-800" },
  완료: { label: "완료", color: "bg-green-100 text-green-800" },
  취소: { label: "취소", color: "bg-red-100 text-red-800" },
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
    {
      value: "접수",
      label: "접수",
      color: "bg-blue-100 text-blue-800",
      buttonVariant: "primary",
      buttonClass: "text-blue-600 border-blue-300 hover:bg-blue-50",
    },
    {
      value: "진행중",
      label: "진행중",
      color: "bg-yellow-100 text-yellow-800",
      buttonVariant: "warning",
      buttonClass: "text-yellow-600 border-yellow-300 hover:bg-yellow-50",
    },
    {
      value: "작업완료",
      label: "작업완료",
      color: "bg-teal-100 text-teal-800",
      buttonVariant: "info",
      buttonClass: "text-teal-600 border-teal-300 hover:bg-teal-50",
    },
    {
      value: "결재중",
      label: "결재중",
      color: "bg-orange-100 text-orange-800",
      buttonVariant: "warning",
      buttonClass: "text-orange-600 border-orange-300 hover:bg-orange-50",
    },
    {
      value: "완료",
      label: "완료",
      color: "bg-green-100 text-green-800",
      buttonVariant: "success",
      buttonClass: "text-green-600 border-green-300 hover:bg-green-50",
    },
    {
      value: "취소",
      label: "취소",
      color: "bg-red-100 text-red-800",
      buttonVariant: "danger",
      buttonClass: "text-red-600 border-red-300 hover:bg-red-50",
    },
    {
      value: "확정",
      label: "확정",
      color: "bg-purple-100 text-purple-800",
      buttonVariant: "secondary",
      buttonClass: "text-purple-600 border-purple-300 hover:bg-purple-50",
    },
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
        return <ProcessesTab instructionId={id} />;
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
              {instruction?.name}
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
                  <p className="text-sm font-medium text-gray-500">관리자</p>
                  <p className="font-medium">{instruction?.manager || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">위임자</p>
                  <p className="font-medium">{instruction?.delegator || "-"}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="mb-2 text-sm font-medium text-gray-500">
                  위치 정보
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      시/군/구
                    </p>
                    <p className="font-medium">
                      {instruction?.district || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      동/읍/면
                    </p>
                    <p className="font-medium">{instruction?.dong || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">지번</p>
                    <p className="font-medium">
                      {instruction?.lotNumber || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      상세주소
                    </p>
                    <p className="font-medium">
                      {instruction?.detailAddress || "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">비고</p>
                  <p className="p-3 rounded-md bg-gray-50">
                    {instruction.memo || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-white rounded-lg">
            {canEdit && (
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="flex items-center mb-4 font-medium text-md">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  상태 변경
                </h3>
                <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-2">
                  {statusOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        instruction?.status === option.value
                          ? option.buttonVariant
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleStatusChange(option.value)}
                      disabled={instruction?.status === option.value}
                      className={
                        instruction?.status === option.value
                          ? "opacity-75"
                          : option.buttonClass
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 rounded-lg bg-gray-50">
              <h3 className="flex items-center mb-4 font-medium text-md">
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
                        variant="secondary"
                        size="sm"
                        className="flex items-center text-purple-600 border-purple-300 hover:bg-purple-50"
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

// 공종 탭 컴포넌트
const ProcessesTab = ({ instructionId }) => {
  const navigate = useNavigate();
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [editingProcess, setEditingProcess] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [processToDelete, setProcessToDelete] = useState(null);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskDeleteDialog, setShowTaskDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showAllTasks, setShowAllTasks] = useState(true); // 기본적으로 모든 작업 표시

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

  // 공종 목록 조회
  const {
    data: processesData,
    isLoading,
    isError,
    error,
  } = useProcessesByInstruction(instructionId);

  // 모든 공종의 작업 목록을 관리하기 위한 상태
  const [allTasks, setAllTasks] = useState([]);
  const [isAllTasksLoading, setIsAllTasksLoading] = useState(false);

  // 모든 공종의 작업 목록 로드
  useEffect(() => {
    const loadAllTasks = async () => {
      if (
        !processesData ||
        !processesData.processes ||
        processesData.processes.length === 0
      ) {
        setAllTasks([]);
        return;
      }

      setIsAllTasksLoading(true);
      try {
        const taskPromises = processesData.processes.map((process) =>
          fetchTasksByProcess(process.id, { size: 100 })
        );

        const taskResults = await Promise.all(taskPromises);

        const combinedTasks = taskResults.flatMap((result, index) => {
          const process = processesData.processes[index];
          const tasks = result.data?.content || [];

          // 각 작업에 공종 정보 추가
          return tasks.map((task) => ({
            ...task,
            process: {
              id: process.id,
              name: process.name,
            },
          }));
        });

        setAllTasks(combinedTasks);
      } catch (error) {
        console.error("작업 목록 로드 실패:", error);
      } finally {
        setIsAllTasksLoading(false);
      }
    };

    loadAllTasks();
  }, [processesData]);

  const createProcessMutation = useCreateProcess();
  const updateProcessMutation = useUpdateProcess();
  const deleteProcessMutation = useDeleteProcess();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  // 새 공종 추가 모달 열기
  const handleAddProcess = () => {
    setEditingProcess(null);
    setShowProcessModal(true);
  };

  // 공종 편집 모달 열기
  const handleEditProcess = (process) => {
    setEditingProcess(process);
    setShowProcessModal(true);
  };

  // 공종 삭제 대화상자 열기
  const handleDeletePrompt = (process) => {
    setProcessToDelete(process);
    setShowDeleteDialog(true);
  };

  // 공종 삭제 실행
  const handleDeleteProcess = async () => {
    if (!processToDelete) return;

    try {
      await deleteProcessMutation.mutateAsync({
        id: processToDelete.id,
        instructionId,
      });
      showSuccess("공종이 삭제되었습니다.");
      setShowDeleteDialog(false);
      setProcessToDelete(null);

      // 만약 삭제된 공종이 현재 선택된 공종이라면 선택 취소
      if (selectedProcess?.id === processToDelete.id) {
        setSelectedProcess(null);
      }
    } catch (error) {
      console.error("공종 삭제 실패:", error);
    }
  };

  // 공종 모달 닫기
  const handleCloseModal = () => {
    setShowProcessModal(false);
    setEditingProcess(null);
  };

  // 공종 저장 (생성 또는 수정)
  const handleSaveProcess = async (processData) => {
    try {
      if (editingProcess) {
        // 기존 공종 수정
        await updateProcessMutation.mutateAsync({
          id: editingProcess.id,
          instructionId,
          ...processData,
        });
        showSuccess("공종이 수정되었습니다.");
      } else {
        // 새 공종 생성
        await createProcessMutation.mutateAsync({
          instructionId,
          ...processData,
        });
        showSuccess("공종이 추가되었습니다.");
      }
      setShowProcessModal(false);
      setEditingProcess(null);
    } catch (error) {
      console.error("공종 저장 실패:", error);
    }
  };

  // 작업 추가 버튼 클릭 핸들러 (공종 선택 확인)
  const handleWorkAdd = (process) => {
    setSelectedProcess(process);
    setEditingTask(null);
    setShowTaskModal(true);
  };

  // 작업 추가 버튼 클릭 핸들러 (공종 선택 없이 바로 모달)
  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  // 작업 수정 모달 열기
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  // 작업 삭제 대화상자 열기
  const handleTaskDeletePrompt = (task) => {
    setTaskToDelete(task);
    setShowTaskDeleteDialog(true);
  };

  // 작업 삭제 실행
  const handleDeleteTask = async () => {
    if (!taskToDelete || !selectedProcess) return;

    try {
      await deleteTaskMutation.mutateAsync({
        id: taskToDelete.id,
        processId: selectedProcess.id,
      });
      showSuccess("작업이 삭제되었습니다.");
      setShowTaskDeleteDialog(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("작업 삭제 실패:", error);
    }
  };

  // 작업 모달 닫기
  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);
  };

  // 작업 저장 (생성 또는 수정)
  const handleSaveTask = async (taskData) => {
    if (!taskData.processId) {
      showConfirm({
        title: "공종 필요",
        message: "작업을 추가하려면 공종을 선택해야 합니다.",
        confirmText: "확인",
        icon: "warning",
      });
      return;
    }

    try {
      if (editingTask) {
        // 기존 작업 수정 (processId는 수정할 수 없으므로 제외)
        const { processId, ...updateData } = taskData;
        await updateTaskMutation.mutateAsync({
          id: editingTask.id,
          ...updateData,
        });
        showSuccess("작업이 수정되었습니다.");
      } else {
        // 새 작업 생성
        await createTaskMutation.mutateAsync(taskData);
        showSuccess("작업이 추가되었습니다.");
      }
      setShowTaskModal(false);
      setEditingTask(null);

      // 전체 작업 목록 다시 로드 (시간이 좀 걸리므로 낙관적 업데이트를 추가해도 좋음)
      const loadAllTasks = async () => {
        setIsAllTasksLoading(true);
        try {
          const taskPromises = processesData.processes.map((process) =>
            fetchTasksByProcess(process.id, { size: 100 })
          );

          const taskResults = await Promise.all(taskPromises);

          const combinedTasks = taskResults.flatMap((result, index) => {
            const process = processesData.processes[index];
            const tasks = result.data?.content || [];

            return tasks.map((task) => ({
              ...task,
              process: {
                id: process.id,
                name: process.name,
              },
            }));
          });

          setAllTasks(combinedTasks);
        } catch (error) {
          console.error("작업 목록 로드 실패:", error);
        } finally {
          setIsAllTasksLoading(false);
        }
      };

      loadAllTasks();
    } catch (error) {
      console.error("작업 저장 실패:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 mt-6 bg-white rounded-lg shadow">
        <h2 className="flex items-center mb-4 text-lg font-medium">
          <Wrench className="w-5 h-5 mr-2 text-blue-600" />
          공종 목록
        </h2>
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 mt-6 bg-white rounded-lg shadow">
        <h2 className="flex items-center mb-4 text-lg font-medium">
          <Wrench className="w-5 h-5 mr-2 text-blue-600" />
          공종 목록
        </h2>
        <div className="p-4 text-center text-red-500 rounded-md bg-red-50">
          공종 정보를 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  const { processes = [] } = processesData || {};
  const hasProcesses = processes.length > 0;
  const hasTasks = allTasks.length > 0;

  // 공종 테이블 컬럼 정의
  const processColumns = [
    {
      accessorKey: "index",
      header: "No.",
      size: 60,
      cell: ({ row }) => (
        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-blue-700">
          {row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "공종명",
    },
    {
      accessorKey: "worker",
      header: "작업자",
      cell: ({ row }) => row.original.worker || "-",
    },
    {
      accessorKey: "endDate",
      header: "종료일",
      cell: ({ row }) => formatDate(row.original.endDate),
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            PROCESS_STATUS_MAP[row.original.status]?.color || "bg-gray-100"
          }`}
        >
          {PROCESS_STATUS_MAP[row.original.status]?.label ||
            row.original.status}
        </span>
      ),
    },
    {
      id: "actions",
      header: "작업",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleWorkAdd(row.original)}
            className="px-3 py-1 text-indigo-600 border-indigo-300 hover:bg-indigo-50"
          >
            작업추가
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditProcess(row.original)}
            className="px-3 py-1 text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            수정
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeletePrompt(row.original)}
            className="px-3 py-1 text-red-600 border-red-300 hover:bg-red-50"
          >
            삭제
          </Button>
        </div>
      ),
    },
  ];

  // 작업 테이블 컬럼 정의 (통합 버전)
  const allTasksColumns = [
    {
      accessorKey: "index",
      header: "No.",
      size: 60,
      cell: ({ row }) => (
        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-blue-700">
          {row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "process.name",
      header: "공종",
      cell: ({ row }) => row.original.process?.name || "-",
    },
    {
      accessorKey: "name",
      header: "작업명",
      cell: ({ row }) =>
        row.original.name || row.original.unitPrice?.name || "-",
    },
    {
      accessorKey: "unit",
      header: "단위",
      cell: ({ row }) =>
        row.original.unit || row.original.unitPrice?.unit || "-",
    },
    {
      accessorKey: "unitCount",
      header: "수량",
      cell: ({ row }) => row.original.unitCount || 0,
    },
    {
      accessorKey: "unitPrice",
      header: "단가",
      cell: ({ row }) => {
        const price = row.original.price || row.original.unitPrice?.price || 0;
        return price.toLocaleString() + "원";
      },
    },
    {
      accessorKey: "amount",
      header: "금액",
      cell: ({ row }) => {
        const price = row.original.price || row.original.unitPrice?.price || 0;
        const count = row.original.unitCount || 0;
        return (price * count).toLocaleString() + "원";
      },
    },
    {
      id: "actions",
      header: "작업",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditTask(row.original)}
            className="px-3 py-1 text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            수정
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTaskDeletePrompt(row.original)}
            className="px-3 py-1 text-red-600 border-red-300 hover:bg-red-50"
          >
            삭제
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 mt-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center text-lg font-medium">
          <Wrench className="w-5 h-5 mr-2 text-blue-600" />
          공종 목록
        </h2>
        <FormButton
          variant="primary"
          size="md"
          onClick={handleAddProcess}
          className="flex items-center px-4 py-2"
        >
          공종 추가
        </FormButton>
      </div>

      {hasProcesses ? (
        <div className="space-y-6">
          <DataTable
            columns={processColumns}
            data={processes}
            isLoading={isLoading}
            emptyMessage="등록된 공종이 없습니다. 위의 '공종 추가' 버튼을 클릭하여 새 공종을 추가하세요."
            className="w-full"
            densePadding={true}
          />

          {/* 통합된 작업 목록 */}
          <div className="pt-6 mt-8 border-t">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">작업 목록</h3>
              <FormButton
                variant="primary"
                size="sm"
                onClick={handleAddTask}
                className="flex items-center px-3"
              >
                작업 추가
              </FormButton>
            </div>

            {isAllTasksLoading ? (
              <Loading />
            ) : hasTasks ? (
              <DataTable
                columns={allTasksColumns}
                data={allTasks}
                isLoading={isAllTasksLoading}
                emptyMessage="등록된 작업이 없습니다. '작업 추가' 버튼을 클릭하여 새 작업을 추가하세요."
                className="w-full"
                densePadding={true}
              />
            ) : (
              <div className="p-4 text-center text-gray-500 rounded-md bg-gray-50">
                등록된 작업이 없습니다. '작업 추가' 버튼을 클릭하여 새 작업을
                추가하세요.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500 rounded-md bg-gray-50">
          등록된 공종이 없습니다. 위의 '공종 추가' 버튼을 클릭하여 새 공종을
          추가하세요.
        </div>
      )}

      {/* 공종 추가/수정 모달 */}
      {showProcessModal && (
        <ProcessFormModal
          process={editingProcess}
          isOpen={showProcessModal}
          onClose={handleCloseModal}
          onSave={handleSaveProcess}
        />
      )}

      {/* 공종 삭제 확인 대화상자 */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="공종 삭제"
        message={`'${processToDelete?.name}' 공종을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={handleDeleteProcess}
        onCancel={() => {
          setShowDeleteDialog(false);
          setProcessToDelete(null);
        }}
      />

      {/* 작업 추가/수정 모달 */}
      {showTaskModal && (
        <TaskFormModal
          task={editingTask}
          processes={processes}
          selectedProcessId={selectedProcess?.id}
          isOpen={showTaskModal}
          onClose={handleCloseTaskModal}
          onSave={handleSaveTask}
        />
      )}

      {/* 작업 삭제 확인 대화상자 */}
      <ConfirmDialog
        isOpen={showTaskDeleteDialog}
        title="작업 삭제"
        message={`이 작업을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={handleDeleteTask}
        onCancel={() => {
          setShowTaskDeleteDialog(false);
          setTaskToDelete(null);
        }}
      />
    </div>
  );
};

// 공종 폼 모달 컴포넌트
const ProcessFormModal = ({ process, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: process?.name || "",
    worker: process?.worker || "",
    endDate: process?.endDate || new Date().toISOString().split("T")[0],
    status: process?.status || "작업 전",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const PROCESS_STATUS_OPTIONS = [
    { value: "작업 전", label: "작업 전" },
    { value: "진행중", label: "진행중" },
    { value: "완료", label: "완료" },
    { value: "취소", label: "취소" },
  ];

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="w-full max-w-lg p-6 mx-4 bg-white rounded-lg">
        <h2 className="mb-4 text-xl font-semibold">
          {process ? "공종 수정" : "공종 추가"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                공종명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="worker"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                작업자
              </label>
              <input
                type="text"
                id="worker"
                name="worker"
                value={formData.worker}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                종료일
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                상태
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {PROCESS_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-6 space-x-3">
            <FormButton type="button" variant="outline" onClick={onClose}>
              취소
            </FormButton>
            <FormButton type="submit" variant="primary">
              저장
            </FormButton>
          </div>
        </form>
      </div>
    </div>
  );
};

// 작업 폼 모달 컴포넌트 (자유롭게 입력 가능한 버전)
const TaskFormModal = ({
  task,
  processes,
  selectedProcessId,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    processId: task?.process?.id || selectedProcessId || "",
    unitPriceId: task?.unitPrice?.id || task?.unitPriceId || 0,
    name: task?.name || task?.unitPrice?.name || "",
    unit: task?.unit || task?.unitPrice?.unit || "",
    unitCount: task?.unitCount || 0,
    price: task?.price || task?.unitPrice?.price || 0,
    calculationDetails: task?.calculationDetails || "",
  });

  // 일위대가 검색을 위한 상태
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showUnitPriceSearch, setShowUnitPriceSearch] = useState(false);

  // 일위대가 목록 조회
  const { data: unitPricesData, isLoading: isUnitPricesLoading } =
    useUnitPrices({
      keyword: searchKeyword,
      size: 100, // 한 번에 많은 항목을 가져오기 위해 큰 수로 설정
    });

  const unitPrices = unitPricesData?.unitPrices || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "unitCount" ||
        name === "price" ||
        name === "processId" ||
        name === "unitPriceId"
          ? Number(value) || 0
          : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API 형식에 맞게 데이터 구성
    const apiData = {
      processId: formData.processId,
      unitPriceId: formData.unitPriceId,
      unitCount: formData.unitCount,
      calculationDetails: formData.calculationDetails,
      name: formData.name,
      unit: formData.unit,
    };
    onSave(apiData);
  };

  // 일위대가 검색 키워드 변경
  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // 일위대가 선택 시 호출되는 함수
  const handleSelectUnitPrice = (unitPrice) => {
    setFormData({
      ...formData,
      unitPriceId: unitPrice.id,
      name: unitPrice.name,
      unit: unitPrice.unit,
      price: unitPrice.totalCost,
    });
    setShowUnitPriceSearch(false);
  };

  // 선택된 일위대가 정보
  const selectedUnitPrice = unitPrices.find(
    (up) => up.id === formData.unitPriceId
  );

  // 금액 계산
  const amount = formData.price * formData.unitCount;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="w-full max-w-lg p-6 mx-4 bg-white rounded-lg overflow-auto max-h-[90vh]">
        <h2 className="mb-4 text-xl font-semibold">
          {task ? "작업 수정" : "작업 추가"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="processId"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                공종 <span className="text-red-500">*</span>
              </label>
              <select
                id="processId"
                name="processId"
                value={formData.processId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">공종 선택</option>
                {processes.map((process) => (
                  <option key={process.id} value={process.id}>
                    {process.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="unitPriceId"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                일위대가 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="flex items-center mb-2">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-4 h-4 text-gray-500" />
                    </div>
                    <Input
                      placeholder="일위대가 검색..."
                      value={searchKeyword}
                      onChange={handleSearchChange}
                      onFocus={() => setShowUnitPriceSearch(true)}
                      className="w-full pl-10"
                    />
                    {selectedUnitPrice && (
                      <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-600"
                        title={selectedUnitPrice.name}
                      >
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>

                {showUnitPriceSearch && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="overflow-y-auto max-h-64">
                      {isUnitPricesLoading ? (
                        <div className="p-4 text-center">
                          <Loading />
                        </div>
                      ) : unitPrices.length > 0 ? (
                        <ul className="py-1">
                          {unitPrices.map((unitPrice) => (
                            <li
                              key={unitPrice.id}
                              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSelectUnitPrice(unitPrice)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">
                                    {unitPrice.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {unitPrice.spec} | {unitPrice.unit} |{" "}
                                    {unitPrice.code}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">
                                    {unitPrice.totalCost.toLocaleString()}원
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    재료:{" "}
                                    {unitPrice.materialCost.toLocaleString()} |
                                    노무: {unitPrice.laborCost.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          검색 결과가 없습니다.
                        </div>
                      )}
                    </div>
                    <div className="p-2 text-right border-t">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowUnitPriceSearch(false)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        닫기
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {selectedUnitPrice && (
                <div className="p-2 mt-2 text-sm text-blue-800 rounded-md bg-blue-50">
                  <div className="flex items-center font-medium">
                    <Check className="w-4 h-4 mr-1 text-blue-600" />
                    {selectedUnitPrice.name} 선택됨
                  </div>
                  <div className="mt-1 text-xs">
                    <span className="font-medium">규격:</span>{" "}
                    {selectedUnitPrice.spec} |{" "}
                    <span className="font-medium">단위:</span>{" "}
                    {selectedUnitPrice.unit} |{" "}
                    <span className="font-medium">단가:</span>{" "}
                    {selectedUnitPrice.totalCost.toLocaleString()}원
                  </div>
                  <div className="mt-1 text-xs">
                    <span className="font-medium">재료비:</span>{" "}
                    {selectedUnitPrice.materialCost.toLocaleString()}원 |{" "}
                    <span className="font-medium">노무비:</span>{" "}
                    {selectedUnitPrice.laborCost.toLocaleString()}원 |{" "}
                    <span className="font-medium">경비:</span>{" "}
                    {selectedUnitPrice.expense.toLocaleString()}원
                  </div>
                </div>
              )}

              <input
                type="hidden"
                id="unitPriceId"
                name="unitPriceId"
                value={formData.unitPriceId}
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                작업명 (표시용)
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <p className="mt-1 text-xs text-gray-500">
                일위대가에서 자동으로 가져온 작업명을 수정할 수 있습니다.
              </p>
            </div>

            <div>
              <label
                htmlFor="unit"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                단위
              </label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="예: m², 개, EA"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="unitCount"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  수량 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="unitCount"
                  name="unitCount"
                  value={formData.unitCount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  단가
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="0"
                />
              </div>
            </div>

            <div className="p-3 rounded-md bg-gray-50">
              <p className="text-sm font-medium text-gray-900">
                <span className="font-medium">금액:</span>{" "}
                {amount.toLocaleString()}원
              </p>
            </div>

            <div>
              <label
                htmlFor="calculationDetails"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                산출 내역
              </label>
              <textarea
                id="calculationDetails"
                name="calculationDetails"
                value={formData.calculationDetails}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end mt-6 space-x-3">
            <FormButton type="button" variant="outline" onClick={onClose}>
              취소
            </FormButton>
            <FormButton type="submit" variant="primary">
              저장
            </FormButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstructionDetail;
