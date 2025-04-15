import * as React from "react";
import { cn } from "@/lib/utils";

const DetailSection = React.forwardRef(
  ({ children, title, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("mb-6 last:mb-0", className)} {...props}>
        {title && (
          <h3 className="text-lg font-medium text-gray-900 mb-3">{title}</h3>
        )}
        {children}
      </div>
    );
  }
);
DetailSection.displayName = "DetailSection";

const DetailItem = React.forwardRef(
  (
    { label, children, className, labelClassName, valueClassName, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "py-3 flex border-b border-gray-200 last:border-b-0",
          className
        )}
        {...props}
      >
        <dt
          className={cn(
            "w-1/3 text-sm font-medium text-gray-500",
            labelClassName
          )}
        >
          {label}
        </dt>
        <dd className={cn("w-2/3 text-sm text-gray-900", valueClassName)}>
          {children}
        </dd>
      </div>
    );
  }
);
DetailItem.displayName = "DetailItem";

export { DetailSection, DetailItem };
