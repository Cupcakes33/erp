import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Path aliases fix for shadcn
import pathBrowserify from "path-browserify";
window.path = pathBrowserify;

// To handle @ import aliases
window.__dirname = "/src";
window.require = (module) => {
  if (module === "path") {
    return window.path;
  }
  return null;
};

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 3,
      staleTime: 0, // 데이터가 항상 stale 상태가 되도록 설정
      cacheTime: 1000, // 캐시 시간을 1초로 짧게 설정
      suspense: false,
      useErrorBoundary: false,
      refetchInterval: false, // 자동 리페치 비활성화
      refetchIntervalInBackground: false,
      refetchOnMount: "always", // 컴포넌트 마운트마다 항상 새로 가져오도록 설정
      onError: (err) => {
        console.error("Query Error:", err);
      },
    },
  },
});

// React 17 방식으로 렌더링
ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
