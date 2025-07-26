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
} from "@/lib/data";
import { CommentSection } from "@/components/blog";
import { Card, LoadingSpinner } from "@/components/ui";
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
    <section className="mt-16">
      <h3 className="text-2xl font-semibold text-neutral-900 mb-6">関連記事</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Card
            key={post.id}
            className="p-4 hover:shadow-lg transition-shadow"
            hover
          >
            <Link href={`/blog/${post.slug}`}>
              <article className="space-y-3">
                <div className="flex items-center text-sm text-neutral-500">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span className="mx-2">•</span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                    {post.category.name}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-neutral-900 hover:text-primary-600 transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-neutral-600 text-sm line-clamp-2">
                  {post.excerpt}
                </p>
              </article>
            </Link>
          </Card>
        ))}
      </div>
    </section>
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <article className="container max-w-4xl py-8">
        <header className="mb-8">
          <nav className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              ← ブログ一覧に戻る
            </Link>
          </nav>

          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm text-neutral-600">
              <time dateTime={post.publishedAt.toISOString()}>
                {formatDate(post.publishedAt)}
              </time>
              <span>•</span>
              <span>{readingTime}分で読めます</span>
              <span>•</span>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
                {post.category.name}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-neutral-600 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
              <div className="flex items-center space-x-3">
                <div>
                  <p className="font-semibold text-neutral-900">
                    {post.author.name}
                  </p>
                  {post.author.bio && (
                    <p className="text-sm text-neutral-600">
                      {post.author.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/?tag=${tag.slug}`}
                    className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm hover:bg-neutral-200 transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none prose-neutral prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-code:text-primary-800 prose-code:bg-primary-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-neutral-900 prose-pre:text-neutral-100">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-neutral-900 mt-8 mb-4 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold text-neutral-900 mt-6 mb-3">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-neutral-900 mt-5 mb-2">
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

        <Suspense
          fallback={
            <div className="mt-16">
              <div className="text-center py-8">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-neutral-600">関連記事を読み込み中...</p>
              </div>
            </div>
          }
        >
          <RelatedPostsContent currentPostId={post.id} />
        </Suspense>

        <div className="mt-16 border-t border-neutral-200 pt-16">
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
    </>
  );
}
