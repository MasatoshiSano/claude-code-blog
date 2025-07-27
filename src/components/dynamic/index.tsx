// 動的インポート用コンポーネント
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/ui';

// CommentSection - 記事詳細ページでのみ使用
export const CommentSectionDynamic = dynamic(
  () => import('@/components/blog').then(mod => ({ default: mod.CommentSection })),
  {
    loading: () => (
      <div className="text-center py-8">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-neutral-600">コメントを読み込み中...</p>
      </div>
    ),
    ssr: false
  }
);

// ReactMarkdown - 記事本文の表示でのみ使用
export const ReactMarkdownDynamic = dynamic(
  () => import('react-markdown'),
  {
    loading: () => (
      <div className="prose prose-lg max-w-none">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-neutral-200 rounded w-full"></div>
          <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
          <div className="h-4 bg-neutral-200 rounded w-4/6"></div>
        </div>
      </div>
    ),
    ssr: true
  }
);

// CodeBlock - コードが含まれる記事でのみ使用
export const CodeBlockDynamic = dynamic(
  () => import('@/components/ui/CodeBlock'),
  {
    loading: () => (
      <div className="bg-neutral-900 rounded-lg p-4">
        <div className="animate-pulse h-20 bg-neutral-700 rounded"></div>
      </div>
    ),
    ssr: true
  }
);