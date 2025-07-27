import { Suspense } from "react";
import { getBlogPageData } from "@/lib/cache";
import { BlogList } from "@/components/blog";
import { BlogCardSkeleton } from "@/components/ui";
import PaginationClient from "@/components/ui/PaginationClient";
import { Sidebar } from "@/components/layout";

interface HomePageProps {
  searchParams: {
    page?: string;
    category?: string;
    tag?: string;
  };
}

async function BlogPageContent({ searchParams }: HomePageProps) {
  const currentPage = parseInt(searchParams.page || "1", 10);
  const data = await getBlogPageData({
    page: currentPage,
    category: searchParams.category,
    tag: searchParams.tag,
  });

  const { posts, pagination, categories, tags, recentPosts } = data;

  return (
    <>
      <div className="lg:col-span-3">
        <BlogList posts={posts} pagination={pagination} />
        {pagination.totalPages > 1 && (
          <div className="mt-12">
            <PaginationClient
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              category={searchParams.category}
              tag={searchParams.tag}
            />
          </div>
        )}
      </div>
      <div className="lg:col-span-1">
        <Sidebar
          categories={categories}
          tags={tags}
          recentPosts={recentPosts}
          selectedCategory={searchParams.category}
          selectedTag={searchParams.tag}
        />
      </div>
    </>
  );
}

export default function HomePage({ searchParams }: HomePageProps) {
  const getPageTitle = () => {
    if (searchParams.category) {
      return `カテゴリ: ${searchParams.category}`;
    }
    if (searchParams.tag) {
      return `タグ: ${searchParams.tag}`;
    }
    return "ブログ記事一覧";
  };

  const getFilterDescription = () => {
    if (searchParams.category) {
      return `「${searchParams.category}」カテゴリの記事`;
    }
    if (searchParams.tag) {
      return `「${searchParams.tag}」タグの記事`;
    }
    return "最新のブログ記事をお届けします";
  };

  const isHomePage =
    !searchParams.category && !searchParams.tag && !searchParams.page;

  return (
    <>
      {isHomePage && (
        <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50">
          <div className="container max-w-6xl py-20">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
                美しいデザインと
                <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  質の高いコンテンツ
                </span>
              </h1>
              <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                技術記事から日常の洞察まで、読みやすさと美しさを追求したブログサイトです。
                最新のWebテクノロジーと洗練されたデザインで、価値あるコンテンツをお届けします。
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container max-w-6xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {!isHomePage && (
            <div className="lg:col-span-3 mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                {getPageTitle()}
              </h1>
              <p className="text-neutral-600">{getFilterDescription()}</p>
            </div>
          )}

          {(searchParams.category || searchParams.tag) && (
            <div className="lg:col-span-3 mb-4">
              <a
                href="/"
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 transition-colors"
              >
                ← すべての記事を表示
              </a>
            </div>
          )}

          <Suspense
            fallback={
              <div className="lg:col-span-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <BlogCardSkeleton key={index} />
                  ))}
                </div>
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                    <div className="skeleton h-6 w-24 mb-4"></div>
                    <div className="space-y-2">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="skeleton h-4 w-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            }
          >
            <BlogPageContent searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
