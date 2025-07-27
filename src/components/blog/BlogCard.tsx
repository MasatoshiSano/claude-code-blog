import { ReactNode, memo, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, Badge, CategoryBadge, TagList } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { BlogPost } from "@/types";

type BlogCardVariant = "default" | "featured" | "compact" | "minimal";
type BlogCardSize = "sm" | "md" | "lg";
type BlogCardLayout = "vertical" | "horizontal";

interface BlogCardProps {
  post: BlogPost;
  variant?: BlogCardVariant;
  size?: BlogCardSize;
  layout?: BlogCardLayout;
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showTags?: boolean;
  showCategory?: boolean;
  showImage?: boolean;
  maxTags?: number;
  linkProps?: {
    href?: string;
    onClick?: () => void;
  };
  imageHeight?: string;
  className?: string;
  actions?: ReactNode;
}

const BlogCard = memo(({ 
  post,
  variant = "default",
  size = "md",
  layout = "vertical",
  showExcerpt = true,
  showAuthor = true,
  showDate = true,
  showTags = true,
  showCategory = true,
  showImage = true,
  maxTags = 3,
  linkProps,
  imageHeight = "h-48",
  className = "",
  actions,
}: BlogCardProps) => {
  const href = useMemo(() => linkProps?.href || `/blog/${post.slug}`, [linkProps?.href, post.slug]);
  
  const sizeClasses = useMemo(() => ({
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  }), []);

  const titleSizes = useMemo(() => ({
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  }), []);

  const cardClasses = useMemo(() => {
    const baseClasses = "overflow-hidden group transition-all duration-300";
    
    const variantClasses = {
      default: "hover:shadow-xl hover:-translate-y-1",
      featured: "border-2 border-primary-200 hover:border-primary-300 hover:shadow-2xl hover:-translate-y-2",
      compact: "hover:shadow-md hover:-translate-y-0.5",
      minimal: "hover:bg-neutral-50",
    };

    return `${baseClasses} ${variantClasses[variant]} ${className}`;
  }, [variant, className]);

  const renderImage = () => {
    if (!showImage || !post.featuredImage) return null;

    return (
      <div className={`relative ${imageHeight} overflow-hidden ${layout === 'horizontal' ? 'w-1/3' : 'w-full'}`}>
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {showCategory && (
          <div className="absolute top-3 right-3">
            <CategoryBadge
              category={post.category}
              variant="badge"
              size="sm"
              showLink={false}
              className="bg-white/90 backdrop-blur-sm text-primary-700"
            />
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => (
    <div className={`${sizeClasses[size]} ${layout === 'horizontal' ? 'flex-1' : ''}`}>
      <div className="space-y-3">
        {(showDate || showAuthor) && (
          <div className="flex items-center text-sm text-neutral-500">
            {showDate && <span>{formatDate(post.publishedAt)}</span>}
            {showDate && showAuthor && <span className="mx-2">•</span>}
            {showAuthor && <span>{post.author.name}</span>}
          </div>
        )}

        <h2 className={`font-bold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight ${titleSizes[size]}`}>
          {post.title}
        </h2>
      </div>

      {showExcerpt && variant !== "compact" && (
        <p className="text-neutral-600 line-clamp-3 leading-relaxed mt-3">
          {post.excerpt}
        </p>
      )}

      {showTags && post.tags.length > 0 && (
        <div className="mt-4">
          <TagList
            tags={post.tags}
            variant="outline"
            size="sm"
            maxTags={maxTags}
            showLink={false}
            layout="wrapped"
          />
        </div>
      )}

      {actions && (
        <div className="mt-4 pt-4 border-t border-neutral-100">
          {actions}
        </div>
      )}
    </div>
  );

  const content = (
    <article className={layout === 'horizontal' ? 'flex' : ''}>
      {renderImage()}
      {renderContent()}
    </article>
  );

  if (linkProps?.onClick || !href) {
    return (
      <Card 
        className={cardClasses}
        hover={variant !== "minimal"}
        onClick={linkProps?.onClick}
      >
        {content}
      </Card>
    );
  }

  return (
    <Card className={cardClasses} hover={variant !== "minimal"}>
      <Link href={href} className="block">
        {content}
      </Link>
    </Card>
  );
});

BlogCard.displayName = 'BlogCard';

export { BlogCard, type BlogCardProps };
export default BlogCard;
