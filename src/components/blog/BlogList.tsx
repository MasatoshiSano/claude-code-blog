import { ReactNode } from "react";
import { SkeletonCard } from "@/components/ui";
import { BlogPost } from "@/types";
import BlogCard, { BlogCardProps } from "./BlogCard";

type BlogListLayout = "grid" | "list" | "masonry";
type BlogListVariant = "default" | "featured" | "compact";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface BlogListProps {
  posts: BlogPost[];
  loading?: boolean;
  layout?: BlogListLayout;
  variant?: BlogListVariant;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: "sm" | "md" | "lg";
  pagination?: PaginationInfo;
  emptyState?: {
    title?: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
  };
  loadingCount?: number;
  cardProps?: Partial<BlogCardProps>;
  className?: string;
  showPaginationInfo?: boolean;
}

const BlogList = ({ 
  posts,
  loading = false,
  layout = "list",
  variant = "default",
  columns = { sm: 1, md: 2, lg: 3 },
  gap = "md",
  pagination,
  emptyState,
  loadingCount = 6,
  cardProps = {},
  className = "",
  showPaginationInfo = true,
}: BlogListProps) => {
  const getLayoutClasses = () => {
    const gapClasses = {
      sm: "gap-4",
      md: "gap-6",
      lg: "gap-8",
    };

    const columnClasses = {
      sm: columns.sm ? `grid-cols-${columns.sm}` : "grid-cols-1",
      md: columns.md ? `md:grid-cols-${columns.md}` : "md:grid-cols-2", 
      lg: columns.lg ? `lg:grid-cols-${columns.lg}` : "lg:grid-cols-3",
      xl: columns.xl ? `xl:grid-cols-${columns.xl}` : "",
    };

    switch (layout) {
      case "grid":
        return `grid ${columnClasses.sm} ${columnClasses.md} ${columnClasses.lg} ${columnClasses.xl} ${gapClasses[gap]}`;
      case "masonry":
        return `columns-1 ${columnClasses.md.replace('grid-cols', 'columns')} ${columnClasses.lg.replace('grid-cols', 'columns')} ${gapClasses[gap]}`;
      case "list":
      default:
        return `space-y-${gap === 'sm' ? '4' : gap === 'md' ? '6' : '8'}`;
    }
  };

  const getCardVariant = () => {
    if (cardProps.variant) return cardProps.variant;
    
    switch (variant) {
      case "featured":
        return "featured";
      case "compact":
        return "compact";
      default:
        return "default";
    }
  };

  const defaultEmptyState = {
    title: "記事が見つかりません",
    description: "検索条件を変更するか、別のカテゴリをお試しください。",
    icon: (
      <svg
        className="mx-auto h-12 w-12 text-neutral-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  };

  if (loading) {
    return (
      <div className={`${getLayoutClasses()} ${className}`}>
        {Array.from({ length: loadingCount }).map((_, index) => (
          <div key={index} className={layout === "masonry" ? "break-inside-avoid mb-6" : ""}>
            <SkeletonCard />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    const emptyStateConfig = { ...defaultEmptyState, ...emptyState };
    
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          {emptyStateConfig.icon}
          <h3 className="mt-4 text-lg font-medium text-neutral-900">
            {emptyStateConfig.title}
          </h3>
          <p className="mt-2 text-neutral-500">
            {emptyStateConfig.description}
          </p>
          {emptyStateConfig.action && (
            <div className="mt-6">
              {emptyStateConfig.action}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={getLayoutClasses()}>
        {posts.map((post) => (
          <div 
            key={post.id} 
            className={layout === "masonry" ? "break-inside-avoid mb-6" : ""}
          >
            <BlogCard 
              post={post} 
              variant={getCardVariant()}
              layout={layout === "list" ? "horizontal" : "vertical"}
              {...cardProps}
            />
          </div>
        ))}
      </div>

      {pagination && showPaginationInfo && (
        <div className="text-center text-sm text-neutral-600 mt-8">
          全 {pagination.totalItems} 件中{" "}
          {Math.min(
            (pagination.currentPage - 1) * pagination.itemsPerPage + 1,
            pagination.totalItems,
          )}{" "}
          -{" "}
          {Math.min(
            pagination.currentPage * pagination.itemsPerPage,
            pagination.totalItems,
          )}{" "}
          件を表示
        </div>
      )}
    </div>
  );
};

export { BlogList, type BlogListProps };
export default BlogList;
