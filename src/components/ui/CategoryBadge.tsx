import Link from "next/link";
import { Badge } from "@/components/ui";

interface CategoryBadgeProps {
  category: {
    id: string;
    name: string;
    color?: string;
    slug: string;
  };
  variant?: "pill" | "badge" | "dot";
  size?: "sm" | "md" | "lg";
  showLink?: boolean;
  className?: string;
}

export function CategoryBadge({
  category,
  variant = "badge",
  size = "md",
  showLink = true,
  className = "",
}: CategoryBadgeProps) {
  const baseClasses = "inline-flex items-center font-medium transition-all duration-200";
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  const renderContent = () => {
    switch (variant) {
      case "pill":
        return (
          <span
            className={`${baseClasses} ${sizeClasses[size]} rounded-full text-white shadow-sm hover:shadow-md ${className}`}
            style={{ backgroundColor: category.color || '#6b7280' }}
          >
            {category.name}
          </span>
        );
      
      case "dot":
        return (
          <span className={`${baseClasses} space-x-2 ${className}`}>
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category.color || '#6b7280' }}
            />
            <span className="text-neutral-700">{category.name}</span>
          </span>
        );
      
      case "badge":
      default:
        return (
          <Badge
            variant="secondary"
            size={size}
            className={`bg-white/90 backdrop-blur-sm text-primary-700 ${className}`}
          >
            {category.name}
          </Badge>
        );
    }
  };

  if (!showLink) {
    return renderContent();
  }

  return (
    <Link
      href={`/?category=${category.slug}`}
      className="hover:opacity-80 transition-opacity"
    >
      {renderContent()}
    </Link>
  );
}