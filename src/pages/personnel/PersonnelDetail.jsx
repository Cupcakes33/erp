import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useWorker,
  useToggleWorkerStatus,
} from "../../lib/api/personnelQueries";

const PersonnelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 데이터 로드
  const { data: worker, isLoading, error } = useWorker(parseInt(id));
  const toggleStatusMutation = useToggleWorkerStatus();

  // 작업자 상태 변경 처리
  const handleStatusChange = () => {
    if (!worker) return;

    if (confirm(`${worker.name} 작업자의 상태를 변경하시겠습니까?`)) {
      toggleStatusMutation.mutate(worker.id, {
        onSuccess: () => {
          // 성공 메시지 처리
        },
        onError: (error) => {
          alert(`상태 변경 중 오류가 발생했습니다: ${error.message}`);
        },
      });
    }
  };

  // 뒤로 가기
  const handleBack = () => {
    navigate("/personnel");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>데이터를 불러오는데 오류가 발생했습니다: {error.message}</p>
          <button
            onClick={handleBack}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>작업자를 찾을 수 없습니다.</p>
          <button
            onClick={handleBack}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-100 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">작업자 상세 정보</h2>
          <div className="flex space-x-2">
            <Link
              to={`/personnel/${id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              수정
            </Link>
            <button
              onClick={handleStatusChange}
              className={`px-4 py-2 text-white rounded ${
                worker.status === "재직"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={toggleStatusMutation.isPending}
            >
              {toggleStatusMutation.isPending
                ? "처리중..."
                : worker.status === "재직"
                ? "퇴사 처리"
                : "재직 처리"}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">이름</h3>
              <p className="mt-1 text-lg text-gray-900">{worker.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">생년월일</h3>
              <p className="mt-1 text-lg text-gray-900">{worker.birthDate}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">연락처</h3>
              <p className="mt-1 text-lg text-gray-900">{worker.phone}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">직책</h3>
              <p className="mt-1 text-lg text-gray-900">{worker.position}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">상태</h3>
              <p className="mt-1">
                <span
                  className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    worker.status === "재직"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {worker.status}
                </span>
              </p>
            </div>
          </div>

          <hr className="my-6" />

          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
            >
              목록으로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonnelDetail;
