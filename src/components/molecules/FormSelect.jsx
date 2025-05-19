import React from "react";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * FormSelect - 셀렉트 컴포넌트
 * 기존 atoms/Select와 호환성을 유지
 * 현재 shadcn에는 Select 컴포넌트가 없어 직접 구현
 */
const FormSelect = ({
  id,
  name,
  label,
  options = [],
  value,
  onChange,
  placeholder = "전체",
  error,
  disabled = false,
  required = false,
  className = "",
  fullWidth = true,
  ...props
}) => {
  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      {label && (
        <Label htmlFor={id} className="block mb-1">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </Label>
      )}

      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-10",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled={required}>
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormSelect;
