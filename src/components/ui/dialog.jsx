import * as React from "react";
import { cn } from "@/lib/utils";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  className,
  ...props
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-25"
        onClick={onClose}
      ></div>
      <div
        className={cn(
          "bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-10",
          className
        )}
        {...props}
      >
        {title && (
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        )}
        {message && <p className="text-sm text-gray-600 mb-6">{message}</p>}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export { ConfirmDialog };
