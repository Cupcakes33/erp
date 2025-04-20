import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCreateUnitPrice } from "../../lib/api/workQueries"
import { FormButton, FormInput, FormCard } from "../../components/molecules"
import { ArrowLeft } from "lucide-react"

const WorkCreate = () => {
  const navigate = useNavigate()
  const createWorkMutation = useCreateUnitPrice()

  const [formData, setFormData] = useState({
    type: "",
    code: "",
    name: "",
    spec: "",
    unit: "",
    material_cost: 0,
    labor_cost: 0,
    expense: 0,
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    })
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.type.trim()) newErrors.type = "분류를 입력해주세요"
    if (!formData.code.trim()) newErrors.code = "코드를 입력해주세요"
    if (!formData.name.trim()) newErrors.name = "공종명을 입력해주세요"
    if (!formData.unit.trim()) newErrors.unit = "단위를 입력해주세요"
    if (formData.material_cost === null || formData.material_cost === undefined)
      newErrors.material_cost = "재료비를 입력해주세요"
    if (formData.labor_cost === null || formData.labor_cost === undefined)
      newErrors.labor_cost = "노무비를 입력해주세요"
    if (formData.expense === null || formData.expense === undefined)
      newErrors.expense = "경비를 입력해주세요"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      await createWorkMutation.mutateAsync(formData)
      navigate("/works")
    } catch (error) {
      setErrors({
        submit: "생성 중 오류가 발생했습니다.",
      })
    }
  }

  const handleCancel = () => {
    navigate("/works")
  }

  return (
    <div className="mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <FormButton
          variant="outline"
          size="sm"
          onClick={handleCancel}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </FormButton>
        <h1 className="text-2xl font-bold">일위대가 등록</h1>
      </div>
      <FormCard>
        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errors.submit}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormInput
              id="type"
              name="type"
              label="분류"
              placeholder="분류를 입력하세요"
              value={formData.type}
              onChange={handleChange}
              error={errors.type}
              required
            />
            <FormInput
              id="code"
              name="code"
              label="코드"
              placeholder="코드를 입력하세요"
              value={formData.code}
              onChange={handleChange}
              error={errors.code}
              required
            />
            <FormInput
              id="name"
              name="name"
              label="공종명"
              placeholder="공종명을 입력하세요"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            <FormInput
              id="spec"
              name="spec"
              label="규격"
              placeholder="규격을 입력하세요"
              value={formData.spec}
              onChange={handleChange}
            />
            <FormInput
              id="unit"
              name="unit"
              label="단위"
              placeholder="단위를 입력하세요"
              value={formData.unit}
              onChange={handleChange}
              error={errors.unit}
              required
            />
            <FormInput
              id="material_cost"
              name="material_cost"
              label="재료비"
              placeholder="재료비를 입력하세요"
              value={formData.material_cost}
              onChange={handleChange}
              error={errors.material_cost}
              required
              type="number"
              min="0"
            />
            <FormInput
              id="labor_cost"
              name="labor_cost"
              label="노무비"
              placeholder="노무비를 입력하세요"
              value={formData.labor_cost}
              onChange={handleChange}
              error={errors.labor_cost}
              required
              type="number"
              min="0"
            />
            <FormInput
              id="expense"
              name="expense"
              label="경비"
              placeholder="경비를 입력하세요"
              value={formData.expense}
              onChange={handleChange}
              error={errors.expense}
              required
              type="number"
              min="0"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <FormButton type="button" variant="outline" onClick={handleCancel}>
              취소
            </FormButton>
            <FormButton type="submit" disabled={createWorkMutation.isLoading}>
              {createWorkMutation.isLoading ? "처리 중..." : "저장"}
            </FormButton>
          </div>
        </form>
      </FormCard>
    </div>
  )
}

export default WorkCreate
