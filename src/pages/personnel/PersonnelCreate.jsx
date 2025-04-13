import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateWorker } from "../../lib/api/personnelQueries";
import Button from "../../components/atoms/Button";
import Card from "../../components/atoms/Card";
import Input from "../../components/atoms/Input";
import Select from "../../components/atoms/Select";
import FormGroup from "../../components/molecules/FormGroup";

/**
 * 신규 작업자 생성 페이지
 */
const PersonnelCreate = () => {
  const navigate = useNavigate();

  // 뮤테이션 훅 사용
  const createWorkerMutation = useCreateWorker();

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    phone: "",
    position: "작업자", // 기본값 설정
    status: "active", // 기본값 설정
  });

  // 유효성 검증 오류 상태
  const [errors, setErrors] = useState({});

  // 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 값이 변경되면 해당 필드의 오류 초기화
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성 검증
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // 작업자 생성
    createWorkerMutation.mutate(formData, {
      onSuccess: () => {
        navigate("/personnel");
      },
      onError: (error) => {
        alert(`작업자 생성 중 오류가 발생했습니다: ${error.message}`);
      },
    });
  };

  // 폼 유효성 검증 함수
  const validateForm = (data) => {
    const errors = {};

    if (!data.name.trim()) {
      errors.name = "이름을 입력하세요";
    }

    if (!data.birthDate) {
      errors.birthDate = "생년월일을 입력하세요";
    }

    if (!data.phone) {
      errors.phone = "전화번호를 입력하세요";
    } else if (!/^\d{3}-\d{4}-\d{4}$/.test(data.phone)) {
      errors.phone = "전화번호 형식이 올바르지 않습니다 (예: 010-1234-5678)";
    }

    return errors;
  };

  // 취소 처리
  const handleCancel = () => {
    navigate("/personnel");
  };

  return (
    <div className="container p-4 mx-auto">
      <Card>
        <Card.Header>
          <h2 className="text-2xl font-bold">신규 작업자 생성</h2>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormGroup label="이름" htmlFor="name" error={errors.name}>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup
                label="생년월일"
                htmlFor="birthDate"
                error={errors.birthDate}
              >
                <Input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup label="전화번호" htmlFor="phone" error={errors.phone}>
                <Input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="010-1234-5678"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup label="직위" htmlFor="position">
                <Select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                >
                  <option value="반장">반장</option>
                  <option value="작업자">작업자</option>
                </Select>
              </FormGroup>

              <FormGroup label="상태" htmlFor="status">
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">재직중</option>
                  <option value="inactive">퇴사</option>
                </Select>
              </FormGroup>
            </div>

            <div className="flex justify-end mt-6 space-x-2">
              <Button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600"
              >
                취소
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600"
                disabled={createWorkerMutation.isPending}
              >
                {createWorkerMutation.isPending ? "생성 중..." : "생성"}
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PersonnelCreate;
