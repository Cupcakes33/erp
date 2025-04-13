import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorker, useUpdateWorker } from "../../lib/api/personnelQueries";
import Button from "../../components/atoms/Button";
import Card from "../../components/atoms/Card";
import Input from "../../components/atoms/Input";
import Select from "../../components/atoms/Select";
import FormGroup from "../../components/molecules/FormGroup";

/**
 * 작업자 정보 수정 페이지
 */
const PersonnelEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 작업자 데이터 불러오기
  const { data: worker, isLoading, isError, error } = useWorker(parseInt(id));

  // 뮤테이션 훅 사용
  const updateWorkerMutation = useUpdateWorker();

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    phone: "",
    position: "",
    status: "",
  });

  // 유효성 검증 오류 상태
  const [errors, setErrors] = useState({});

  // 작업자 데이터가 로드되면 폼 상태 업데이트
  useEffect(() => {
    if (worker) {
      setFormData({
        name: worker.name || "",
        birthDate: worker.birthDate || "",
        phone: worker.phone || "",
        position: worker.position || "",
        status: worker.status || "",
      });
    }
  }, [worker]);

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

    // 작업자 데이터 업데이트
    updateWorkerMutation.mutate(
      { id: parseInt(id), workerData: formData },
      {
        onSuccess: () => {
          navigate(`/personnel/${id}`);
        },
        onError: (error) => {
          alert(
            `작업자 정보 업데이트 중 오류가 발생했습니다: ${error.message}`
          );
        },
      }
    );
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

    if (!data.position) {
      errors.position = "직위를 선택하세요";
    }

    if (!data.status) {
      errors.status = "상태를 선택하세요";
    }

    return errors;
  };

  // 취소 처리
  const handleCancel = () => {
    navigate(`/personnel/${id}`);
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // 오류 표시
  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <Card.Body>
            <div className="text-red-600">
              작업자 정보를 불러오는 데 실패했습니다: {error.message}
            </div>
            <Button onClick={() => navigate("/personnel")} className="mt-4">
              돌아가기
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <Card.Header>
          <h2 className="text-2xl font-bold">작업자 정보 수정</h2>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <FormGroup
                label="직위"
                htmlFor="position"
                error={errors.position}
              >
                <Select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                >
                  <option value="">선택하세요</option>
                  <option value="반장">반장</option>
                  <option value="작업자">작업자</option>
                </Select>
              </FormGroup>

              <FormGroup label="상태" htmlFor="status" error={errors.status}>
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="">선택하세요</option>
                  <option value="active">재직중</option>
                  <option value="inactive">퇴사</option>
                </Select>
              </FormGroup>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
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
                disabled={updateWorkerMutation.isPending}
              >
                {updateWorkerMutation.isPending ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PersonnelEdit;
