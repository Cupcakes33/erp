import { DataTable } from "@/components/molecules"
import React, { useState } from "react"

export default function Payments() {
  // 상태 관리
  const [contractsLoading, setContractsLoading] = useState(false)
  const [paymentsLoading, setPaymentsLoading] = useState(false)
  const [workOrdersLoading, setWorkOrdersLoading] = useState(false)

  // 계약 목록 컬럼 정의
  const contractColumns = [
    {
      accessorKey: "contractName",
      header: "계약명",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "contractAmount",
      header: "계약금액",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "contractDate",
      header: "계약일",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "company",
      header: "업체",
      cell: (info) => info.getValue() ?? null,
    },
  ]

  // 기성 목록 컬럼 정의
  const paymentColumns = [
    {
      accessorKey: "order",
      header: "차수",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "inspectionDate",
      header: "기성검사일",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "previousTotal",
      header: "전회까지",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "detailAmount",
      header: "내역금액",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "paymentAmount",
      header: "기성금액",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "accumulatedAmount",
      header: "누계금액",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "status",
      header: "처리상태",
      cell: (info) => info.getValue() ?? null,
    },
  ]

  // 기성 보수지시 공종 목록 컬럼 정의
  const workOrderColumns = [
    {
      accessorKey: "order",
      header: "차수",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "managementCenter",
      header: "관리센터",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "orderId",
      header: "지시서ID",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "orderNumber",
      header: "지시번호",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "orderDate",
      header: "지시일자",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "orderName",
      header: "지시명",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "orderStatus",
      header: "지시서상태",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "complaintWorkTypeId",
      header: "민원공종ID",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "facilityName",
      header: "시설물명",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "workTypeName",
      header: "공종명",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "complexName",
      header: "단지명",
      cell: (info) => info.getValue() ?? null,
    },
    {
      accessorKey: "building",
      header: "동",
      cell: (info) => info.getValue() ?? null,
    },
  ]

  // 더미 데이터 (실제 구현 시 API에서 데이터를 가져오도록 수정 필요)
  const dummyContracts = [
    {
      contractName:
        "성북구청/성북/동선동구역/단구 소규모주택 사업단 주거브스공사",
      contractAmount: "1,448,484,540",
      contractDate: "2023.03.23",
      company: "주식회사 광명종합건업",
    },
    {
      contractName: "강남구청/강남/신사동구역/신축 아파트 건설",
      contractAmount: "2,500,000,000",
      contractDate: "2024.01.15",
      company: "주식회사 미래건설",
    },
  ]

  const dummyPayments = [
    {
      order: 8,
      inspectionDate: "2025.02.28",
      previousTotal: "1,124,055,900",
      detailAmount: "172,501,127",
      paymentAmount: "151,152,000",
      accumulatedAmount: "1,124,055,900",
      status: "기성합격 선정",
    },
    {
      order: 7,
      inspectionDate: "2024.12.19",
      previousTotal: "811,965,500",
      detailAmount: "190,338,900",
      paymentAmount: "161,338,000",
      accumulatedAmount: "963,303,900",
      status: "검수진행중",
    },
  ]

  const dummyWorkOrders = [
    {
      order: 8,
      managementCenter: "성북구거점관리운영센터",
      orderId: "646484",
      orderNumber: "성북구청공사2024-08",
      orderDate: "2024.08.15",
      orderName: "도로포장공사 2공구 2024년 8월",
      orderStatus: "완료",
      complaintWorkTypeId: "2561481",
      facilityName: "성북구청도로 0097 - 0302",
      workTypeName: "포장-도로포장",
      complexName: "다가구주택단지",
      building: "92",
    },
    {
      order: 7,
      managementCenter: "성북구거점관리운영센터",
      orderId: "644371",
      orderNumber: "성북구청공사2024-07",
      orderDate: "2024.07.10",
      orderName: "도로포장공사 1공구 2024년 7월",
      orderStatus: "진행중",
      complaintWorkTypeId: "2561891",
      facilityName: "성북구청도로 0097 - 0301",
      workTypeName: "포장-도로포장",
      complexName: "다가구주택단지",
      building: "90",
    },
  ]

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">기성 조회</h1>
      </div>
      <div className="flex flex-col gap-6 p-6">
        {/* 상단 테이블 두 개를 가로로 배치 - 유동적 높이, 최대 50% */}
        <div className="flex gap-6 max-h-[50vh]">
          {/* 계약 목록 테이블 */}
          <div className="flex-1 overflow-auto">
            <DataTable
              columns={contractColumns}
              data={dummyContracts}
              loading={contractsLoading}
              emptyMessage={
                contractsLoading
                  ? "데이터 로딩 중..."
                  : "등록된 계약이 없습니다."
              }
              title="계약 목록"
              subtitle="전체 0개"
              enableSorting={false}
              pageSize={10}
              manualPagination={true}
              enablePagination={false}
            />
          </div>

          {/* 기성 목록 테이블 */}
          <div className="flex-1 overflow-auto">
            <DataTable
              columns={paymentColumns}
              data={dummyPayments}
              loading={paymentsLoading}
              emptyMessage={
                paymentsLoading
                  ? "데이터 로딩 중..."
                  : "등록된 기성이 없습니다."
              }
              title="기성 목록"
              subtitle="전체 0개"
              enableSorting={false}
              pageSize={10}
              manualPagination={true}
              enablePagination={false}
            />
          </div>
        </div>

        {/* 하단 테이블 - 유동적 높이, 최대 50% */}
        <div className="w-full max-h-[50vh] overflow-auto">
          <DataTable
            columns={workOrderColumns}
            data={dummyWorkOrders}
            loading={workOrdersLoading}
            emptyMessage={
              workOrdersLoading
                ? "데이터 로딩 중..."
                : "등록된 보수지시가 없습니다."
            }
            title="기성 보수지시 공종 목록"
            subtitle="전체 0개"
            enableSorting={false}
            pageSize={10}
            manualPagination={true}
            enablePagination={false}
          />
        </div>
      </div>
    </div>
  )
}
