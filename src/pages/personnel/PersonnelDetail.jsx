import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useWorkerDetail,
  useUpdateWorker,
  useToggleWorkerStatus,
} from "../../lib/api/personnelQueries";
import { FormButton, FormCard, showConfirm } from "../../components/molecules";
import { Edit, ArrowLeft, UserCheck, UserX } from "lucide-react";

/**
 * 작업자 상세 정보 페이지
 */
const PersonnelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: worker, isLoading, error } = useWorkerDetail(id);
  const updateWorkerMutation = useUpdateWorker();
  const toggleStatusMutation = useToggleWorkerStatus();

  const handleEdit = () => {
    navigate(`/personnel/${id}/edit`);
  };

  const handleBack = () => {
    navigate("/personnel");
  };

  const handleToggleStatus = async () => {
    const actionType = worker.status === "active" ? "퇴사" : "재직";

    const result = await showConfirm({
      title: "작업자 상태 변경",
      message: `${worker.name}님을 ${actionType} 처리 하시겠습니까?`,
      confirmText: `${actionType} 처리`,
      confirmButtonColor: worker.status === "active" ? "#f97316" : "#28a745",
      icon: worker.status === "active" ? "warning" : "question",
    });

    if (result.isConfirmed) {
      try {
        await toggleStatusMutation.mutateAsync(id);
      } catch (error) {
        console.error("작업자 상태 변경 실패:", error);
      }
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
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        작업자 정보를 불러오는 중 오류가 발생했습니다: {error.message}
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md">
        작업자 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-6">
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
          <h1 className="text-2xl font-bold">{worker.name} 상세 정보</h1>
        </div>
        <div className="flex space-x-2">
          <FormButton
            variant={worker.status === "active" ? "warning" : "success"}
            size="sm"
            onClick={handleToggleStatus}
          >
            {worker.status === "active" ? (
              <UserX className="w-4 h-4 mr-2" />
            ) : (
              <UserCheck className="w-4 h-4 mr-2" />
            )}
            {worker.status === "active" ? "퇴사 처리" : "재직 처리"}
          </FormButton>
          <FormButton onClick={handleEdit} size="sm">
            <Edit className="w-4 h-4 mr-2" />
            수정
          </FormButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-medium">{worker.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">이름</p>
                <p className="font-medium">{worker.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">직급</p>
                <p className="font-medium">{worker.position}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">부서</p>
                <p className="font-medium">{worker.department || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">상태</p>
                <p className="font-medium">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      worker.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {worker.status === "active" ? "재직중" : "퇴사"}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">입사일</p>
                <p className="font-medium">{worker.hireDate || "-"}</p>
              </div>
            </div>
          </div>
        </FormCard>

        <FormCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">연락처 정보</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm text-gray-500">생년월일</p>
                <p className="font-medium">{worker.birthDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">연락처</p>
                <p className="font-medium">{worker.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">이메일</p>
                <p className="font-medium">{worker.email || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">주소</p>
                <p className="font-medium">{worker.address || "-"}</p>
              </div>
            </div>
          </div>
        </FormCard>
      </div>

      {/* 메모/특이사항 */}
      {worker.notes && (
        <FormCard className="p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">메모/특이사항</h2>
          <p className="whitespace-pre-line">{worker.notes}</p>
        </FormCard>
      )}
    </div>
  );
};

export default PersonnelDetail;
