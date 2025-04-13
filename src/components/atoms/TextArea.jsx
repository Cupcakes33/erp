import React from "react";

const TextArea = ({
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

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`mb-4 ${widthClass}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        required={required}
        className={`
          ${baseClasses}
          ${errorClasses}
          ${disabledClasses}
          ${className}
          ${widthClass}
        `}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default TextArea;
