import {
  BlogPost,
  Category,
  Tag,
  Comment,
  Author,
  PaginationData,
  SearchParams,
} from "@/types";
import {
  mockBlogPosts,
  mockCategories,
  mockTags,
  mockComments,
  mockAuthors,
} from "@/data/mockData";

const POSTS_PER_PAGE = 10;

export const getAuthors = async (): Promise<Author[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockAuthors;
};

export const getAuthorById = async (id: string): Promise<Author | null> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockAuthors.find((author) => author.id === id) || null;
};

export const getCategories = async (): Promise<Category[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockCategories;
};

export const getCategoryBySlug = async (
  slug: string,
): Promise<Category | null> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockCategories.find((category) => category.slug === slug) || null;
};

export const getTags = async (): Promise<Tag[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockTags;
};

export const getTagBySlug = async (slug: string): Promise<Tag | null> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockTags.find((tag) => tag.slug === slug) || null;
};

export const getBlogPosts = async (
  params: SearchParams = {},
): Promise<{
  posts: BlogPost[];
  pagination: PaginationData;
}> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  let filteredPosts = [...mockBlogPosts];

  if (params.category) {
    filteredPosts = filteredPosts.filter(
      (post) => post.category.slug === params.category,
    );
  }

  if (params.tag) {
    filteredPosts = filteredPosts.filter((post) =>
      post.tags.some((tag) => tag.slug === params.tag),
    );
  }

  if (params.query) {
    const query = params.query.toLowerCase();
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.name.toLowerCase().includes(query)) ||
        post.category.name.toLowerCase().includes(query),
    );
  }

  filteredPosts.sort(
    (a, b) =>
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
};

export const getBlogPostBySlug = async (
  slug: string,
): Promise<BlogPost | null> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockBlogPosts.find((post) => post.slug === slug) || null;
};

export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockBlogPosts.find((post) => post.id === id) || null;
};

export const getRecentBlogPosts = async (
  limit: number = 5,
): Promise<BlogPost[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockBlogPosts
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, limit);
};

export const getRelatedBlogPosts = async (
  currentPostId: string,
  limit: number = 3,
): Promise<BlogPost[]> => {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const currentPost = mockBlogPosts.find((post) => post.id === currentPostId);
  if (!currentPost) return [];

  const relatedPosts = mockBlogPosts
    .filter((post) => post.id !== currentPostId)
    .map((post) => {
      let score = 0;

      if (post.category.id === currentPost.category.id) {
        score += 3;
      }

      const commonTags = post.tags.filter((tag) =>
        currentPost.tags.some((currentTag) => currentTag.id === tag.id),
      );
      score += commonTags.length * 2;

      return { post, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);

  return relatedPosts;
};

export const getCommentsByPostId = async (
  postId: string,
): Promise<Comment[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockComments
    .filter(
      (comment) => comment.postId === postId && comment.status === "approved",
    )
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
};

export const addComment = async (
  comment: Omit<Comment, "id" | "createdAt" | "status">,
): Promise<Comment> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const newComment: Comment = {
    ...comment,
    id: Math.random().toString(36).substring(2) + Date.now().toString(36),
    createdAt: new Date(),
    status: "pending",
  };

  mockComments.push(newComment);
  return newComment;
};

export const searchBlogPosts = async (
  query: string,
  limit?: number,
): Promise<BlogPost[]> => {
  await new Promise((resolve) => setTimeout(resolve, 150));

  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase();
  const results = mockBlogPosts
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some((tag) => tag.name.toLowerCase().includes(searchTerm)) ||
        post.category.name.toLowerCase().includes(searchTerm) ||
        post.author.name.toLowerCase().includes(searchTerm),
    )
    .sort((a, b) => {
      const aScore = calculateSearchScore(a, searchTerm);
      const bScore = calculateSearchScore(b, searchTerm);
      return bScore - aScore;
    });

  return limit ? results.slice(0, limit) : results;
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

export const getPostsByCategorySlug = async (
  categorySlug: string,
): Promise<BlogPost[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockBlogPosts.filter((post) => post.category.slug === categorySlug);
};

export const getPostsByTagSlug = async (
  tagSlug: string,
): Promise<BlogPost[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockBlogPosts.filter((post) =>
    post.tags.some((tag) => tag.slug === tagSlug),
  );
};

export const getAllPostSlugs = async (): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockBlogPosts.map((post) => post.slug);
};

export const getAllCategorySlugs = async (): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockCategories.map((category) => category.slug);
};

export const getAllTagSlugs = async (): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockTags.map((tag) => tag.slug);
};
