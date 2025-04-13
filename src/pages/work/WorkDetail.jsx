import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useWork,
  useUpdateWork,
  useDeleteWork,
  useAddDailyReport,
} from "../../lib/api/workQueries";
import Button from "../../components/atoms/Button";
import Card from "../../components/atoms/Card";
import Table from "../../components/molecules/Table";
import Modal from "../../components/molecules/Modal";
import Input from "../../components/atoms/Input";
import FormGroup from "../../components/molecules/FormGroup";
import TextArea from "../../components/atoms/TextArea";

const WorkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: currentWork, isLoading, error } = useWork(id);
  const updateWorkMutation = useUpdateWork();
  const deleteWorkMutation = useDeleteWork();
  const addDailyReportMutation = useAddDailyReport();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    date: new Date().toISOString().split("T")[0],
    workHours: "",
    description: "",
    completionRate: "",
    issues: "",
  });

  const handleEdit = () => {
    navigate(`/works/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await deleteWorkMutation.mutateAsync(id);
      navigate("/works");
    } catch (error) {
      console.error("작업 삭제 실패:", error);
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
    try {
      // 숫자 필드 변환
      const reportData = {
        ...reportForm,
        workHours: Number(reportForm.workHours),
        completionRate: Number(reportForm.completionRate),
      };

      await addDailyReportMutation.mutateAsync({
        workId: id,
        reportData,
      });

      // 모달 닫기 및 폼 초기화
      setShowReportModal(false);
      setReportForm({
        date: new Date().toISOString().split("T")[0],
        workHours: "",
        description: "",
        completionRate: "",
        issues: "",
      });
    } catch (error) {
      console.error("일일 보고서 추가 실패:", error);
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

  if (!currentWork) {
    return (
      <div className="p-4 text-yellow-700 bg-yellow-100 rounded-md">
        작업 정보를 찾을 수 없습니다.
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

  const materialColumns = [
    { title: "자재명", dataIndex: "name" },
    { title: "총 수량", dataIndex: "quantity" },
    { title: "사용 수량", dataIndex: "used" },
    { title: "단위", dataIndex: "unit" },
    {
      title: "사용률",
      render: (row) => {
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
    { title: "날짜", dataIndex: "date" },
    { title: "작업 시간", dataIndex: "workHours" },
    { title: "작업 내용", dataIndex: "description" },
    {
      title: "진행률",
      dataIndex: "completionRate",
      render: (row) => `${row.completionRate}%`,
    },
    { title: "이슈 사항", dataIndex: "issues" },
  ];

  const historyColumns = [
    { title: "날짜", dataIndex: "date" },
    { title: "작업", dataIndex: "action" },
    { title: "담당자", dataIndex: "user" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">작업 상세</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate("/works")}
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
              {currentWork.name}
            </h2>
            <div className="flex items-center mb-4 space-x-4">
              <span className="text-gray-500">ID: {currentWork.id}</span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  statusOptions.find((s) => s.value === currentWork.status)
                    ?.color || "bg-gray-100"
                }`}
              >
                {currentWork.status}
              </span>
            </div>
            <p className="mb-4 text-gray-700">{currentWork.description}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">지시 정보</p>
              <p>
                <a
                  href={`/instructions/${currentWork.instructionId}`}
                  className="text-blue-600 hover:underline"
                >
                  {currentWork.instructionId} - {currentWork.instructionTitle}
                </a>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">위치</p>
              <p className="text-gray-800">{currentWork.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">담당자</p>
              <p className="text-gray-800">{currentWork.assignedTo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">시작일</p>
              <p className="text-gray-800">{currentWork.startDate || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">종료일</p>
              <p className="text-gray-800">{currentWork.endDate || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">작업 시간</p>
              <p className="text-gray-800">{currentWork.workHours || 0}시간</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">비용</p>
              <p className="text-gray-800">
                ₩{currentWork.cost?.toLocaleString() || "0"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">진행률</p>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div
                    className="h-2.5 rounded-full bg-blue-500"
                    style={{ width: `${currentWork.completionRate}%` }}
                  ></div>
                </div>
                <span className="text-gray-800">
                  {currentWork.completionRate}%
                </span>
              </div>
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
                    currentWork.status === option.value ? "primary" : "outline"
                  }
                  size="sm"
                  onClick={() => handleStatusChange(option.value)}
                  disabled={currentWork.status === option.value}
                  className={
                    currentWork.status === option.value
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
          {currentWork.attachments?.length > 0 ? (
            <ul className="space-y-2">
              {currentWork.attachments.map((attachment, index) => (
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              일일 작업 보고서
            </h3>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowReportModal(true)}
              className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              보고서 추가
            </Button>
          </div>
          <Table
            columns={reportColumns}
            data={currentWork.dailyReports || []}
            emptyMessage="등록된 일일 보고서가 없습니다."
            className="min-w-full divide-y divide-gray-200"
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-lg font-medium text-gray-800">사용 자재</h3>
          <Table
            columns={materialColumns}
            data={currentWork.materials || []}
            emptyMessage="등록된 자재가 없습니다."
            className="min-w-full divide-y divide-gray-200"
          />
        </Card>

        <Card className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-lg font-medium text-gray-800">작업 이력</h3>
          <Table
            columns={historyColumns}
            data={currentWork.history || []}
            emptyMessage="작업 이력이 없습니다."
            className="min-w-full divide-y divide-gray-200"
          />
        </Card>
      </div>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="작업 삭제"
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
        <p className="text-gray-800">정말로 이 작업을 삭제하시겠습니까?</p>
        <p className="mt-2 text-sm text-gray-500">
          이 작업은 되돌릴 수 없으며, 관련된 모든 보고서 데이터도 함께
          삭제됩니다.
        </p>
      </Modal>

      {/* 일일 보고서 추가 모달 */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="일일 작업 보고서 추가"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowReportModal(false)}
              className="px-4 py-2 mr-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleAddReport}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              보고서 추가
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormGroup label="날짜" htmlFor="date" required>
            <Input
              id="date"
              name="date"
              type="date"
              value={reportForm.date}
              onChange={handleReportFormChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormGroup>

          <FormGroup label="작업 시간 (시간)" htmlFor="workHours" required>
            <Input
              id="workHours"
              name="workHours"
              type="number"
              value={reportForm.workHours}
              onChange={handleReportFormChange}
              required
              min="0"
              max="24"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormGroup>

          <FormGroup label="작업 내용" htmlFor="description" required>
            <TextArea
              id="description"
              name="description"
              value={reportForm.description}
              onChange={handleReportFormChange}
              required
              rows={3}
            />
          </FormGroup>

          <FormGroup label="진행률 (%)" htmlFor="completionRate" required>
            <Input
              id="completionRate"
              name="completionRate"
              type="number"
              value={reportForm.completionRate}
              onChange={handleReportFormChange}
              required
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FormGroup>

          <FormGroup label="이슈 사항" htmlFor="issues">
            <TextArea
              id="issues"
              name="issues"
              value={reportForm.issues}
              onChange={handleReportFormChange}
              rows={2}
            />
          </FormGroup>
        </div>
      </Modal>
    </div>
  );
};

export default WorkDetail;
