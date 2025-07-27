// キャッシュ戦略とデータフェッチ並列化
import { unstable_cache } from 'next/cache';
import * as dataFunctions from './data';

// キャッシュの設定
const CACHE_TAGS = {
  POSTS: 'posts',
  CATEGORIES: 'categories', 
  TAGS: 'tags',
  AUTHORS: 'authors',
  COMMENTS: 'comments'
};

const CACHE_REVALIDATE = {
  SHORT: 60, // 1分
  MEDIUM: 300, // 5分
  LONG: 3600, // 1時間
  STATIC: false // 手動無効化まで保持
};

// キャッシュ付きデータフェッチ関数
export const getCachedCategories = unstable_cache(
  async () => dataFunctions.getCategories(),
  ['categories'],
  {
    tags: [CACHE_TAGS.CATEGORIES],
    revalidate: CACHE_REVALIDATE.LONG
  }
);

export const getCachedTags = unstable_cache(
  async () => dataFunctions.getTags(),
  ['tags'],
  {
    tags: [CACHE_TAGS.TAGS],
    revalidate: CACHE_REVALIDATE.LONG
  }
);

export const getCachedAuthors = unstable_cache(
  async () => dataFunctions.getAuthors(),
  ['authors'],
  {
    tags: [CACHE_TAGS.AUTHORS],
    revalidate: CACHE_REVALIDATE.LONG
  }
);

export const getCachedRecentPosts = unstable_cache(
  async (limit: number = 5) => dataFunctions.getRecentBlogPosts(limit),
  ['recent-posts'],
  {
    tags: [CACHE_TAGS.POSTS],
    revalidate: CACHE_REVALIDATE.MEDIUM
  }
);

export const getCachedBlogPosts = unstable_cache(
  async (params: any) => dataFunctions.getBlogPosts(params),
  ['blog-posts'],
  {
    tags: [CACHE_TAGS.POSTS],
    revalidate: CACHE_REVALIDATE.SHORT
  }
);

export const getCachedBlogPostBySlug = unstable_cache(
  async (slug: string) => dataFunctions.getBlogPostBySlug(slug),
  ['blog-post-by-slug'],
  {
    tags: [CACHE_TAGS.POSTS],
    revalidate: CACHE_REVALIDATE.MEDIUM
  }
);

export const getCachedRelatedPosts = unstable_cache(
  async (postId: string, limit: number = 3) => dataFunctions.getRelatedBlogPosts(postId, limit),
  ['related-posts'],
  {
    tags: [CACHE_TAGS.POSTS],
    revalidate: CACHE_REVALIDATE.MEDIUM
  }
);

export const getCachedComments = unstable_cache(
  async (postId: string) => dataFunctions.getCommentsByPostId(postId),
  ['comments'],
  {
    tags: [CACHE_TAGS.COMMENTS],
    revalidate: CACHE_REVALIDATE.SHORT
  }
);

// 並列データフェッチ用のヘルパー関数
export async function getSidebarData() {
  // サイドバー用データを並列取得
  const [categories, tags, recentPosts] = await Promise.all([
    getCachedCategories(),
    getCachedTags(),
    getCachedRecentPosts()
  ]);

  return { categories, tags, recentPosts };
}

export async function getBlogPageData(params: any) {
  // ブログページ用データを並列取得
  const [postsData, sidebarData] = await Promise.all([
    getCachedBlogPosts(params),
    getSidebarData()
  ]);

  return {
    posts: postsData.posts,
    pagination: postsData.pagination,
    ...sidebarData
  };
}

export async function getBlogPostPageData(slug: string) {
  // 記事詳細ページ用データを並列取得
  const post = await getCachedBlogPostBySlug(slug);
  
  if (!post) {
    return null;
  }

  const [sidebarData, relatedPosts, comments] = await Promise.all([
    getSidebarData(),
    getCachedRelatedPosts(post.id),
    getCachedComments(post.id)
  ]);

  return {
    post,
    relatedPosts,
    comments,
    ...sidebarData
  };
}

// キャッシュ無効化用ヘルパー
export const invalidateCache = {
  posts: () => ({ tags: [CACHE_TAGS.POSTS] }),
  categories: () => ({ tags: [CACHE_TAGS.CATEGORIES] }),
  tags: () => ({ tags: [CACHE_TAGS.TAGS] }),
  authors: () => ({ tags: [CACHE_TAGS.AUTHORS] }),
  comments: () => ({ tags: [CACHE_TAGS.COMMENTS] }),
  all: () => ({ tags: Object.values(CACHE_TAGS) })
};