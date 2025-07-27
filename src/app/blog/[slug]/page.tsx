import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  addComment,
  getAllPostSlugs,
} from "@/lib/data";
import { getBlogPostPageData } from "@/lib/cache";
import { RecentPosts } from "@/components/blog";
import { Sidebar } from "@/components/layout";
import { Card, LoadingSpinner, CategoryBadge, TagList } from "@/components/ui";
import { ReactMarkdownDynamic, CommentSectionDynamic, CodeBlockDynamic } from "@/components/dynamic/index";
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
  const data = await getBlogPostPageData(params.slug);

  if (!data?.post) {
    return {
      title: "ページが見つかりません",
    };
  }

  const { post } = data;

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

async function CommentsContent({ postId, comments }: { postId: string; comments: any[] }) {
  return (
    <CommentSectionDynamic
      postId={postId}
      comments={comments}
      onAddComment={async (commentData: NewComment) => {
        "use server";
        await addComment(commentData);
      }}
    />
  );
}

function RelatedPostsContent({ relatedPosts }: { relatedPosts: any[] }) {
  if (relatedPosts.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 md:p-12 mb-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
          <span className="text-neutral-600 text-sm font-bold">📚</span>
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
  const data = await getBlogPostPageData(params.slug);

  if (!data) {
    notFound();
  }

  const { post, relatedPosts, comments, categories, tags, recentPosts } = data;
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
              <div className="bg-white border border-neutral-200 rounded-lg p-8 md:p-10 shadow-sm hover:shadow-lg transition-all duration-300">
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
                  {post.title}
                </h1>

                {/* 抜粋 */}
                <p className="text-xl md:text-2xl text-neutral-700 leading-relaxed mb-8 font-light">
                  {post.excerpt}
                </p>

                {/* 著者情報とタグ */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-neutral-200 pt-6 space-y-4 md:space-y-0">
                  {/* 著者情報 */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 font-semibold text-lg">
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
                <div className="prose prose-lg max-w-none prose-neutral prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-code:text-neutral-800 prose-code:bg-neutral-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-neutral-900 prose-pre:text-neutral-100 prose-p:leading-relaxed prose-p:mb-6">
          <ReactMarkdownDynamic
            remarkPlugins={[require('remark-gfm')]}
            rehypePlugins={[require('rehype-highlight')]}
            components={{
              h1: ({ children }) => {
                // 記事のタイトルと同じ場合は表示しない（ヘッダーで既に表示済み）
                if (children === post.title) {
                  return null;
                }
                return (
                  <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mt-12 mb-6 first:mt-0 relative">
                    {children}
                    <div className="absolute -bottom-2 left-0 w-16 h-1 bg-neutral-200 rounded-full"></div>
                  </h1>
                );
              },
              h2: ({ children }) => (
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mt-10 mb-6 relative">
                  <div className="relative bg-neutral-50 border border-neutral-200 rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-neutral-300">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-8 bg-neutral-300 rounded-full"></div>
                      <span className="text-neutral-900">
                        {children}
                      </span>
                    </div>
                  </div>
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl md:text-2xl font-semibold text-neutral-900 mt-8 mb-3 relative pl-4 border-l-4 border-neutral-200 hover:border-neutral-300 transition-colors duration-200">
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
                      className="text-neutral-800 bg-neutral-100 px-1 py-0.5 rounded text-sm"
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
                  <CodeBlockDynamic {...props}>
                    {codeContent}
                  </CodeBlockDynamic>
                );
              },
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-neutral-200 pl-4 my-4 italic text-neutral-600">
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
                  </ReactMarkdownDynamic>
                </div>
              </div>
            </div>

            {/* 関連記事 */}
            <RelatedPostsContent relatedPosts={relatedPosts} />

            {/* コメントセクション */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 md:p-12">
              <CommentsContent postId={post.id} comments={comments} />
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
