import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * FormCard - shadcn/ui 컴포넌트를 활용한 카드
 * 기존 atoms/Card와 호환성을 유지하면서 shadcn/ui 스타일 적용
 */
const FormCard = ({
  children,
  title,
  subtitle,
  footer,
  className = "",
  bodyClassName = "",
  headerClassName = "",
  footerClassName = "",
  variant = "default", // 'default', 'outline', 'primary', 'success', 'warning', 'danger', 'info'
  ...props
}) => {
  // 변형에 따른 스타일 결정
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-50 border-blue-200 text-blue-900";
      case "success":
        return "bg-green-50 border-green-200 text-green-900";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-900";
      case "danger":
        return "bg-red-50 border-red-200 text-red-900";
      case "info":
        return "bg-indigo-50 border-indigo-200 text-indigo-900";
      case "outline":
        return "bg-white border-gray-200 shadow-sm";
      default:
        return "bg-white border-gray-200 shadow-sm";
    }
  };

  // 헤더 스타일 결정
  const getHeaderStyles = () => {
    switch (variant) {
      case "primary":
        return "border-b border-blue-200";
      case "success":
        return "border-b border-green-200";
      case "warning":
        return "border-b border-yellow-200";
      case "danger":
        return "border-b border-red-200";
      case "info":
        return "border-b border-indigo-200";
      default:
        return "border-b border-gray-100";
    }
  };

  // 푸터 스타일 결정
  const getFooterStyles = () => {
    switch (variant) {
      case "primary":
        return "border-t border-blue-200";
      case "success":
        return "border-t border-green-200";
      case "warning":
        return "border-t border-yellow-200";
      case "danger":
        return "border-t border-red-200";
      case "info":
        return "border-t border-indigo-200";
      default:
        return "border-t border-gray-100";
    }
  };

  return (
    <Card
      className={cn(
        getVariantStyles(),
        "overflow-hidden rounded-lg",
        className
      )}
      {...props}
    >
      {(title || subtitle) && (
        <CardHeader
          className={cn("px-6 py-4", getHeaderStyles(), headerClassName)}
        >
          {title && (
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          )}
          {subtitle && (
            <CardDescription className="mt-1 text-sm">
              {subtitle}
            </CardDescription>
          )}
        </CardHeader>
      )}

      <CardContent
        className={cn(
          "px-6 py-4",
          title || subtitle ? "pt-0" : "",
          bodyClassName
        )}
      >
        {children}
      </CardContent>

      {footer && (
        <CardFooter
          className={cn("px-6 py-4", getFooterStyles(), footerClassName)}
        >
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default FormCard;
