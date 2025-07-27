/**
 * Django REST API クライアント
 */

import { 
  BlogPost, 
  Category, 
  Tag, 
  Comment, 
  Author, 
  PaginationData, 
  SearchParams 
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// APIエラーのカスタムクラス
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// APIリクエストのヘルパー関数
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

// 認証付きAPIリクエスト
async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Next.js の環境でのみgetSessionを使用
  let token: string | undefined;
  
  if (typeof window !== 'undefined') {
    // クライアントサイド
    const { getSession } = await import('next-auth/react');
    const session = await getSession();
    token = session?.accessToken as string;
  } else {
    // サーバーサイド - getServerSessionを使用する場合
    // const { getServerSession } = await import('next-auth');
    // const { authOptions } = await import('./auth');
    // const session = await getServerSession(authOptions);
    // token = session?.accessToken as string;
  }
  
  return apiRequest<T>(endpoint, {
    ...options,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
}

// Author API
export const getAuthors = async (): Promise<Author[]> => {
  const response = await apiRequest<{ results: Author[] }>('/blog/authors/');
  return response.results;
};

export const getAuthorById = async (id: string): Promise<Author | null> => {
  try {
    return await apiRequest<Author>(`/blog/authors/${id}/`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
};

// Category API
export const getCategories = async (): Promise<Category[]> => {
  const response = await apiRequest<{ results: Category[] }>('/blog/categories/');
  return response.results;
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const response = await apiRequest<{ results: Category[] }>(`/blog/categories/?slug=${slug}`);
    return response.results[0] || null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
};

// Tag API
export const getTags = async (): Promise<Tag[]> => {
  const response = await apiRequest<{ results: Tag[] }>('/blog/tags/');
  return response.results;
};

export const getTagBySlug = async (slug: string): Promise<Tag | null> => {
  try {
    const response = await apiRequest<{ results: Tag[] }>(`/blog/tags/?slug=${slug}`);
    return response.results[0] || null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
};

// BlogPost API
interface BlogPostListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BlogPost[];
}

export const getBlogPosts = async (
  params: SearchParams = {}
): Promise<{
  posts: BlogPost[];
  pagination: PaginationData;
}> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.category) searchParams.append('category', params.category);
  if (params.tag) searchParams.append('tags', params.tag);
  if (params.query) searchParams.append('search', params.query);
  
  const queryString = searchParams.toString();
  const endpoint = `/blog/posts/${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiRequest<BlogPostListResponse>(endpoint);
  
  // Django REST Frameworkのページネーション形式をフロントエンドの形式に変換
  const currentPage = params.page || 1;
  const itemsPerPage = 10; // Django設定と同期させる
  const totalItems = response.count;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const pagination: PaginationData = {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: !!response.next,
    hasPreviousPage: !!response.previous,
  };

  return {
    posts: response.results,
    pagination,
  };
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const response = await apiRequest<{ results: BlogPost[] }>(`/blog/posts/?slug=${slug}`);
    return response.results[0] || null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
};

export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    return await apiRequest<BlogPost>(`/blog/posts/${id}/`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
};

export const getRecentBlogPosts = async (limit: number = 5): Promise<BlogPost[]> => {
  const response = await apiRequest<BlogPostListResponse>(`/blog/posts/?ordering=-published_at&page_size=${limit}`);
  return response.results;
};

export const getRelatedBlogPosts = async (
  currentPostId: string,
  limit: number = 3
): Promise<BlogPost[]> => {
  // Django側でrelated_postsエンドポイントを実装する必要がある
  try {
    const response = await apiRequest<{ results: BlogPost[] }>(`/blog/posts/${currentPostId}/related/?limit=${limit}`);
    return response.results;
  } catch (error) {
    // フォールバック: 同じカテゴリの最新記事を取得
    const post = await getBlogPostById(currentPostId);
    if (!post) return [];
    
    const response = await apiRequest<BlogPostListResponse>(
      `/blog/posts/?category=${post.category.slug}&exclude=${currentPostId}&page_size=${limit}`
    );
    return response.results;
  }
};

// Comment API
export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  const response = await apiRequest<{ results: Comment[] }>(`/blog/comments/?post=${postId}&status=approved`);
  return response.results.sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
};

export const addComment = async (
  comment: Omit<Comment, "id" | "createdAt" | "status">
): Promise<Comment> => {
  return await authenticatedRequest<Comment>('/blog/comments/', {
    method: 'POST',
    body: JSON.stringify({
      post: comment.postId,
      author: comment.author,
      email: comment.email,
      content: comment.content,
    }),
  });
};

// Search API
export const searchBlogPosts = async (
  query: string,
  limit?: number
): Promise<BlogPost[]> => {
  if (!query.trim()) return [];
  
  const searchParams = new URLSearchParams();
  searchParams.append('search', query);
  if (limit) searchParams.append('page_size', limit.toString());
  
  const response = await apiRequest<BlogPostListResponse>(`/blog/posts/?${searchParams.toString()}`);
  return response.results;
};

// Category/Tag specific posts
export const getPostsByCategorySlug = async (categorySlug: string): Promise<BlogPost[]> => {
  const response = await apiRequest<BlogPostListResponse>(`/blog/posts/?category=${categorySlug}`);
  return response.results;
};

export const getPostsByTagSlug = async (tagSlug: string): Promise<BlogPost[]> => {
  const response = await apiRequest<BlogPostListResponse>(`/blog/posts/?tags=${tagSlug}`);
  return response.results;
};

// Utility functions for static generation
export const getAllPostSlugs = async (): Promise<string[]> => {
  const response = await apiRequest<{ results: Array<{ slug: string }> }>('/blog/posts/?fields=slug');
  return response.results.map(post => post.slug);
};

export const getAllCategorySlugs = async (): Promise<string[]> => {
  const response = await apiRequest<{ results: Array<{ slug: string }> }>('/blog/categories/?fields=slug');
  return response.results.map(category => category.slug);
};

export const getAllTagSlugs = async (): Promise<string[]> => {
  const response = await apiRequest<{ results: Array<{ slug: string }> }>('/blog/tags/?fields=slug');
  return response.results.map(tag => tag.slug);
};

// Health check
export const healthCheck = async (): Promise<{ status: string; timestamp: string }> => {
  return await apiRequest<{ status: string; timestamp: string }>('/health/');
};