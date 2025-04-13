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
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 300000, // 5분
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
