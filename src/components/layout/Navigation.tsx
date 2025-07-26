"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavigationItem {
  href: string;
  label: string;
  icon?: ReactNode;
  isActive?: boolean;
  external?: boolean;
}

interface NavigationProps {
  items: NavigationItem[];
  direction?: "horizontal" | "vertical";
  variant?: "default" | "pills" | "underline";
  size?: "sm" | "md" | "lg";
  className?: string;
  itemClassName?: string;
  onItemClick?: (item: NavigationItem) => void;
}

const Navigation = ({
  items,
  direction = "horizontal",
  variant = "default",
  size = "md",
  className,
  itemClassName,
  onItemClick,
}: NavigationProps) => {
  const baseClasses = direction === "horizontal" 
    ? "flex items-center" 
    : "flex flex-col";

  const containerClasses = {
    horizontal: "space-x-1",
    vertical: "space-y-1",
  };

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const getItemClasses = (item: NavigationItem) => {
    const baseItemClasses = "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500";
    
    const variantClasses = {
      default: item.isActive 
        ? "text-primary-600 font-medium" 
        : "text-neutral-700 hover:text-primary-600",
      pills: item.isActive
        ? "bg-primary-100 text-primary-600 px-3 py-2 rounded-full font-medium"
        : "text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 px-3 py-2 rounded-full",
      underline: item.isActive
        ? "text-primary-600 border-b-2 border-primary-600 pb-1 font-medium"
        : "text-neutral-700 hover:text-primary-600 border-b-2 border-transparent hover:border-neutral-300 pb-1",
    };

    return cn(
      baseItemClasses,
      variantClasses[variant],
      sizeClasses[size],
      itemClassName,
    );
  };

  return (
    <nav className={cn(baseClasses, containerClasses[direction], className)}>
      {items.map((item, index) => (
        <Link
          key={`${item.href}-${index}`}
          href={item.href}
          className={getItemClasses(item)}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
          onClick={() => onItemClick?.(item)}
        >
          <span className="flex items-center gap-2">
            {item.icon && <span>{item.icon}</span>}
            {item.label}
            {item.external && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            )}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export { Navigation, type NavigationProps, type NavigationItem };
export default Navigation;