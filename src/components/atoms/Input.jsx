import React from "react";

const Input = ({
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
}) => {
  const baseClasses =
    "px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const errorClasses = error
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300";
  const disabledClasses = disabled
    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
    : "";
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <div className={`mb-4 ${widthClass}`}>
      {label && (
        <label
          htmlFor={id}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          ${baseClasses}
          ${errorClasses}
          ${disabledClasses}
          ${className}
        `}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
