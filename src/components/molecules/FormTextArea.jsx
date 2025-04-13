import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * FormTextArea - 텍스트 영역 컴포넌트
 * 기존 atoms/TextArea와 호환성을 유지
 * 현재 shadcn에는 TextArea 컴포넌트가 없어 직접 구현
 */
const FormTextArea = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = "",
  rows = 4,
  error,
  disabled = false,
  required = false,
  className = "",
  fullWidth = true,
  maxLength,
  ...props
}) => {
  return (
    <div className={`mb-4 ${fullWidth ? "w-full" : ""}`}>
      {label && (
        <Label htmlFor={id} className="mb-1 block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          "flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...props}
      />

      {maxLength && value && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          {value.length} / {maxLength}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormTextArea;
