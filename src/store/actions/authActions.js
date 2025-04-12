import { createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../../lib/api'

// 로그인 액션
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials)
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('token', response.token)
      return response
    } catch (error) {
      return rejectWithValue(error.message || '로그인에 실패했습니다.')
    }
  }
)

// 로그아웃 액션
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout()
      // 로컬 스토리지에서 토큰 제거
      localStorage.removeItem('token')
      return true
    } catch (error) {
      return rejectWithValue(error.message || '로그아웃에 실패했습니다.')
    }
  }
)

// 사용자 프로필 조회 액션
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile()
      return response
    } catch (error) {
      return rejectWithValue(error.message || '프로필 조회에 실패했습니다.')
    }
  }
)

// 사용자 프로필 업데이트 액션
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(profileData)
      return response
    } catch (error) {
      return rejectWithValue(error.message || '프로필 업데이트에 실패했습니다.')
    }
  }
)
