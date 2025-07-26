import Link from "next/link";
import { Card } from "@/components/ui";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";

interface RecentPostsProps {
  posts: BlogPost[];
  title?: string;
  maxPosts?: number;
  currentPostId?: string;
  showAllLink?: boolean;
  allLinkHref?: string;
  variant?: "sidebar" | "card" | "minimal";
  className?: string;
}

export function RecentPosts({
  posts,
  title = "最新記事",
  maxPosts = 5,
  currentPostId,
  showAllLink = true,
  allLinkHref = "/",
  variant = "sidebar",
  className = "",
}: RecentPostsProps) {
  // 現在の記事を除外
  const filteredPosts = posts.filter(post => post.id !== currentPostId);
  const displayPosts = filteredPosts.slice(0, maxPosts);

  const renderPost = (post: BlogPost) => (
    <article key={post.id} className="group">
      <Link href={`/blog/${post.slug}`} className="block space-y-2">
        <div className="flex items-center text-xs text-neutral-500">
          <time dateTime={post.publishedAt.toISOString()}>
            {formatDate(post.publishedAt)}
          </time>
          <span className="mx-2">•</span>
          <CategoryBadge
            category={post.category}
            variant="pill"
            size="sm"
            showLink={false}
          />
        </div>
        <h4 className="text-sm font-medium text-neutral-700 group-hover:text-primary-600 transition-colors line-clamp-2 leading-relaxed">
          {post.title}
        </h4>
        {variant !== "minimal" && variant !== "card" && (
          <p className="text-xs text-neutral-500 line-clamp-2">
            {post.excerpt}
          </p>
        )}
      </Link>
    </article>
  );

  const renderAllLink = () => {
    if (!showAllLink) return null;
    
    return (
      <div className="mt-4 pt-4 border-t border-neutral-200">
        <Link
          href={allLinkHref}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
        >
          すべての記事を見る
          <span className="ml-1">→</span>
        </Link>
      </div>
    );
  };

  if (variant === "minimal") {
    return (
      <div className={`space-y-4 ${className}`}>
        {title && (
          <h3 className="text-lg font-semibold text-neutral-900">
            {title}
          </h3>
        )}
        <div className="space-y-3">
          {displayPosts.map(renderPost)}
        </div>
        {renderAllLink()}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 md:p-12 ${className}`}>
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">📚</span>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900">{title}</h3>
        </div>
        <div className="space-y-6">
          {displayPosts.map(renderPost)}
        </div>
        {renderAllLink()}
      </div>
    );
  }

  // sidebar variant (default)
  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">
        {title}
      </h3>
      <div className="space-y-4">
        {displayPosts.map(renderPost)}
      </div>
      {renderAllLink()}
    </Card>
  );
}