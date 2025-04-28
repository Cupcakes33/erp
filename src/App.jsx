import React, { useEffect } from "react"
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "./lib/zustand"

// 레이아웃
import Layout from "./components/layout/Layout"

// 페이지
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import NotFound from "./pages/NotFound"

// 지시 관련 페이지
import InstructionList from "./pages/instruction/InstructionList"
import InstructionDetail from "./pages/instruction/InstructionDetail"
import InstructionCreate from "./pages/instruction/InstructionCreate"
import InstructionEdit from "./pages/instruction/InstructionEdit"
import InstructionImport from "./pages/instruction/InstructionImport"
import InstructionExport from "./pages/instruction/InstructionExport"

// 일위대가 관련 페이지
import WorkList from "./pages/work/WorkList"
import WorkCreate from "./pages/work/WorkCreate"

// 인사 관련 페이지
import PersonnelList from "./pages/personnel/PersonnelList"
import Payments from "./pages/payments/Payments"

// 인증 상태 확인 컴포넌트
const PrivateRoute = ({ children }) => {
  // Zustand 스토어에서 인증 상태 확인
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const token = localStorage.getItem("token")

  return isAuthenticated || token ? children : <Navigate to="/login" />
}

const App = () => {
  const { checkAuth } = useAuthStore((state) => ({
    checkAuth: state.checkAuth,
  }))

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* /로 접근 시 /instructions로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/instructions" replace />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          {/* <Route index element={<Dashboard />} /> */}
          <Route path="profile" element={<Profile />} />

          {/* 지시 관련 라우트 */}
          <Route path="instructions" element={<InstructionList />} />
          <Route path="instructions/:id" element={<InstructionDetail />} />
          <Route path="instructions/create" element={<InstructionCreate />} />
          <Route path="instructions/:id/edit" element={<InstructionEdit />} />
          <Route path="instructions/import" element={<InstructionImport />} />
          <Route path="instructions/export" element={<InstructionExport />} />

          {/* 일위대가 관련 라우트 */}
          <Route path="works" element={<WorkList />} />
          <Route path="works/create" element={<WorkCreate />} />

          {/* 인사 관련 라우트 */}
          <Route path="personnel" element={<PersonnelList />} />

          {/* 기성 관련 라우트 */}
          <Route path="payments" element={<Payments />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
