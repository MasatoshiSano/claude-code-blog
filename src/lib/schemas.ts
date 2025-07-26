import { z } from "zod";

export const AuthorSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  avatar: z.string().optional(),
  bio: z.string().optional(),
});

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "カテゴリ名は必須です"),
  slug: z.string().min(1, "スラッグは必須です"),
  description: z.string().optional(),
  color: z.string().optional(),
});

export const TagSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "タグ名は必須です"),
  slug: z.string().min(1, "スラッグは必須です"),
});

export const SEODataSchema = z.object({
  metaTitle: z
    .string()
    .min(1, "メタタイトルは必須です")
    .max(60, "メタタイトルは60文字以内で入力してください"),
  metaDescription: z
    .string()
    .min(1, "メタディスクリプションは必須です")
    .max(160, "メタディスクリプションは160文字以内で入力してください"),
  keywords: z.array(z.string()),
  ogImage: z.string().optional(),
});

export const BlogPostSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(100, "タイトルは100文字以内で入力してください"),
  slug: z.string().min(1, "スラッグは必須です"),
  excerpt: z
    .string()
    .min(1, "概要は必須です")
    .max(300, "概要は300文字以内で入力してください"),
  content: z.string().min(1, "本文は必須です"),
  author: AuthorSchema,
  publishedAt: z.date(),
  updatedAt: z.date(),
  category: CategorySchema,
  tags: z.array(TagSchema),
  featuredImage: z.string().optional(),
  seo: SEODataSchema,
  status: z.enum(["draft", "published"]),
});

export const CommentSchema = z.object({
  id: z.string(),
  postId: z.string(),
  author: z
    .string()
    .min(1, "名前は必須です")
    .max(50, "名前は50文字以内で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  content: z
    .string()
    .min(1, "コメント内容は必須です")
    .max(1000, "コメントは1000文字以内で入力してください"),
  createdAt: z.date(),
  status: z.enum(["pending", "approved", "rejected"]),
});

export const NewCommentSchema = z.object({
  postId: z.string(),
  author: z
    .string()
    .min(1, "名前は必須です")
    .max(50, "名前は50文字以内で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  content: z
    .string()
    .min(1, "コメント内容は必須です")
    .max(1000, "コメントは1000文字以内で入力してください"),
});

export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(1, "名前は必須です")
    .max(50, "名前は50文字以内で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  subject: z
    .string()
    .min(1, "件名は必須です")
    .max(100, "件名は100文字以内で入力してください"),
  message: z
    .string()
    .min(1, "メッセージは必須です")
    .max(2000, "メッセージは2000文字以内で入力してください"),
});

export const SearchParamsSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  page: z.number().min(1).optional(),
});
