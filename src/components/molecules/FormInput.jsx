import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * FormInput - shadcn/ui 컴포넌트를 활용한 폼 입력 필드
 * 기존 atoms/Input과 호환성을 유지하면서 shadcn/ui 스타일 적용
 */
const FormInput = ({
  id,
  name,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = "",
  fullWidth = true,
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

      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={className}
        {...props}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormInput;
