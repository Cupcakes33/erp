import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkQueries } from '../../lib/api/workQueries'
import { useInstructionQueries } from '../../lib/api/instructionQueries'
import Button from '../../components/atoms/Button'
import Input from '../../components/atoms/Input'
import Select from '../../components/atoms/Select'
import Card from '../../components/atoms/Card'
import FormGroup from '../../components/molecules/FormGroup'

const WorkCreate = () => {
  const navigate = useNavigate()
  const { useCreateWork } = useWorkQueries()
  const { useInstructions } = useInstructionQueries()
  
  const { data: instructions = [], isLoading: isLoadingInstructions } = useInstructions()
  const createWorkMutation = useCreateWork()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructionId: '',
    location: '',
    assignedTo: '',
    startDate: '',
    endDate: ''
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
    
    // 지시 선택 시 위치 자동 설정
    if (name === 'instructionId' && value) {
      const selectedInstruction = instructions.find(instruction => instruction.id === value)
      if (selectedInstruction) {
        setFormData(prev => ({
          ...prev,
          location: selectedInstruction.location,
          instructionId: value
        }))
      }
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = '작업명을 입력해주세요.'
    }
    
    if (!formData.instructionId) {
      newErrors.instructionId = '지시를 선택해주세요.'
    }
    
    if (!formData.location.trim()) {
      newErrors.location = '위치를 입력해주세요.'
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = '종료일은 시작일 이후여야 합니다.'
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
      const workData = {
        ...formData,
        // 지시 제목 추가
        instructionTitle: instructions.find(i => i.id === formData.instructionId)?.title || ''
      }
      
      const newWork = await createWorkMutation.mutateAsync(workData)
      navigate(`/works/${newWork.id}`)
    } catch (error) {
      setErrors({
        ...errors,
        submit: error.message || '작업 생성 중 오류가 발생했습니다.'
      })
    }
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">새 작업 생성</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/works')}
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
                label="작업명"
                htmlFor="name"
                required
                error={errors.name}
              >
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="작업명을 입력하세요"
                  required
                  error={errors.name}
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
                  placeholder="작업에 대한 상세 설명을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </FormGroup>
            </div>
            
            <FormGroup
              label="지시"
              htmlFor="instructionId"
              required
              error={errors.instructionId}
            >
              <Select
                id="instructionId"
                name="instructionId"
                value={formData.instructionId}
                onChange={handleChange}
                required
                error={errors.instructionId}
                options={[
                  { value: '', label: '지시 선택' },
                  ...instructions.map(instruction => ({
                    value: instruction.id,
                    label: `${instruction.id} - ${instruction.title}`
                  }))
                ]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormGroup>
            
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
            
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup
                  label="시작일"
                  htmlFor="startDate"
                >
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </FormGroup>
                
                <FormGroup
                  label="종료일"
                  htmlFor="endDate"
                  error={errors.endDate}
                >
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    error={errors.endDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </FormGroup>
              </div>
            </div>
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
              disabled={createWorkMutation.isLoading || isLoadingInstructions}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createWorkMutation.isLoading ? '생성 중...' : '작업 생성'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default WorkCreate
