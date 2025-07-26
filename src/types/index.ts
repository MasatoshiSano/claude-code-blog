export interface Author {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: Author;
  publishedAt: Date;
  updatedAt: Date;
  category: Category;
  tags: Tag[];
  featuredImage?: string;
  seo: SEOData;
  status: "draft" | "published";
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  createdAt: Date;
  status: "pending" | "approved" | "rejected";
}

export interface NewComment {
  postId: string;
  author: string;
  email: string;
  content: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SearchParams {
  query?: string;
  category?: string;
  tag?: string;
  page?: number;
}

export interface FilterParams {
  category?: string;
  tag?: string;
  search?: string;
}

export interface BlogListProps {
  posts: BlogPost[];
  loading?: boolean;
  pagination?: PaginationData;
}

export interface BlogCardProps {
  post: BlogPost;
  showExcerpt?: boolean;
  size?: "sm" | "md" | "lg";
}

export interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (comment: NewComment) => void;
}

export interface ButtonProps {
  variant: "primary" | "secondary" | "outline" | "ghost";
  size: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  type?: "text" | "email" | "password" | "search";
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export interface TextareaProps {
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  className?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
  onCategorySelect: (categorySlug: string | undefined) => void;
}

export interface TagFilterProps {
  tags: Tag[];
  selectedTags?: string[];
  onTagToggle: (tagSlug: string) => void;
}
