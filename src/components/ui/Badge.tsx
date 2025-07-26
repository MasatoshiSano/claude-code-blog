import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    variant = "default", 
    size = "md", 
    icon, 
    removable = false,
    onRemove,
    children, 
    className, 
    ...props 
  }, ref) => {
    const baseClasses = "inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variantClasses: Record<BadgeVariant, string> = {
      default: "bg-neutral-900 text-white hover:bg-neutral-800",
      secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      outline: "border border-neutral-200 text-neutral-900 hover:bg-neutral-50",
      success: "bg-green-500 text-white hover:bg-green-600",
      warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    };
    
    const sizeClasses: Record<BadgeSize, string> = {
      sm: "px-2 py-1 text-xs",
      md: "px-2.5 py-1.5 text-sm",
      lg: "px-3 py-2 text-base",
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
        {removable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="sr-only">Remove</span>
          </button>
        )}
      </div>
    );
  },
);

Badge.displayName = "Badge";

export { Badge, type BadgeProps };
export default Badge;