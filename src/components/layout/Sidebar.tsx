import Link from "next/link";
import { Card } from "@/components/ui";
import { Category, Tag, BlogPost } from "@/types";

interface SidebarProps {
  categories: Category[];
  tags: Tag[];
  recentPosts: BlogPost[];
  selectedCategory?: string;
  selectedTag?: string;
}

const Sidebar = ({
  categories,
  tags,
  recentPosts,
  selectedCategory,
  selectedTag,
}: SidebarProps) => {
  return (
    <aside className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          カテゴリ
        </h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className={`block text-sm hover:text-primary-600 transition-colors ${
                !selectedCategory
                  ? "text-primary-600 font-medium"
                  : "text-neutral-600"
              }`}
            >
              すべて
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/?category=${category.slug}`}
                className={`block text-sm hover:text-primary-600 transition-colors ${
                  selectedCategory === category.slug
                    ? "text-primary-600 font-medium"
                    : "text-neutral-600"
                }`}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">タグ</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/?tag=${tag.slug}`}
              className={`inline-block px-3 py-1 text-xs rounded-full border transition-colors ${
                selectedTag === tag.slug
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200"
              }`}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          最新記事
        </h3>
        <ul className="space-y-4">
          {recentPosts.slice(0, 5).map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`} className="block group">
                <h4 className="text-sm font-medium text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  {new Date(post.publishedAt).toLocaleDateString("ja-JP")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </aside>
  );
};

export default Sidebar;
