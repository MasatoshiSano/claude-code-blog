import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "outlined" | "elevated" | "ghost";
type CardPadding = "none" | "sm" | "md" | "lg" | "xl";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  hover?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  asChild?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    variant = "default", 
    padding = "md", 
    hover = false, 
    header,
    footer,
    children, 
    className, 
    ...props 
  }, ref) => {
    const baseClasses = "rounded-lg";
    
    const variantClasses: Record<CardVariant, string> = {
      default: "bg-white border border-neutral-200",
      outlined: "bg-transparent border border-neutral-200",
      elevated: "bg-white shadow-md border-0",
      ghost: "bg-transparent border-0",
    };
    
    const paddingClasses: Record<CardPadding, string> = {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
      xl: "p-8",
    };

    const hoverClasses = hover ? "transition-shadow hover:shadow-lg" : "";

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          hoverClasses,
          className,
        )}
        {...props}
      >
        {header && (
          <div className={cn("border-b border-neutral-200 pb-3 mb-3", paddingClasses[padding], "!pb-3 !mb-3")}>
            {header}
          </div>
        )}
        <div className={cn(paddingClasses[padding])}>
          {children}
        </div>
        {footer && (
          <div className={cn("border-t border-neutral-200 pt-3 mt-3", paddingClasses[padding], "!pt-3 !mt-3")}>
            {footer}
          </div>
        )}
      </div>
    );
  },
);

Card.displayName = "Card";

export { Card, type CardProps };
export default Card;
