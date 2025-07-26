import { Suspense } from "react";
import { searchBlogPosts } from "@/lib/data";
import { BlogList } from "@/components/blog";
import { BlogCardSkeleton } from "@/components/ui";
import SearchClient from "@/components/ui/SearchClient";

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

async function SearchResults({ query }: { query: string }) {
  if (!query.trim()) {
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-neutral-900">
            検索キーワードを入力してください
          </h3>
          <p className="mt-2 text-neutral-500">
            記事のタイトル、内容、カテゴリ、タグから検索できます。
          </p>
        </div>
      </div>
    );
  }

  const posts = await searchBlogPosts(query);

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
            検索結果が見つかりませんでした
          </h3>
          <p className="mt-2 text-neutral-500">
            「{query}」に該当する記事は見つかりませんでした。
            <br />
            別のキーワードで検索してみてください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <p className="text-neutral-600">
          「<span className="font-semibold text-neutral-900">{query}</span>
          」の検索結果: {posts.length}件
        </p>
      </div>
      <BlogList posts={posts} />
    </div>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            記事を検索
          </h1>
          <p className="text-neutral-600 mb-6">
            記事のタイトル、内容、カテゴリ、タグから検索できます。
          </p>

          <div className="max-w-2xl">
            <SearchClient
              placeholder="検索キーワードを入力..."
              initialQuery={query}
            />
          </div>
        </div>

        <Suspense
          fallback={
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <BlogCardSkeleton key={index} />
              ))}
            </div>
          }
        >
          <SearchResults query={query} />
        </Suspense>
      </div>
    </div>
  );
}
