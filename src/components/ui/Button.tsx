import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = "primary", 
    size = "md", 
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children, 
    className, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variantClasses: Record<ButtonVariant, string> = {
      primary: "bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-950",
      secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-950",
      outline: "border border-neutral-200 bg-white hover:bg-neutral-50 hover:text-neutral-900 focus-visible:ring-neutral-950",
      ghost: "hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-neutral-950",
      destructive: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
    };
    
    const sizeClasses: Record<ButtonSize, string> = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 py-2",
      lg: "h-11 px-6 text-lg",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          widthClass,
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {leftIcon && !isLoading && (
          <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, type ButtonProps };
export default Button;
