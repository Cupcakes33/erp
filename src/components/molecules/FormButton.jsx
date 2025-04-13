import React from "react";
import { Button } from "@/components/ui/button";

/**
 * FormButton - shadcn/ui 컴포넌트를 활용한 버튼
 * 기존 atoms/Button과 호환성을 유지하면서 shadcn/ui 스타일 적용
 */
const FormButton = ({
  children,
  variant = "primary", // 기존 atoms에서 사용하던 variant 이름 유지
  size = "md",
  type = "button",
  disabled = false,
  fullWidth = false,
  onClick,
  className = "",
  ...props
}) => {
  // 기존 variant를 shadcn/ui 스타일로 매핑
  const variantMap = {
    primary: "default", // blue-600 (shadcn default)
    secondary: "secondary", // gray-600
    success: "success", // green-600
    warning: "warning", // yellow-600
    danger: "destructive", // red-600
    outline: "outline", // border + transparent
    ghost: "ghost", // transparent
  };

  // 기존 size를 shadcn/ui 스타일로 매핑
  const sizeMap = {
    sm: "sm",
    md: "default",
    lg: "lg",
  };

  return (
    <Button
      type={type}
      variant={variantMap[variant] || "default"}
      size={sizeMap[size] || "default"}
      disabled={disabled}
      onClick={onClick}
      className={`${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default FormButton;
