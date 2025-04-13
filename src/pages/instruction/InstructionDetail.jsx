import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useInstruction,
  useUpdateInstruction,
  useUpdateInstructionStatus,
  useToggleInstructionFavorite,
  useDeleteInstruction,
} from "../../lib/api/instructionQueries";
import Button from "../../components/atoms/Button";
import Card from "../../components/atoms/Card";
import Table from "../../components/molecules/Table";
import Modal from "../../components/molecules/Modal";

const InstructionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: instruction, isLoading, error } = useInstruction(id);
  const updateInstructionMutation = useUpdateInstruction();
  const updateStatusMutation = useUpdateInstructionStatus();
  const toggleFavoriteMutation = useToggleInstructionFavorite();
  const deleteInstructionMutation = useDeleteInstruction();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEdit = () => {
    navigate(`/instructions/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await deleteInstructionMutation.mutateAsync(id);
      navigate("/instructions");
    } catch (error) {
      console.error("지시 삭제 실패:", error);
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
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-700 bg-red-100 rounded-md">
        {error instanceof Error
          ? error.message
          : "데이터를 불러오는 중 오류가 발생했습니다."}
      </div>
    );
  }

  if (!instruction) {
    return (
      <div className="p-4 text-yellow-700 bg-yellow-100 rounded-md">
        지시 정보를 찾을 수 없습니다.
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">지시 상세</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate("/instructions")}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            목록으로
          </Button>
          <Button
            variant="primary"
            onClick={handleEdit}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            수정
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            삭제
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
        <Card className="p-6 bg-white rounded-lg shadow-md lg:col-span-2">
          <div className="mb-4">
            <h2 className="mb-2 text-xl font-bold text-gray-800">
              {instruction.title}
            </h2>
            <div className="flex items-center mb-4 space-x-4">
              <span className="text-gray-500">ID: {instruction.id}</span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  statusOptions.find((s) => s.value === instruction.status)
                    ?.color || "bg-gray-100"
                }`}
              >
                {instruction.status}
              </span>
              <span
                className={`font-medium ${
                  priorityColors[instruction.priority] || ""
                }`}
              >
                우선순위: {instruction.priority}
              </span>
            </div>
            <p className="mb-4 text-gray-700">{instruction.description}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">위치</p>
              <p className="text-gray-800">{instruction.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">담당자</p>
              <p className="text-gray-800">{instruction.assignedTo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">생성일</p>
              <p className="text-gray-800">{instruction.createdAt}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">마감일</p>
              <p className="text-gray-800">{instruction.dueDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">예산</p>
              <p className="text-gray-800">
                ₩{instruction.budget?.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-2 text-lg font-medium text-gray-800">
              상태 변경
            </h3>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    instruction.status === option.value ? "primary" : "outline"
                  }
                  size="sm"
                  onClick={() => handleStatusChange(option.value)}
                  disabled={instruction.status === option.value}
                  className={
                    instruction.status === option.value
                      ? "bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                      : "border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-50"
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-lg font-medium text-gray-800">첨부 파일</h3>
          {instruction.attachments?.length > 0 ? (
            <ul className="space-y-2">
              {instruction.attachments.map((attachment, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">📎</span>
                  <a
                    href={attachment.url}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {attachment.name}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">첨부 파일이 없습니다.</p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-lg font-medium text-gray-800">작업 목록</h3>
          <Table
            columns={workColumns}
            data={instruction.works || []}
            emptyMessage="등록된 작업이 없습니다."
            onRowClick={(work) => navigate(`/works/${work.id}`)}
            className="min-w-full divide-y divide-gray-200"
          />
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              작업 추가
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-lg font-medium text-gray-800">필요 자재</h3>
          <Table
            columns={materialColumns}
            data={instruction.materials || []}
            emptyMessage="등록된 자재가 없습니다."
            className="min-w-full divide-y divide-gray-200"
          />
        </Card>

        <Card className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-lg font-medium text-gray-800">작업 이력</h3>
          <Table
            columns={historyColumns}
            data={instruction.history || []}
            emptyMessage="작업 이력이 없습니다."
            className="min-w-full divide-y divide-gray-200"
          />
        </Card>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="지시 삭제"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 mr-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              취소
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              삭제
            </Button>
          </>
        }
      >
        <p className="text-gray-800">정말로 이 지시를 삭제하시겠습니까?</p>
        <p className="mt-2 text-sm text-gray-500">
          이 작업은 되돌릴 수 없으며, 관련된 모든 작업 데이터도 함께 삭제됩니다.
        </p>
      </Modal>
    </div>
  );
};

export default InstructionDetail;
