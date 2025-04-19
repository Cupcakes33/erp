import React, { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  ClipboardList,
  Calendar,
  Users,
  User,
  Banknote,
  ChevronDown,
  LogOut,
} from "lucide-react"
import { useAuthStore } from "@/lib/zustand"

const Sidebar = () => {
  const { logout } = useAuthStore((state) => ({
    logout: state.logout,
  }))
  const location = useLocation()

  // 메뉴 아이템 데이터
  const menuItems = [
    // { title: "대시보드", path: "/", icon: Home },
    {
      title: "지시 관리",
      path: "/instructions",
      icon: ClipboardList,
      subItems: [
        { title: "지시 목록", path: "/instructions" },
        { title: "지시 생성", path: "/instructions/create" },
        // { title: "지시 가져오기", path: "/instructions/import" },
        // { title: "지시 내보내기", path: "/instructions/export" },
      ],
    },
    {
      title: "작업 관리",
      path: "/works",
      icon: Calendar,
      subItems: [
        { title: "작업 목록", path: "/works" },
        { title: "작업 생성", path: "/works/create" },
        // { title: "작업 가져오기", path: "/works/import" },
        // { title: "작업 내보내기", path: "/works/export" },
      ],
    },
    {
      title: "인사 관리",
      path: "/personnel",
      icon: Users,
      subItems: [
        { title: "작업자 목록", path: "/personnel" },
      ],
    },
    {
      title: "기성 관리",
      path: "/payments",
      icon: Banknote,
      subItems: [
        { title: "공종별 조회", path: "/payments/by-type" },
        { title: "주소별 조회", path: "/payments/by-address" },
        { title: "기성별 조회", path: "/payments/by-payment" },
      ],
    },
    { title: "프로필", path: "/profile", icon: User },
  ]

  // 서브메뉴 토글 상태 관리
  const [openSubMenus, setOpenSubMenus] = useState({})

  const toggleSubMenu = (title) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  // 로그아웃 핸들러
  const handleLogout = () => {
    logout()
  }

  // 경로가 정확히 일치하는지 확인하는 함수
  const isExactPath = (path) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname === path
  }

  // 하위 경로를 포함하는지 확인하는 함수
  const isSubPath = (path) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return (
      location.pathname.startsWith(path + "/") || location.pathname === path
    )
  }

  return (
    <div className="fixed flex flex-col w-64 h-screen text-white bg-gray-800">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">보수작업관리시스템</h1>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              {item.subItems ? (
                <div>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white",
                      isSubPath(item.path) && "bg-gray-700 text-white",
                      openSubMenus[item.title] && "bg-gray-700 text-white",
                    )}
                    onClick={() => toggleSubMenu(item.title)}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        openSubMenus[item.title] && "transform rotate-180",
                      )}
                    />
                  </Button>

                  {openSubMenus[item.title] && (
                    <ul className="pl-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.title}>
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) =>
                              cn(
                                "block px-4 py-2 text-sm rounded transition-colors",
                                isActive
                                  ? "bg-blue-700 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              )
                            }
                            end
                          >
                            {subItem.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-4 py-2 rounded transition-colors",
                      isActive
                        ? "bg-blue-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    )
                  }
                  end
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.title}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          className="flex items-center justify-start w-full px-4 py-2 text-gray-300 rounded hover:bg-gray-700 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>로그아웃</span>
        </Button>
      </div>
    </div>
  )
}

export default Sidebar
