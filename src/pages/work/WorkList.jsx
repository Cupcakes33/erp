import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorks } from "../../lib/api/workQueries";
import DataTable from "../../components/molecules/DataTable";
import { FormButton, FormInput } from "../../components/molecules";
import {
  Eye,
  Pencil,
  Plus,
  Search,
  FileUp,
  Filter,
  RefreshCw,
} from "lucide-react";
import { formatDate } from "../../lib/utils/dateUtils";

const WorkList = () => {
  const navigate = useNavigate();
  const { data: works, isLoading, refetch } = useWorks();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleNavigateToCreate = () => {
    navigate("/works/create");
  };

  const handleNavigateToImport = () => {
    navigate("/works/import");
  };

  const handleNavigateToDetail = (workId) => {
    navigate(`/works/${workId}`);
  };

  const handleNavigateToEdit = (workId) => {
    navigate(`/works/${workId}/edit`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "완료":
        return "bg-green-100 text-green-800";
      case "진행중":
        return "bg-blue-100 text-blue-800";
      case "대기중":
        return "bg-yellow-100 text-yellow-800";
      case "취소됨":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => <div className="font-medium">{row.original.id}</div>,
    },
    {
      header: "작업명",
      accessorKey: "name",
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      header: "위치",
      accessorKey: "location",
    },
    {
      header: "담당자",
      accessorKey: "assignedTo",
    },
    {
      header: "시작일",
      accessorKey: "startDate",
      cell: ({ row }) => <div>{formatDate(row.original.startDate)}</div>,
    },
    {
      header: "상태",
      accessorKey: "status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            row.original.status
          )}`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      header: "진행률",
      accessorKey: "completionRate",
      cell: ({ row }) => (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${row.original.completionRate}%` }}
          ></div>
        </div>
      ),
    },
    {
      header: "관련 지시",
      accessorKey: "instructionId",
    },
    {
      header: "액션",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigateToDetail(row.original.id);
            }}
            className="p-1 text-blue-600 hover:text-blue-800"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigateToEdit(row.original.id);
            }}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            <Pencil size={16} />
          </button>
        </div>
      ),
    },
  ];

  // 검색 필터링을 적용한 작업 목록
  const filteredWorks = works
    ? works.filter((work) => {
        const matchesSearch =
          searchTerm === "" ||
          work.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          work.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          work.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          work.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || work.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">작업 관리</h1>
        <div className="flex space-x-2">
          <FormButton
            variant="outline"
            onClick={handleNavigateToImport}
            className="flex items-center"
          >
            <FileUp className="w-4 h-4 mr-2" />
            데이터 가져오기
          </FormButton>
          <FormButton
            variant="primary"
            onClick={handleNavigateToCreate}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            신규 작업
          </FormButton>
        </div>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="flex flex-col gap-4 mb-4 md:flex-row">
            <div className="relative flex-1">
              <FormInput
                type="text"
                placeholder="작업명, 위치, 담당자, ID로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">모든 상태</option>
                <option value="대기중">대기중</option>
                <option value="진행중">진행중</option>
                <option value="완료">완료</option>
                <option value="취소됨">취소됨</option>
              </select>

              <FormButton
                variant="outline"
                onClick={() => refetch()}
                className="flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                새로고침
              </FormButton>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredWorks}
            loading={isLoading}
            onRowClick={(row) => handleNavigateToDetail(row.original.id)}
            emptyMessage="등록된 작업이 없습니다."
            title="작업 목록"
            subtitle={`전체 ${filteredWorks.length}개`}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkList;
