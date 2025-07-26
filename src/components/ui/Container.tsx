import { forwardRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  size?: ContainerSize;
  center?: boolean;
  padding?: boolean;
  children: ReactNode;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ 
    as: Component = "div",
    size = "lg", 
    center = false,
    padding = true,
    children, 
    className, 
    ...props 
  }, ref) => {
    const sizeClasses: Record<ContainerSize, string> = {
      sm: "max-w-sm",
      md: "max-w-md", 
      lg: "max-w-4xl",
      xl: "max-w-6xl",
      "2xl": "max-w-7xl",
      full: "max-w-full",
    };

    const centerClass = center ? "mx-auto" : "";
    const paddingClass = padding ? "px-4 sm:px-6 lg:px-8" : "";

    return (
      <Component
        ref={ref}
        className={cn(
          "w-full",
          sizeClasses[size],
          centerClass,
          paddingClass,
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Container.displayName = "Container";

export { Container, type ContainerProps };
export default Container;