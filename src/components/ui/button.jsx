import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
        outline:
          "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700",
        secondary:
          "bg-gray-600 text-white hover:bg-gray-700 focus-visible:ring-gray-600",
        ghost: "hover:bg-gray-100 hover:text-slate-900",
        link: "text-blue-600 underline-offset-4 hover:underline",
        success:
          "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600",
        warning:
          "bg-yellow-600 text-white hover:bg-yellow-700 focus-visible:ring-yellow-600",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 py-1.5 text-sm",
        lg: "h-11 px-5 py-2.5 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
