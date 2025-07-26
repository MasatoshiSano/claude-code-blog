import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    variant = "rectangular", 
    width, 
    height, 
    lines = 1,
    className, 
    style,
    ...props 
  }, ref) => {
    const baseClasses = "animate-pulse bg-neutral-200 rounded";
    
    const variantClasses = {
      text: "h-4 w-full rounded",
      circular: "rounded-full",
      rectangular: "rounded",
    };

    const getSize = () => {
      if (variant === "text") {
        return { height: "1rem" };
      }
      
      const sizeStyle: React.CSSProperties = {};
      if (width) sizeStyle.width = typeof width === "number" ? `${width}px` : width;
      if (height) sizeStyle.height = typeof height === "number" ? `${height}px` : height;
      
      return sizeStyle;
    };

    if (variant === "text" && lines > 1) {
      return (
        <div className={cn("space-y-2", className)} ref={ref} {...props}>
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={cn(baseClasses, variantClasses.text)}
              style={{
                ...getSize(),
                ...style,
                width: index === lines - 1 ? "75%" : "100%", // Last line is shorter
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        style={{ ...getSize(), ...style }}
        {...props}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";

// Common skeleton patterns
const SkeletonText = ({ lines = 3, className, ...props }: Omit<SkeletonProps, "variant"> & { lines?: number }) => (
  <Skeleton variant="text" lines={lines} className={className} {...props} />
);

const SkeletonAvatar = ({ size = 40, className, ...props }: Omit<SkeletonProps, "variant"> & { size?: number }) => (
  <Skeleton 
    variant="circular" 
    width={size} 
    height={size} 
    className={className} 
    {...props} 
  />
);

const SkeletonCard = ({ className, ...props }: Omit<SkeletonProps, "variant">) => (
  <div className={cn("space-y-3", className)}>
    <Skeleton variant="rectangular" height={200} {...props} />
    <SkeletonText lines={2} />
    <div className="flex items-center space-x-2">
      <SkeletonAvatar size={32} />
      <SkeletonText lines={1} />
    </div>
  </div>
);

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, type SkeletonProps };
export default Skeleton;