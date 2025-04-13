import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useWork,
  useUpdateWork,
  useDeleteWork,
  useAddDailyReport,
} from "../../lib/api/workQueries";
import {
  useInstruction,
  useInstructions,
} from "../../lib/api/instructionQueries";
import {
  FormButton,
  FormInput,
  FormCard,
  FormTextArea,
  FormGroup,
  DataTable,
  showConfirm,
  showDeleteConfirm,
  showTextAreaPrompt,
  showMultiInputForm,
} from "../../components/molecules";
import { ArrowLeft, Edit, Trash, CheckCircle, Clock, Link } from "lucide-react";
import Button from "../../components/atoms/Button";
import Card from "../../components/atoms/Card";
import Table from "../../components/molecules/Table";
import Input from "../../components/atoms/Input";
import TextArea from "../../components/atoms/TextArea";

const WorkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: currentWork, isLoading, error } = useWork(id);
  const updateWorkMutation = useUpdateWork();
  const deleteWorkMutation = useDeleteWork();
  const addDailyReportMutation = useAddDailyReport();
  const { data: instruction } = useInstruction(
    currentWork?.instructionId ? currentWork.instructionId : ""
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    date: new Date().toISOString().split("T")[0],
    workHours: "",
    description: "",
    completionRate: "",
    issues: "",
  });
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionNote, setCompletionNote] = useState("");

  const handleEdit = () => {
    navigate(`/works/${id}/edit`);
  };

  const handleBack = () => {
    navigate("/works");
  };

  const handleDelete = async () => {
    const result = await showDeleteConfirm(
      "작업 삭제 확인",
      "이 작업은 되돌릴 수 없습니다."
    );

    if (result.isConfirmed) {
      try {
        await deleteWorkMutation.mutateAsync(id);
        navigate("/works");
      } catch (error) {
        console.error("작업 삭제 실패:", error);
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateWorkMutation.mutateAsync({
        id,
        data: {
          ...currentWork,
          status: newStatus,
        },
      });
    } catch (error) {
      console.error("상태 변경 실패:", error);
    }
  };

  const handleReportFormChange = (e) => {
    const { name, value } = e.target;
    setReportForm({
      ...reportForm,
      [name]: value,
    });
  };

  const handleAddReport = async () => {
    // 보고서 추가 폼 표시
    const today = new Date().toISOString().split("T")[0];
    const reportFormHtml = `
      <div class="space-y-4">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            날짜 <span class="text-red-500">*</span>
          </label>
          <input
            id="date"
            type="date"
            value="${today}"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            작업 시간 (시간) <span class="text-red-500">*</span>
          </label>
          <input
            id="workHours"
            type="number"
            min="0"
            max="24"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            작업 내용 <span class="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          ></textarea>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            진행률 (%) <span class="text-red-500">*</span>
          </label>
          <input
            id="completionRate"
            type="number"
            min="0"
            max="100"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            이슈 사항
          </label>
          <textarea
            id="issues"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>
      </div>
    `;

    const result = await showMultiInputForm({
      title: "일일 작업 보고서 추가",
      html: reportFormHtml,
      confirmText: "보고서 추가",
      preConfirm: () => {
        const date = document.getElementById("date").value;
        const workHours = document.getElementById("workHours").value;
        const description = document.getElementById("description").value;
        const completionRate = document.getElementById("completionRate").value;
        const issues = document.getElementById("issues").value;

        if (!date || !workHours || !description || !completionRate) {
          return false;
        }

        return {
          date,
          workHours: Number(workHours),
          description,
          completionRate: Number(completionRate),
          issues,
        };
      },
    });

    if (result.isConfirmed && result.value) {
      try {
        await addDailyReportMutation.mutateAsync({
          workId: id,
          reportData: result.value,
        });
      } catch (error) {
        console.error("일일 보고서 추가 실패:", error);
      }
    }
  };

  const handleComplete = async () => {
    const result = await showTextAreaPrompt(
      "작업 완료 처리",
      "작업 완료에 대한 특이사항이나 메모를 입력하세요 (선택사항)"
    );

    if (result.isConfirmed) {
      try {
        await updateWorkMutation.mutateAsync({
          id,
          data: {
            ...currentWork,
            status: "완료",
            completionRate: 100,
            completionNote: result.value || "",
          },
        });
      } catch (error) {
        console.error("작업 완료 처리 실패:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>작업 정보를 불러오는 중 오류가 발생했습니다.</p>
          <FormButton onClick={handleBack} className="mt-2">
            목록으로 돌아가기
          </FormButton>
        </div>
      </div>
    );
  }

  if (!currentWork) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>작업 정보를 찾을 수 없습니다.</p>
          <FormButton onClick={handleBack} className="mt-2">
            목록으로 돌아가기
          </FormButton>
        </div>
      </div>
    );
  }

  const statusOptions = [
    {
      value: "대기중",
      label: "대기중",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "진행중",
      label: "진행중",
      color: "bg-blue-100 text-blue-800",
    },
    { value: "완료", label: "완료", color: "bg-green-100 text-green-800" },
    { value: "취소", label: "취소", color: "bg-red-100 text-red-800" },
  ];

  const materialColumns = [
    { header: "자재명", accessor: "name" },
    { header: "총 수량", accessor: "quantity" },
    { header: "사용 수량", accessor: "used" },
    { header: "단위", accessor: "unit" },
    {
      header: "사용률",
      accessor: "usageRate",
      cell: (row) => {
        const usageRate = (row.used / row.quantity) * 100;
        return (
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
              <div
                className="h-2.5 rounded-full bg-blue-500"
                style={{ width: `${usageRate}%` }}
              ></div>
            </div>
            <span>{usageRate.toFixed(0)}%</span>
          </div>
        );
      },
    },
  ];

  const reportColumns = [
    { header: "날짜", accessor: "date" },
    { header: "작업 시간", accessor: "workHours" },
    { header: "작업 내용", accessor: "description" },
    {
      header: "진행률",
      accessor: "completionRate",
      cell: (row) => `${row.completionRate}%`,
    },
    { header: "이슈 사항", accessor: "issues" },
  ];

  const historyColumns = [
    { header: "날짜", accessor: "date" },
    { header: "작업", accessor: "action" },
    { header: "담당자", accessor: "user" },
  ];

  const isCompleted = currentWork.status === "완료";
  const isCanceled = currentWork.status === "취소";

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
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
          <h1 className="text-2xl font-bold">{currentWork.name}</h1>
        </div>
        <div className="flex space-x-2">
          {!isCompleted && !isCanceled && (
            <>
              <FormButton onClick={handleComplete} variant="success" size="sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                완료 처리
              </FormButton>
              <FormButton onClick={handleEdit} variant="primary" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                수정
              </FormButton>
              <FormButton onClick={handleDelete} variant="danger" size="sm">
                <Trash className="w-4 h-4 mr-2" />
                삭제
              </FormButton>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-medium">{currentWork.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">상태</p>
                <p className="font-medium">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      statusOptions.find((s) => s.value === currentWork.status)
                        ?.color || "bg-gray-100"
                    }`}
                  >
                    {currentWork.status}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">위치</p>
                <p className="font-medium">{currentWork.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">담당자</p>
                <p className="font-medium">{currentWork.assignedTo || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">시작일</p>
                <p className="font-medium">{currentWork.startDate || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">마감일</p>
                <p className="font-medium">{currentWork.endDate || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">진행률</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${currentWork.completionRate || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-right mt-1">
                  {currentWork.completionRate || 0}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">생성일</p>
                <p className="font-medium">{currentWork.createdAt || "-"}</p>
              </div>
            </div>
          </div>
        </FormCard>

        <FormCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">상세 내용</h2>
          <div className="whitespace-pre-line">
            {currentWork.description || "상세 내용이 없습니다."}
          </div>

          {currentWork.instructionId && instruction && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center mb-2">
                <Link className="w-4 h-4 text-blue-500 mr-2" />
                <h3 className="text-lg font-medium">연결된 지시</h3>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <p
                  className="font-medium text-blue-600 hover:underline cursor-pointer"
                  onClick={() =>
                    navigate(`/instructions/${currentWork.instructionId}`)
                  }
                >
                  {instruction.title}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ID: {instruction.id}
                </p>
              </div>
            </div>
          )}

          {currentWork.completionNote && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <h3 className="text-lg font-medium">완료 노트</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-md">
                <p className="text-sm">{currentWork.completionNote}</p>
                <p className="text-xs text-gray-500 mt-1">
                  완료일: {currentWork.completedAt || "-"}
                </p>
              </div>
            </div>
          )}
        </FormCard>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <FormCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              일일 작업 보고서
            </h3>
            <FormButton
              variant="primary"
              size="sm"
              onClick={handleAddReport}
              className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              보고서 추가
            </FormButton>
          </div>
          <DataTable
            columns={reportColumns}
            data={currentWork.dailyReports || []}
            emptyMessage="등록된 일일 보고서가 없습니다."
          />
        </FormCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FormCard className="p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-800">사용 자재</h3>
          <DataTable
            columns={materialColumns}
            data={currentWork.materials || []}
            emptyMessage="등록된 자재가 없습니다."
          />
        </FormCard>

        <FormCard className="p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-800">작업 이력</h3>
          <DataTable
            columns={historyColumns}
            data={currentWork.history || []}
            emptyMessage="작업 이력이 없습니다."
          />
        </FormCard>
      </div>
    </div>
  );
};

export default WorkDetail;
