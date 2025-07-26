import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { CardProps } from "@/types";

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, hover = false, padding = "md" }, ref) => {
    const paddingClasses = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "card",
          paddingClasses[padding],
          hover && "hover:shadow-lg",
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export default Card;
