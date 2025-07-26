import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type TextareaSize = "sm" | "md" | "lg";
type TextareaVariant = "default" | "ghost" | "filled";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
  size?: TextareaSize;
  variant?: TextareaVariant;
  resize?: "none" | "vertical" | "horizontal" | "both";
  containerClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    label, 
    description,
    error, 
    size = "md",
    variant = "default",
    resize = "vertical",
    containerClassName,
    className, 
    id,
    ...props 
  }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;
    
    const baseClasses = "flex w-full rounded-md border px-3 py-2 text-sm transition-colors placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
    
    const variantClasses: Record<TextareaVariant, string> = {
      default: "border-neutral-200 bg-white focus-visible:ring-neutral-950",
      ghost: "border-transparent bg-transparent focus-visible:ring-neutral-950",
      filled: "border-transparent bg-neutral-100 focus-visible:ring-neutral-950",
    };
    
    const sizeClasses: Record<TextareaSize, string> = {
      sm: "min-h-[60px] text-sm",
      md: "min-h-[80px]",
      lg: "min-h-[120px] text-lg",
    };

    const resizeClasses = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x", 
      both: "resize",
    };

    const errorClasses = error ? "border-red-300 focus-visible:ring-red-500" : "";

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label 
            htmlFor={textareaId}
            className="text-sm font-medium text-neutral-900"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {description && (
          <p className="text-sm text-neutral-600">{description}</p>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            resizeClasses[resize],
            errorClasses,
            className,
          )}
          {...props}
        />
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

Textarea.displayName = "Textarea";

export { Textarea, type TextareaProps };
export default Textarea;
