import {
  BlogPost,
  Category,
  Tag,
  Comment,
  Author,
  PaginationData,
  SearchParams,
} from "@/types";
import * as api from "./api";

// 開発用のフォールバック機能
const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// モックデータのインポート（フォールバック用）
let mockData: any = null;
if (!USE_API) {
  try {
    mockData = require("@/data/mockData");
  } catch (error) {
    console.warn("Mock data not available, falling back to API");
  }
}

const POSTS_PER_PAGE = 10;

// Author functions
export const getAuthors = async (): Promise<Author[]> => {
  if (USE_API) {
    return await api.getAuthors();
  }
  
  if (mockData) {
    return mockData.mockAuthors;
  }
  
  return [];
};

export const getAuthorById = async (id: string): Promise<Author | null> => {
  if (USE_API) {
    return await api.getAuthorById(id);
  }
  
  if (mockData) {
    return mockData.mockAuthors.find((author: Author) => author.id === id) || null;
  }
  
  return null;
};

// Category functions
export const getCategories = async (): Promise<Category[]> => {
  if (USE_API) {
    return await api.getCategories();
  }
  
  if (mockData) {
    return mockData.mockCategories;
  }
  
  return [];
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  if (USE_API) {
    return await api.getCategoryBySlug(slug);
  }
  
  if (mockData) {
    return mockData.mockCategories.find((category: Category) => category.slug === slug) || null;
  }
  
  return null;
};

// Tag functions
export const getTags = async (): Promise<Tag[]> => {
  if (USE_API) {
    return await api.getTags();
  }
  
  if (mockData) {
    return mockData.mockTags;
  }
  
  return [];
};

export const getTagBySlug = async (slug: string): Promise<Tag | null> => {
  if (USE_API) {
    return await api.getTagBySlug(slug);
  }
  
  if (mockData) {
    return mockData.mockTags.find((tag: Tag) => tag.slug === slug) || null;
  }
  
  return null;
};

// BlogPost functions
export const getBlogPosts = async (
  params: SearchParams = {},
): Promise<{
  posts: BlogPost[];
  pagination: PaginationData;
}> => {
  if (USE_API) {
    return await api.getBlogPosts(params);
  }
  
  if (mockData) {
    let filteredPosts = [...mockData.mockBlogPosts];

    if (params.category) {
      filteredPosts = filteredPosts.filter(
        (post: BlogPost) => post.category.slug === params.category,
      );
    }

    if (params.tag) {
      filteredPosts = filteredPosts.filter((post: BlogPost) =>
        post.tags.some((tag) => tag.slug === params.tag),
      );
    }

    if (params.query) {
      const query = params.query.toLowerCase();
      filteredPosts = filteredPosts.filter(
        (post: BlogPost) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.name.toLowerCase().includes(query)) ||
          post.category.name.toLowerCase().includes(query),
      );
    }

    filteredPosts.sort(
      (a: BlogPost, b: BlogPost) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

    const currentPage = params.page || 1;
    const totalItems = filteredPosts.length;
    const totalPages = Math.ceil(totalItems / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;

    const posts = filteredPosts.slice(startIndex, endIndex);

    const pagination: PaginationData = {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage: POSTS_PER_PAGE,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };

    return { posts, pagination };
  }
  
  return { posts: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0, itemsPerPage: POSTS_PER_PAGE, hasNextPage: false, hasPreviousPage: false } };
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  if (USE_API) {
    return await api.getBlogPostBySlug(slug);
  }
  
  if (mockData) {
    return mockData.mockBlogPosts.find((post: BlogPost) => post.slug === slug) || null;
  }
  
  return null;
};

export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  if (USE_API) {
    return await api.getBlogPostById(id);
  }
  
  if (mockData) {
    return mockData.mockBlogPosts.find((post: BlogPost) => post.id === id) || null;
  }
  
  return null;
};

export const getRecentBlogPosts = async (limit: number = 5): Promise<BlogPost[]> => {
  if (USE_API) {
    return await api.getRecentBlogPosts(limit);
  }
  
  if (mockData) {
    return mockData.mockBlogPosts
      .sort(
        (a: BlogPost, b: BlogPost) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
      .slice(0, limit);
  }
  
  return [];
};

export const getRelatedBlogPosts = async (
  currentPostId: string,
  limit: number = 3,
): Promise<BlogPost[]> => {
  if (USE_API) {
    return await api.getRelatedBlogPosts(currentPostId, limit);
  }
  
  if (mockData) {
    const currentPost = mockData.mockBlogPosts.find((post: BlogPost) => post.id === currentPostId);
    if (!currentPost) return [];

    const relatedPosts = mockData.mockBlogPosts
      .filter((post: BlogPost) => post.id !== currentPostId)
      .map((post: BlogPost) => {
        let score = 0;

        if (post.category.id === currentPost.category.id) {
          score += 3;
        }

        const commonTags = post.tags.filter((tag) =>
          currentPost.tags.some((currentTag: Tag) => currentTag.id === tag.id),
        );
        score += commonTags.length * 2;

        return { post, score };
      })
      .filter((item: { post: BlogPost; score: number }) => item.score > 0)
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
      .slice(0, limit)
      .map((item: { post: BlogPost; score: number }) => item.post);

    return relatedPosts;
  }
  
  return [];
};

// Comment functions
export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  if (USE_API) {
    return await api.getCommentsByPostId(postId);
  }
  
  if (mockData) {
    return mockData.mockComments
      .filter(
        (comment: Comment) => comment.postId === postId && comment.status === "approved",
      )
      .sort(
        (a: Comment, b: Comment) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }
  
  return [];
};

export const addComment = async (
  comment: Omit<Comment, "id" | "createdAt" | "status">,
): Promise<Comment> => {
  if (USE_API) {
    return await api.addComment(comment);
  }
  
  if (mockData) {
    const newComment: Comment = {
      ...comment,
      id: Math.random().toString(36).substring(2) + Date.now().toString(36),
      createdAt: new Date(),
      status: "pending",
    };

    mockData.mockComments.push(newComment);
    return newComment;
  }
  
  throw new Error("Unable to add comment: no API or mock data available");
};

// Search functions
export const searchBlogPosts = async (
  query: string,
  limit?: number,
): Promise<BlogPost[]> => {
  if (USE_API) {
    return await api.searchBlogPosts(query, limit);
  }
  
  if (mockData) {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    const results = mockData.mockBlogPosts
      .filter(
        (post: BlogPost) =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm) ||
          post.tags.some((tag) => tag.name.toLowerCase().includes(searchTerm)) ||
          post.category.name.toLowerCase().includes(searchTerm) ||
          post.author.name.toLowerCase().includes(searchTerm),
      )
      .sort((a: BlogPost, b: BlogPost) => {
        const aScore = calculateSearchScore(a, searchTerm);
        const bScore = calculateSearchScore(b, searchTerm);
        return bScore - aScore;
      });

    return limit ? results.slice(0, limit) : results;
  }
  
  return [];
};

const calculateSearchScore = (post: BlogPost, searchTerm: string): number => {
  let score = 0;

  if (post.title.toLowerCase().includes(searchTerm)) score += 10;
  if (post.excerpt.toLowerCase().includes(searchTerm)) score += 5;
  if (post.content.toLowerCase().includes(searchTerm)) score += 2;
  if (post.category.name.toLowerCase().includes(searchTerm)) score += 3;
  if (post.author.name.toLowerCase().includes(searchTerm)) score += 2;

  post.tags.forEach((tag) => {
    if (tag.name.toLowerCase().includes(searchTerm)) score += 3;
  });

  return score;
};

// Category/Tag specific posts
export const getPostsByCategorySlug = async (categorySlug: string): Promise<BlogPost[]> => {
  if (USE_API) {
    return await api.getPostsByCategorySlug(categorySlug);
  }
  
  if (mockData) {
    return mockData.mockBlogPosts.filter((post: BlogPost) => post.category.slug === categorySlug);
  }
  
  return [];
};

export const getPostsByTagSlug = async (tagSlug: string): Promise<BlogPost[]> => {
  if (USE_API) {
    return await api.getPostsByTagSlug(tagSlug);
  }
  
  if (mockData) {
    return mockData.mockBlogPosts.filter((post: BlogPost) =>
      post.tags.some((tag) => tag.slug === tagSlug),
    );
  }
  
  return [];
};

// Utility functions for static generation
export const getAllPostSlugs = async (): Promise<string[]> => {
  if (USE_API) {
    return await api.getAllPostSlugs();
  }
  
  if (mockData) {
    return mockData.mockBlogPosts.map((post: BlogPost) => post.slug);
  }
  
  return [];
};

export const getAllCategorySlugs = async (): Promise<string[]> => {
  if (USE_API) {
    return await api.getAllCategorySlugs();
  }
  
  if (mockData) {
    return mockData.mockCategories.map((category: Category) => category.slug);
  }
  
  return [];
};

export const getAllTagSlugs = async (): Promise<string[]> => {
  if (USE_API) {
    return await api.getAllTagSlugs();
  }
  
  if (mockData) {
    return mockData.mockTags.map((tag: Tag) => tag.slug);
  }
  
  return [];
};