import { BlogListProps } from "@/types";
import { BlogCardSkeleton } from "@/components/ui";
import BlogCard from "./BlogCard";

const BlogList = ({ posts, loading = false, pagination }: BlogListProps) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <BlogCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
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
          <h3 className="mt-4 text-lg font-medium text-neutral-900">
            記事が見つかりません
          </h3>
          <p className="mt-2 text-neutral-500">
            検索条件を変更するか、別のカテゴリをお試しください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}

      {pagination && (
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

export default BlogList;
