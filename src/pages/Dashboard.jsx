import React, { useState, useEffect } from "react";
import { FormCard, FormButton } from "../components/molecules";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInstructions: 0,
    pendingInstructions: 0,
    completedInstructions: 0,
    totalWorks: 0,
    pendingWorks: 0,
    inProgressWorks: 0,
    completedWorks: 0,
  });

  const [recentInstructions, setRecentInstructions] = useState([]);
  const [recentWorks, setRecentWorks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 대시보드 데이터 로딩 시뮬레이션
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);

      // 실제 구현에서는 API 호출로 대체
      setTimeout(() => {
        // 통계 데이터 설정
        setStats({
          totalInstructions: 24,
          pendingInstructions: 8,
          completedInstructions: 16,
          totalWorks: 42,
          pendingWorks: 12,
          inProgressWorks: 18,
          completedWorks: 12,
        });

        // 최근 지시 데이터
        setRecentInstructions([
          {
            id: "INS-2025-0012",
            title: "강북구 도로 보수 공사",
            priority: "높음",
            status: "진행중",
            dueDate: "2025-04-20",
          },
          {
            id: "INS-2025-0011",
            title: "서초구 가로등 교체 작업",
            priority: "중간",
            status: "대기중",
            dueDate: "2025-04-25",
          },
          {
            id: "INS-2025-0010",
            title: "강남구 보도블럭 교체",
            priority: "낮음",
            status: "완료",
            dueDate: "2025-04-10",
          },
          {
            id: "INS-2025-0009",
            title: "종로구 하수관 보수",
            priority: "높음",
            status: "진행중",
            dueDate: "2025-04-18",
          },
        ]);

        // 최근 작업 데이터
        setRecentWorks([
          {
            id: "WRK-2025-0024",
            name: "강북구 수유동 도로 균열 보수",
            status: "진행중",
            completionRate: 45,
            assignedTo: "김철수",
          },
          {
            id: "WRK-2025-0023",
            name: "서초구 반포대로 가로등 교체",
            status: "대기중",
            completionRate: 0,
            assignedTo: "박영희",
          },
          {
            id: "WRK-2025-0022",
            name: "강남구 삼성동 보도블럭 교체",
            status: "완료",
            completionRate: 100,
            assignedTo: "이민수",
          },
          {
            id: "WRK-2025-0021",
            name: "종로구 관수동 하수관 보수",
            status: "진행중",
            completionRate: 75,
            assignedTo: "정지영",
          },
        ]);

        setIsLoading(false);
      }, 1000);
    };

    loadDashboardData();
  }, []);

  // 상태에 따른 배경색 클래스 반환
  const getStatusClass = (status) => {
    switch (status) {
      case "대기중":
        return "bg-yellow-100 text-yellow-800";
      case "진행중":
        return "bg-blue-100 text-blue-800";
      case "완료":
        return "bg-green-100 text-green-800";
      case "취소":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 우선순위에 따른 배경색 클래스 반환
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "높음":
        return "bg-red-100 text-red-800";
      case "중간":
        return "bg-yellow-100 text-yellow-800";
      case "낮음":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <FormCard className="bg-blue-50 border-blue-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-500 text-white mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">전체 지시</p>
                  <p className="text-xl font-bold">{stats.totalInstructions}</p>
                </div>
              </div>
            </FormCard>

            <FormCard className="bg-yellow-50 border-yellow-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-500 text-white mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">대기 중인 지시</p>
                  <p className="text-xl font-bold">
                    {stats.pendingInstructions}
                  </p>
                </div>
              </div>
            </FormCard>

            <FormCard className="bg-green-50 border-green-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-500 text-white mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">완료된 지시</p>
                  <p className="text-xl font-bold">
                    {stats.completedInstructions}
                  </p>
                </div>
              </div>
            </FormCard>

            <FormCard className="bg-purple-50 border-purple-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-500 text-white mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">전체 작업</p>
                  <p className="text-xl font-bold">{stats.totalWorks}</p>
                </div>
              </div>
            </FormCard>
          </div>

          {/* 작업 상태 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <FormCard className="bg-gray-50 border-gray-200">
              <div className="flex flex-col items-center">
                <div className="mb-2 p-2 rounded-full bg-gray-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-3xl font-bold mb-1">{stats.pendingWorks}</p>
                <p className="text-sm text-gray-600">대기 중인 작업</p>
              </div>
            </FormCard>

            <FormCard className="bg-blue-50 border-blue-200">
              <div className="flex flex-col items-center">
                <div className="mb-2 p-2 rounded-full bg-blue-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </div>
                <p className="text-3xl font-bold mb-1">
                  {stats.inProgressWorks}
                </p>
                <p className="text-sm text-gray-600">진행 중인 작업</p>
              </div>
            </FormCard>

            <FormCard className="bg-green-50 border-green-200">
              <div className="flex flex-col items-center">
                <div className="mb-2 p-2 rounded-full bg-green-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-3xl font-bold mb-1">
                  {stats.completedWorks}
                </p>
                <p className="text-sm text-gray-600">완료된 작업</p>
              </div>
            </FormCard>
          </div>

          {/* 최근 지시 및 작업 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormCard
              title="최근 지시"
              footer={
                <FormButton variant="outline" size="sm" fullWidth>
                  모든 지시 보기
                </FormButton>
              }
            >
              <div className="divide-y">
                {recentInstructions.map((instruction) => (
                  <div
                    key={instruction.id}
                    className="py-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-gray-900">
                        {instruction.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {instruction.id} • 마감일: {instruction.dueDate}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${getPriorityClass(
                          instruction.priority
                        )}`}
                      >
                        {instruction.priority}
                      </span>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusClass(
                          instruction.status
                        )}`}
                      >
                        {instruction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </FormCard>

            <FormCard
              title="최근 작업"
              footer={
                <FormButton variant="outline" size="sm" fullWidth>
                  모든 작업 보기
                </FormButton>
              }
            >
              <div className="divide-y">
                {recentWorks.map((work) => (
                  <div
                    key={work.id}
                    className="py-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-gray-900">{work.name}</p>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusClass(
                          work.status
                        )}`}
                      >
                        {work.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-500">
                        {work.id} • 담당: {work.assignedTo}
                      </p>
                      <p className="text-gray-500">
                        진행률: {work.completionRate}%
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${work.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </FormCard>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
