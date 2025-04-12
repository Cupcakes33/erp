import React, { useState } from 'react'

const Select = ({
  id,
  name,
  label,
  options = [],
  value,
  onChange,
  placeholder = '선택하세요',
  error,
  disabled = false,
  required = false,
  className = '',
  fullWidth = true
}) => {
  const baseClasses = 'px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white'
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
  const disabledClasses = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
  const widthClass = fullWidth ? 'w-full' : ''
  
  const handleChange = (e) => {
    if (onChange) {
      onChange(e)
    }
  }
  
  return (
    <div className={`mb-4 ${widthClass}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className={`
            ${baseClasses}
            ${errorClasses}
            ${disabledClasses}
            ${className}
            ${widthClass}
          `}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default Select
