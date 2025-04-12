import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import FormGroup from '../components/molecules/FormGroup';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error: authError } = useAuthStore(state => ({
    login: state.login,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error
  }));
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  
  // 인증 상태 변경 감지
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    
    if (authError) {
      setError(authError);
    }
  }, [isAuthenticated, authError, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // 입력 시 에러 메시지 초기화
    if (error) setError('');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 간단한 유효성 검사
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    // Zustand 스토어의 login 함수 호출
    login(formData);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">보수작업관리시스템</h1>
          <p className="text-gray-600 mt-2">계정 정보로 로그인하세요</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <FormGroup
            label="아이디"
            htmlFor="username"
            required
          >
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              required
              autoFocus
            />
          </FormGroup>
          
          <FormGroup
            label="비밀번호"
            htmlFor="password"
            required
          >
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </FormGroup>
          
          <div className="flex items-center justify-between mt-2 mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                로그인 상태 유지
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="text-primary hover:text-primary-dark">
                비밀번호를 잊으셨나요?
              </a>
            </div>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>테스트 계정: admin / admin</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
