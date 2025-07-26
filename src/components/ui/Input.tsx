import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type InputSize = "sm" | "md" | "lg";
type InputVariant = "default" | "ghost" | "filled";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
  size?: InputSize;
  variant?: InputVariant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    description,
    error, 
    size = "md",
    variant = "default",
    leftIcon,
    rightIcon,
    containerClassName,
    className, 
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
    
    const baseClasses = "flex w-full rounded-md border transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
    
    const variantClasses: Record<InputVariant, string> = {
      default: "border-neutral-200 bg-white focus-visible:ring-neutral-950",
      ghost: "border-transparent bg-transparent focus-visible:ring-neutral-950",
      filled: "border-transparent bg-neutral-100 focus-visible:ring-neutral-950",
    };
    
    const sizeClasses: Record<InputSize, string> = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-3 py-2",
      lg: "h-12 px-4 text-lg",
    };

    const errorClasses = error ? "border-red-300 focus-visible:ring-red-500" : "";
    const iconPadding = leftIcon ? "pl-10" : rightIcon ? "pr-10" : "";

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label 
            htmlFor={inputId}
            className="text-sm font-medium text-neutral-900"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {description && (
          <p className="text-sm text-neutral-600">{description}</p>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              baseClasses,
              variantClasses[variant],
              sizeClasses[size],
              errorClasses,
              iconPadding,
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, type InputProps };
export default Input;
