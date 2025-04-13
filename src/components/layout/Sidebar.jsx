import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { title: "대시보드", path: "/", icon: "home" },
    {
      title: "지시 관리",
      path: "/instructions",
      icon: "clipboard-list",
      subItems: [
        { title: "지시 목록", path: "/instructions" },
        { title: "지시 생성", path: "/instructions/create" },
        { title: "지시 가져오기", path: "/instructions/import" },
        { title: "지시 내보내기", path: "/instructions/export" },
      ],
    },
    {
      title: "작업 관리",
      path: "/works",
      icon: "tools",
      subItems: [
        { title: "작업 목록", path: "/works" },
        { title: "작업 생성", path: "/works/create" },
        { title: "작업 가져오기", path: "/works/import" },
        { title: "작업 내보내기", path: "/works/export" },
      ],
    },
    {
      title: "인사 관리",
      path: "/personnel",
      icon: "users",
      subItems: [
        { title: "작업자 목록", path: "/personnel" },
        { title: "작업자 추가", path: "/personnel/create" },
      ],
    },
    { title: "프로필", path: "/profile", icon: "user" },
  ];

  // 아이콘 렌더링 함수
  const renderIcon = (iconName) => {
    switch (iconName) {
      case "home":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        );
      case "clipboard-list":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "tools":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "users":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        );
      case "cash":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "user":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  // 서브메뉴 토글 상태 관리
  const [openSubMenus, setOpenSubMenus] = React.useState({});

  const toggleSubMenu = (title) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="flex flex-col w-64 min-h-screen text-white bg-gray-800">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">보수작업관리시스템</h1>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              {item.subItems ? (
                <div>
                  <button
                    className="flex items-center w-full px-4 py-2 text-left transition-colors hover:bg-gray-700"
                    onClick={() => toggleSubMenu(item.title)}
                  >
                    <span className="mr-3">{renderIcon(item.icon)}</span>
                    <span>{item.title}</span>
                    <span className="ml-auto">
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          openSubMenus[item.title] ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </span>
                  </button>

                  {openSubMenus[item.title] && (
                    <ul className="pl-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.title}>
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) =>
                              `block px-4 py-2 text-sm ${
                                isActive
                                  ? "bg-gray-700 text-white"
                                  : "text-gray-300 hover:bg-gray-700"
                              }`
                            }
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
                    `flex items-center px-4 py-2 ${
                      isActive
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`
                  }
                >
                  <span className="mr-3">{renderIcon(item.icon)}</span>
                  <span>{item.title}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          className="flex items-center w-full px-4 py-2 text-gray-300 rounded hover:bg-gray-700"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 2a1 1 0 00-1 1v1H5a1 1 0 000 2h4v1a1 1 0 002 0V9h4a1 1 0 000-2h-4V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
