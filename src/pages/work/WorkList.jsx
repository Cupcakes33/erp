import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkQueries } from '../../lib/api/workQueries'
import Table from '../../components/molecules/Table'
import Button from '../../components/atoms/Button'
import Card from '../../components/atoms/Card'
import Input from '../../components/atoms/Input'
import Select from '../../components/atoms/Select'

const WorkList = () => {
  const navigate = useNavigate()
  const { useWorks } = useWorkQueries()
  const { data: works = [], isLoading, error } = useWorks()
  
  const [filters, setFilters] = useState({
    status: '',
    assignedTo: '',
    search: ''
  })
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value
    })
  }
  
  const handleRowClick = (work) => {
    navigate(`/works/${work.id}`)
  }
  
  const handleCreateClick = () => {
    navigate('/works/create')
  }
  
  // 필터링된 작업 목록
  const filteredWorks = works.filter(work => {
    const matchesStatus = filters.status ? work.status === filters.status : true
    const matchesAssignedTo = filters.assignedTo ? work.assignedTo === filters.assignedTo : true
    const matchesSearch = filters.search 
      ? work.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        work.id?.toLowerCase().includes(filters.search.toLowerCase()) ||
        work.location?.toLowerCase().includes(filters.search.toLowerCase()) ||
        work.instructionTitle?.toLowerCase().includes(filters.search.toLowerCase())
      : true
    
    return matchesStatus && matchesAssignedTo && matchesSearch
  })
  
  // 담당자 목록 추출 (중복 제거)
  const assignedToOptions = [
    { value: '', label: '모든 담당자' },
    ...Array.from(new Set(works.map(work => work.assignedTo)))
      .filter(Boolean)
      .map(name => ({ value: name, label: name }))
  ]
  
  const columns = [
    { title: '작업 ID', dataIndex: 'id', width: '120px' },
    { title: '작업명', dataIndex: 'name' },
    { title: '지시 ID', dataIndex: 'instructionId', width: '120px' },
    { title: '지시 제목', dataIndex: 'instructionTitle' },
    { title: '위치', dataIndex: 'location' },
    { 
      title: '상태', 
      dataIndex: 'status',
      render: (row) => {
        const statusClasses = {
          '대기중': 'bg-blue-100 text-blue-800',
          '진행중': 'bg-yellow-100 text-yellow-800',
          '완료': 'bg-green-100 text-green-800',
          '취소': 'bg-red-100 text-red-800'
        }
        
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[row.status] || 'bg-gray-100'}`}>
            {row.status}
          </span>
        )
      }
    },
    { 
      title: '진행률', 
      dataIndex: 'completionRate',
      render: (row) => {
        let bgColorClass = 'bg-blue-500'
        if (row.completionRate >= 100) {
          bgColorClass = 'bg-green-500'
        } else if (row.completionRate >= 70) {
          bgColorClass = 'bg-blue-500'
        } else if (row.completionRate >= 30) {
          bgColorClass = 'bg-yellow-500'
        } else {
          bgColorClass = 'bg-gray-300'
        }
        
        return (
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className={`h-2.5 rounded-full ${bgColorClass}`} 
                style={{ width: `${row.completionRate}%` }}
              ></div>
            </div>
            <span>{row.completionRate}%</span>
          </div>
        )
      }
    },
    { title: '담당자', dataIndex: 'assignedTo' },
    { title: '시작일', dataIndex: 'startDate' },
    { title: '종료일', dataIndex: 'endDate' }
  ]
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">작업 관리</h1>
        <Button 
          variant="primary" 
          onClick={handleCreateClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          새 작업 생성
        </Button>
      </div>
      
      <Card className="mb-6 bg-white shadow-md rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            id="search"
            name="search"
            placeholder="작업 ID, 작업명, 지시 제목, 위치 검색"
            value={filters.search}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <Select
            id="status"
            name="status"
            placeholder="상태 선택"
            value={filters.status}
            onChange={handleFilterChange}
            options={[
              { value: '', label: '모든 상태' },
              { value: '대기중', label: '대기중' },
              { value: '진행중', label: '진행중' },
              { value: '완료', label: '완료' },
              { value: '취소', label: '취소' }
            ]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <Select
            id="assignedTo"
            name="assignedTo"
            placeholder="담당자 선택"
            value={filters.assignedTo}
            onChange={handleFilterChange}
            options={assignedToOptions}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error instanceof Error ? error.message : '데이터를 불러오는 중 오류가 발생했습니다.'}
        </div>
      )}
      
      <Card className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table
          columns={columns}
          data={filteredWorks}
          isLoading={isLoading}
          emptyMessage="조회된 작업이 없습니다."
          onRowClick={handleRowClick}
          className="min-w-full divide-y divide-gray-200"
        />
      </Card>
    </div>
  )
}

export default WorkList
