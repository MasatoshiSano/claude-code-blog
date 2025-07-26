import Link from "next/link";
import { Card, CategoryBadge, TagList } from "@/components/ui";
import { RecentPosts } from "@/components/blog";
import { BlogPost, Category, Tag } from "@/types";

interface BlogSidebarProps {
  categories: Category[];
  tags: Tag[];
  recentPosts: BlogPost[];
  currentPostId?: string;
}

export function BlogSidebar({
  categories,
  tags,
  recentPosts,
  currentPostId,
}: BlogSidebarProps) {

  return (
    <aside className="space-y-8">
      {/* カテゴリ一覧 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">
          カテゴリ
        </h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/?category=${category.slug}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 transition-colors group"
              >
                <CategoryBadge
                  category={category}
                  variant="dot"
                  size="md"
                  showLink={false}
                  className="group-hover:text-neutral-900"
                />
                <span className="text-xs text-neutral-400 group-hover:text-neutral-600">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      {/* タグクラウド */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">
          タグ
        </h3>
        <TagList
          tags={tags.slice(0, 15)}
          variant="secondary"
          size="sm"
          showLink={true}
          layout="wrapped"
          className=""
        />
      </Card>

      {/* 最新記事 */}
      <RecentPosts
        posts={recentPosts}
        title="最新記事"
        maxPosts={5}
        currentPostId={currentPostId}
        showAllLink={true}
        allLinkHref="/"
        variant="sidebar"
      />

      {/* 検索 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">
          検索
        </h3>
        <Link
          href="/search"
          className="block w-full p-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-neutral-600 hover:text-neutral-700 transition-colors text-center"
        >
          記事を検索する
        </Link>
      </Card>
    </aside>
  );
}