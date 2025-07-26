import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import {
  getBlogPostBySlug,
  getCommentsByPostId,
  addComment,
  getRelatedBlogPosts,
  getAllPostSlugs,
  getCategories,
  getTags,
  getRecentBlogPosts,
} from "@/lib/data";
import { CommentSection, RecentPosts } from "@/components/blog";
import { Sidebar } from "@/components/layout";
import { Card, LoadingSpinner, CategoryBadge, TagList } from "@/components/ui";
import CodeBlock from "@/components/ui/CodeBlock";
import { formatDate, calculateReadingTime } from "@/lib/utils";
import { NewComment } from "@/types";
import "highlight.js/styles/github.css";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "ページが見つかりません",
    };
  }

  return {
    title: post.seo.metaTitle,
    description: post.seo.metaDescription,
    keywords: post.seo.keywords,
    openGraph: {
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      type: "article",
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author.name],
      tags: post.tags.map((tag) => tag.name),
      images: post.seo.ogImage ? [post.seo.ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      images: post.seo.ogImage ? [post.seo.ogImage] : undefined,
    },
  };
}

async function CommentsContent({ postId }: { postId: string }) {
  const comments = await getCommentsByPostId(postId);

  return (
    <CommentSection
      postId={postId}
      comments={comments}
      onAddComment={async (commentData: NewComment) => {
        "use server";
        await addComment(commentData);
      }}
    />
  );
}

async function RelatedPostsContent({
  currentPostId,
}: {
  currentPostId: string;
}) {
  const relatedPosts = await getRelatedBlogPosts(currentPostId);

  if (relatedPosts.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 md:p-12 mb-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">📚</span>
        </div>
        <h3 className="text-2xl font-bold text-neutral-900">関連記事</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Card
            key={post.id}
            className="p-6 hover:shadow-lg transition-all duration-300 border border-neutral-100 hover:border-primary-200 group"
            hover
          >
            <Link href={`/blog/${post.slug}`}>
              <article className="space-y-4">
                <div className="flex items-center text-sm text-neutral-500">
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
                <h4 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h4>
                <p className="text-neutral-600 text-sm line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span>続きを読む</span>
                  <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
              </article>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "ブログサイト",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `/blog/${post.slug}`,
    },
  };

  // サイドバー用データの取得
  const [categories, tags, recentPosts] = await Promise.all([
    getCategories(),
    getTags(),
    getRecentBlogPosts(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container max-w-7xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* メインコンテンツ */}
          <article className="lg:col-span-3">
            {/* ナビゲーション */}
            <nav className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 transition-all duration-200 group"
              >
                <span className="transform group-hover:-translate-x-1 transition-transform duration-200">←</span>
                <span className="ml-2">ブログ一覧に戻る</span>
              </Link>
            </nav>

            {/* ヘッダー */}
            <header className="mb-12">
              <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 border border-primary-100 rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-md transition-all duration-300">
                {/* メタ情報 */}
                <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-6">
                  <time 
                    dateTime={post.publishedAt.toISOString()}
                    className="flex items-center space-x-1"
                  >
                    <span>📅</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </time>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <span>⏱️</span>
                    <span>{readingTime}分で読めます</span>
                  </span>
                  <span>•</span>
                  <CategoryBadge
                    category={post.category}
                    variant="pill"
                    size="sm"
                    showLink={false}
                  />
                </div>

                {/* タイトル */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-6 tracking-tight">
                  <span className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-transparent">
                    {post.title}
                  </span>
                </h1>

                {/* 抜粋 */}
                <p className="text-xl md:text-2xl text-neutral-700 leading-relaxed mb-8 font-light">
                  {post.excerpt}
                </p>

                {/* 著者情報とタグ */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-primary-200 pt-6 space-y-4 md:space-y-0">
                  {/* 著者情報 */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {post.author.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 text-lg">
                        {post.author.name}
                      </p>
                      {post.author.bio && (
                        <p className="text-sm text-neutral-600 max-w-md">
                          {post.author.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* タグ */}
                  <TagList
                    tags={post.tags}
                    variant="outline"
                    size="md"
                    showLink={true}
                    className=""
                  />
                </div>
              </div>
            </header>

            {/* 記事本文 */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden mb-12">
              <div className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none prose-neutral prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-code:text-primary-800 prose-code:bg-primary-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-neutral-900 prose-pre:text-neutral-100 prose-p:leading-relaxed prose-p:mb-6">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({ children }) => {
                // 記事のタイトルと同じ場合は表示しない（ヘッダーで既に表示済み）
                if (children === post.title) {
                  return null;
                }
                return (
                  <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mt-12 mb-6 first:mt-0 relative">
                    <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                      {children}
                    </span>
                    <div className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
                  </h1>
                );
              },
              h2: ({ children }) => (
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mt-10 mb-6 relative group">
                  <div className="relative bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-primary-300 group-hover:from-primary-100 group-hover:to-primary-150">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-t-lg"></div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-8 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-200"></div>
                      <span className="text-neutral-800 group-hover:text-neutral-900 transition-colors duration-200">
                        {children}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary-300 to-transparent"></div>
                  </div>
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl md:text-2xl font-semibold text-neutral-900 mt-8 mb-3 relative pl-4 border-l-4 border-primary-200 hover:border-primary-300 transition-colors duration-200">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-neutral-700 leading-relaxed mb-4">
                  {children}
                </p>
              ),
              code: ({ className, children, ...props }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code
                      className="text-primary-800 bg-primary-50 px-1 py-0.5 rounded text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              pre: ({ children, ...props }) => {
                // preタグ内のcodeタグの内容を直接取得
                let codeContent = "";
                if (children && typeof children === "object" && "props" in children) {
                  codeContent = children.props.children || "";
                }
                
                return (
                  <CodeBlock {...props}>
                    {codeContent}
                  </CodeBlock>
                );
              },
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary-200 pl-4 my-4 italic text-neutral-600">
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 space-y-1 text-neutral-700">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 space-y-1 text-neutral-700">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-neutral-700">{children}</li>
              ),
              a: ({ href, children }) => (
                <Link
                  href={href || "#"}
                  className="text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {children}
                </Link>
              ),
            }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* 関連記事 */}
            <Suspense
              fallback={
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-12">
                  <div className="text-center py-8">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-neutral-600">関連記事を読み込み中...</p>
                  </div>
                </div>
              }
            >
              <RelatedPostsContent currentPostId={post.id} />
            </Suspense>

            {/* コメントセクション */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 md:p-12">
              <Suspense
                fallback={
                  <div className="text-center py-8">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-neutral-600">コメントを読み込み中...</p>
                  </div>
                }
              >
                <CommentsContent postId={post.id} />
              </Suspense>
            </div>
          </article>

          {/* サイドバー */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Sidebar
                categories={categories}
                tags={tags}
                recentPosts={recentPosts}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
