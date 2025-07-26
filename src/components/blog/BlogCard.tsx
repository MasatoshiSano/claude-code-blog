import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui";
import { BlogCardProps } from "@/types";
import { formatDate } from "@/lib/utils";

const BlogCard = ({ post, showExcerpt = true, size = "md" }: BlogCardProps) => {
  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <Card
      className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      hover
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <article>
          {post.featuredImage && (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-700 rounded-full text-sm font-medium">
                  {post.category.name}
                </span>
              </div>
            </div>
          )}

          <div className={sizeClasses[size]}>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-neutral-500">
                <span>{formatDate(post.publishedAt)}</span>
                <span className="mx-2">•</span>
                <span>{post.author.name}</span>
              </div>

              <h2 className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
                {post.title}
              </h2>
            </div>

            {showExcerpt && (
              <p className="text-neutral-600 line-clamp-3 leading-relaxed mt-3">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs hover:bg-primary-50 hover:text-primary-700 transition-colors"
                >
                  {tag.name}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </article>
      </Link>
    </Card>
  );
};

export default BlogCard;
