import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useInstruction,
  useUpdateInstruction,
  useUpdateInstructionStatus,
  useToggleInstructionFavorite,
  useDeleteInstruction,
} from "../../lib/api/instructionQueries";
import {
  FormButton,
  FormCard,
  showConfirm,
  showSuccess,
  showDeleteConfirm,
} from "../../components/molecules";
import { ArrowLeft, Edit, Trash, CheckCircle, XCircle } from "lucide-react";
import Table from "../../components/molecules/Table";

const InstructionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: instruction, isLoading, error } = useInstruction(id);
  const updateInstructionMutation = useUpdateInstruction();
  const updateStatusMutation = useUpdateInstructionStatus();
  const toggleFavoriteMutation = useToggleInstructionFavorite();
  const deleteInstructionMutation = useDeleteInstruction();

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
        await updateInstructionMutation.mutateAsync({
          id,
          data: { ...instruction, status: "완료" },
        });
      } catch (error) {
        console.error("지시 완료 처리 실패:", error);
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        id,
        data: {
          ...instruction,
          status: newStatus,
        },
      });
    } catch (error) {
      console.error("상태 변경 실패:", error);
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
      <div className="container mx-auto px-4 py-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>지시 정보를 찾을 수 없습니다.</p>
          <FormButton onClick={handleBack} className="mt-2">
            목록으로 돌아가기
          </FormButton>
        </div>
      </div>
    );
  }

  const statusOptions = [
    { value: "대기중", label: "대기중", color: "bg-blue-100 text-blue-800" },
    {
      value: "진행중",
      label: "진행중",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "완료", label: "완료", color: "bg-green-100 text-green-800" },
    { value: "취소", label: "취소", color: "bg-red-100 text-red-800" },
  ];

  const priorityColors = {
    높음: "text-red-600",
    중간: "text-yellow-600",
    낮음: "text-green-600",
  };

  const workColumns = [
    { title: "작업 ID", dataIndex: "id" },
    { title: "작업명", dataIndex: "name" },
    {
      title: "상태",
      dataIndex: "status",
      render: (row) => {
        const statusClasses = {
          대기중: "bg-blue-100 text-blue-800",
          진행중: "bg-yellow-100 text-yellow-800",
          완료: "bg-green-100 text-green-800",
          취소: "bg-red-100 text-red-800",
        };

        return (
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              statusClasses[row.status] || "bg-gray-100"
            }`}
          >
            {row.status}
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

  const isCompleted = instruction.status === "완료";
  const isCanceled = instruction.status === "취소";

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
          <h1 className="text-2xl font-bold">{instruction.title}</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusClass(
                      instruction.status
                    )}`}
                  >
                    {instruction.status}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">우선순위</p>
                <p className="font-medium">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${getPriorityClass(
                      instruction.priority
                    )}`}
                  >
                    {instruction.priority}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">생성일</p>
                <p className="font-medium">{instruction.createdAt}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">마감일</p>
                <p className="font-medium">{instruction.dueDate}</p>
              </div>
            </div>
          </div>
        </FormCard>

        <FormCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">상세 내용</h2>
          <div className="whitespace-pre-line">{instruction.description}</div>
        </FormCard>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <FormCard className="p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-800">작업 목록</h3>
          <Table
            columns={workColumns}
            data={instruction.works || []}
            emptyMessage="등록된 작업이 없습니다."
            onRowClick={(work) => navigate(`/works/${work.id}`)}
            className="min-w-full divide-y divide-gray-200"
          />
          <div className="flex justify-end mt-4">
            <FormButton
              variant="outline"
              size="sm"
              className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              작업 추가
            </FormButton>
          </div>
        </FormCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FormCard className="p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-800">필요 자재</h3>
          <Table
            columns={materialColumns}
            data={instruction.materials || []}
            emptyMessage="등록된 자재가 없습니다."
            className="min-w-full divide-y divide-gray-200"
          />
        </FormCard>

        <FormCard className="p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-800">작업 이력</h3>
          <Table
            columns={historyColumns}
            data={instruction.history || []}
            emptyMessage="작업 이력이 없습니다."
            className="min-w-full divide-y divide-gray-200"
          />
        </FormCard>
      </div>
    </div>
  );
};

export default InstructionDetail;
