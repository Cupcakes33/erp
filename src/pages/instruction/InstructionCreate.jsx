import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInstructionQueries } from '../../lib/api/instructionQueries'
import Button from '../../components/atoms/Button'
import Input from '../../components/atoms/Input'
import Select from '../../components/atoms/Select'
import Card from '../../components/atoms/Card'
import FormGroup from '../../components/molecules/FormGroup'

const InstructionCreate = () => {
  const navigate = useNavigate()
  const { useCreateInstruction } = useInstructionQueries()
  const createInstructionMutation = useCreateInstruction()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    priority: '',
    dueDate: '',
    assignedTo: '',
    budget: ''
  })
  
  const [errors, setErrors] = useState({})
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      })
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.'
    }
    
    if (!formData.location.trim()) {
      newErrors.location = '위치를 입력해주세요.'
    }
    
    if (!formData.priority) {
      newErrors.priority = '우선순위를 선택해주세요.'
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = '마감일을 입력해주세요.'
    }
    
    if (formData.budget && isNaN(Number(formData.budget))) {
      newErrors.budget = '예산은 숫자로 입력해주세요.'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      // 숫자 필드 변환
      const instructionData = {
        ...formData,
        budget: formData.budget ? Number(formData.budget) : undefined
      }
      
      const newInstruction = await createInstructionMutation.mutateAsync(instructionData)
      navigate(`/instructions/${newInstruction.id}`)
    } catch (error) {
      setErrors({
        ...errors,
        submit: error.message || '지시 생성 중 오류가 발생했습니다.'
      })
    }
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">새 지시 생성</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/instructions')}
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md"
        >
          취소
        </Button>
      </div>
      
      <Card className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormGroup
                label="제목"
                htmlFor="title"
                required
                error={errors.title}
              >
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="지시 제목을 입력하세요"
                  required
                  error={errors.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormGroup>
            </div>
            
            <div className="md:col-span-2">
              <FormGroup
                label="설명"
                htmlFor="description"
              >
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="지시에 대한 상세 설명을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </FormGroup>
            </div>
            
            <FormGroup
              label="위치"
              htmlFor="location"
              required
              error={errors.location}
            >
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="작업 위치를 입력하세요"
                required
                error={errors.location}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>
            
            <FormGroup
              label="우선순위"
              htmlFor="priority"
              required
              error={errors.priority}
            >
              <Select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                error={errors.priority}
                options={[
                  { value: '', label: '우선순위 선택' },
                  { value: '높음', label: '높음' },
                  { value: '중간', label: '중간' },
                  { value: '낮음', label: '낮음' }
                ]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>
            
            <FormGroup
              label="마감일"
              htmlFor="dueDate"
              required
              error={errors.dueDate}
            >
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                required
                error={errors.dueDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>
            
            <FormGroup
              label="담당자"
              htmlFor="assignedTo"
            >
              <Input
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="담당자 이름"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>
            
            <FormGroup
              label="예산 (원)"
              htmlFor="budget"
              error={errors.budget}
            >
              <Input
                id="budget"
                name="budget"
                type="text"
                value={formData.budget}
                onChange={handleChange}
                placeholder="예산 금액"
                error={errors.budget}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>
          </div>
          
          {errors.submit && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md my-4">
              {errors.submit}
            </div>
          )}
          
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              variant="primary"
              disabled={createInstructionMutation.isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createInstructionMutation.isLoading ? '생성 중...' : '지시 생성'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default InstructionCreate
