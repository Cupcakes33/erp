import { DataTable } from "@/components/molecules"
import React, { useState } from "react"
import { dummyContracts, dummyPayments, dummyWorkOrders } from "./mockData"

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

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">기성 조회</h1>
      </div>
      <div className="flex flex-col gap-6 p-6">
        {/* 상단 테이블 두 개를 가로로 배치 - 유동적 높이, 최대 40% */}
        <div className="flex gap-6 max-h-[40vh]">
          {/* 계약 목록 테이블 */}
          <div className="flex-1">
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
              subtitle={`전체 ${dummyContracts.length}개`}
              enableSorting={false}
              pageSize={10}
              manualPagination={true}
              enablePagination={false}
              horizontalScroll={true}
              verticalScroll={true}
              maxHeight="calc(40vh - 150px)"
            />
          </div>

          {/* 기성 목록 테이블 */}
          <div className="flex-1">
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
              subtitle={`전체 ${dummyPayments.length}개`}
              enableSorting={false}
              pageSize={10}
              manualPagination={true}
              enablePagination={false}
              horizontalScroll={true}
              verticalScroll={true}
              maxHeight="calc(40vh - 150px)"
            />
          </div>
        </div>

        {/* 하단 테이블 - 유동적 높이, 최대 40% */}
        <div className="w-full max-h-[40vh]">
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
            subtitle={`전체 ${dummyWorkOrders.length}개`}
            enableSorting={false}
            pageSize={10}
            horizontalScroll={true}
            verticalScroll={true}
            maxHeight="calc(40vh - 150px)"
            manualPagination={true}
            enablePagination={false}
          />
        </div>
      </div>
    </div>
  )
}
