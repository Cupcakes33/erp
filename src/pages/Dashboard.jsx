import React, { useState, useEffect } from "react";
import { FormCard, FormButton } from "../components/molecules";

// SVG 아이콘 컴포넌트 - 일관된 스타일 적용
const IconDocument = ({ className = "h-5 w-5 sm:h-6 sm:w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
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
);

const IconClock = ({ className = "h-5 w-5 sm:h-6 sm:w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
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
);

const IconCheck = ({ className = "h-5 w-5 sm:h-6 sm:w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
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
);

const IconBriefcase = ({ className = "h-5 w-5 sm:h-6 sm:w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
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
);

const IconArrows = ({ className = "h-5 w-5 sm:h-6 sm:w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
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
);

// 카드 아이템 공통 컴포넌트 - 코드 중복 제거
const StatCard = ({ title, value, icon, bgColor }) => (
  <FormCard variant={bgColor} className="h-full shadow-sm">
    <div className="flex items-center">
      <div
        className={`p-2 sm:p-3 rounded-lg ${
          bgColor === "outline" ? "bg-secondary" : `bg-${bgColor}`
        } text-white mr-3 sm:mr-4 flex-shrink-0`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm text-gray-600 truncate">{title}</p>
        <p className="text-lg sm:text-2xl font-bold">{value}</p>
      </div>
    </div>
  </FormCard>
);

// 작업 상태 카드 공통 컴포넌트 - 코드 중복 제거
const WorkStatusCard = ({ title, value, icon, bgColor }) => (
  <FormCard variant={bgColor} className="h-full shadow-sm">
    <div className="flex flex-row sm:flex-col items-center sm:items-center">
      <div
        className={`p-2 sm:p-3 rounded-lg bg-${bgColor} text-white mr-4 sm:mr-0 sm:mb-3 flex-shrink-0`}
      >
        {icon}
      </div>
      <div className="sm:text-center">
        <p className="text-lg sm:text-3xl font-bold">{value}</p>
        <p className="text-xs sm:text-sm text-gray-600">{title}</p>
      </div>
    </div>
  </FormCard>
);

// 상태 배지 공통 컴포넌트
const StatusBadge = ({ status, getStatusClass }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${getStatusClass(
      status
    )}`}
  >
    {status}
  </span>
);

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

  // 상태에 따른 배지 스타일 반환 - tailwind.config.js 색상 테마 활용
  const getStatusClass = (status) => {
    switch (status) {
      case "대기중":
        return "bg-warning/20 text-warning border border-warning/30";
      case "진행중":
        return "bg-primary/20 text-primary border border-primary/30";
      case "완료":
        return "bg-success/20 text-success border border-success/30";
      case "취소":
        return "bg-danger/20 text-danger border border-danger/30";
      default:
        return "bg-secondary/20 text-secondary border border-secondary/30";
    }
  };

  // 우선순위에 따른 배지 스타일 반환 - tailwind.config.js 색상 테마 활용
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "높음":
        return "bg-danger/20 text-danger border border-danger/30";
      case "중간":
        return "bg-warning/20 text-warning border border-warning/30";
      case "낮음":
        return "bg-success/20 text-success border border-success/30";
      default:
        return "bg-secondary/20 text-secondary border border-secondary/30";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8">
      <h1 className="text-2xl font-bold my-6">대시보드</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 통계 카드 - 컴포넌트로 추출하여 일관성 개선 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="전체 지시"
              value={stats.totalInstructions}
              icon={<IconDocument />}
              bgColor="primary"
            />
            <StatCard
              title="대기 중인 지시"
              value={stats.pendingInstructions}
              icon={<IconClock />}
              bgColor="warning"
            />
            <StatCard
              title="완료된 지시"
              value={stats.completedInstructions}
              icon={<IconCheck />}
              bgColor="success"
            />
            <StatCard
              title="전체 작업"
              value={stats.totalWorks}
              icon={<IconBriefcase />}
              bgColor="outline"
            />
          </div>

          {/* 작업 상태 통계 - 컴포넌트로 추출하여 일관성 개선 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <WorkStatusCard
              title="대기 중인 작업"
              value={stats.pendingWorks}
              icon={<IconClock />}
              bgColor="warning"
            />
            <WorkStatusCard
              title="진행 중인 작업"
              value={stats.inProgressWorks}
              icon={<IconArrows />}
              bgColor="primary"
            />
            <WorkStatusCard
              title="완료된 작업"
              value={stats.completedWorks}
              icon={<IconCheck />}
              bgColor="success"
            />
          </div>

          {/* 최근 지시 및 작업 - 컴포넌트와 클래스 일관성 개선 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormCard
              title="최근 지시"
              variant="outline"
              className="h-full shadow-sm rounded-lg"
              footer={
                <FormButton variant="default" size="sm" className="w-full">
                  모든 지시 보기
                </FormButton>
              }
            >
              {recentInstructions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  최근 지시가 없습니다.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentInstructions.map((instruction) => (
                    <div
                      key={instruction.id}
                      className="py-3 hover:bg-gray-50 transition-colors rounded px-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {instruction.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {instruction.id} • 마감일: {instruction.dueDate}
                          </p>
                        </div>
                        <span
                          className={`${getStatusClass(
                            instruction.status
                          )} px-2 py-1 text-xs rounded-md`}
                        >
                          {instruction.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span
                          className={`${getPriorityClass(
                            instruction.priority
                          )} px-2 py-1 text-xs rounded-md`}
                        >
                          {instruction.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </FormCard>

            <FormCard
              title="최근 작업"
              variant="primary"
              className="h-full shadow-sm rounded-lg"
              footer={
                <FormButton variant="outline" size="sm" className="w-full">
                  모든 작업 보기
                </FormButton>
              }
            >
              {recentWorks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  최근 작업이 없습니다.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentWorks.map((work) => (
                    <div
                      key={work.id}
                      className="py-3 hover:bg-gray-50 transition-colors rounded-md px-3"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {work.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1 gap-2">
                            <span className="truncate">{work.id}</span>
                            <span>•</span>
                            <span className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              {work.assignedTo}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`${getStatusClass(
                            work.status
                          )} px-2.5 py-1 text-xs rounded-full whitespace-nowrap`}
                        >
                          {work.status}
                        </span>
                      </div>

                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium">진행률</span>
                          <span
                            className={
                              work.completionRate === 100
                                ? "text-success font-bold"
                                : "text-gray-600"
                            }
                          >
                            {work.completionRate}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              work.completionRate === 100
                                ? "bg-success"
                                : work.completionRate > 50
                                ? "bg-primary"
                                : "bg-warning"
                            }`}
                            style={{ width: `${work.completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </FormCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
