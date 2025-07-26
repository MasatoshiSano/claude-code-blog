# 設計書

## 概要

落ち着いた雰囲気のブログサイトをReactとNext.jsを使用して構築します。モダンで洗練されたUIを提供し、コンポーネントの再利用性を重視した設計とします。SEO対応、レスポンシブデザイン、管理機能を含む包括的なブログプラットフォームを実現します。

## アーキテクチャ

### 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **フレームワーク**: Next.js 14 (App Router)
- **スタイリング**: Tailwind CSS
- **状態管理**: Zustand
- **フォーム管理**: React Hook Form + Zod (バリデーション)
- **データフェッチング**: TanStack Query
- **データベース**: JSON ファイル (開発用) → 将来的にはHeadless CMS
- **認証**: NextAuth.js (管理者機能用)

### アーキテクチャパターン

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # 公開ページ
│   │   ├── page.tsx       # ブログ一覧
│   │   ├── blog/          # ブログ詳細
│   │   ├── contact/       # お問い合わせ
│   │   └── search/        # 検索結果
│   ├── admin/             # 管理者ページ
│   └── api/               # API Routes
├── components/            # 再利用可能コンポーネント
│   ├── ui/               # 基本UIコンポーネント
│   ├── blog/             # ブログ関連コンポーネント
│   ├── forms/            # フォームコンポーネント
│   └── layout/           # レイアウトコンポーネント
├── lib/                  # ユーティリティ・設定
├── hooks/                # カスタムフック
├── stores/               # Zustand ストア
├── types/                # TypeScript型定義
└── data/                 # 静的データ・モック
```

## コンポーネントとインターフェース

### 基本UIコンポーネント

#### Button コンポーネント
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}
```

#### Card コンポーネント
```typescript
interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}
```

#### Input コンポーネント
```typescript
interface InputProps {
  label?: string
  placeholder?: string
  error?: string
  type?: 'text' | 'email' | 'password' | 'search'
  required?: boolean
}
```

### ブログ関連コンポーネント

#### BlogCard コンポーネント
```typescript
interface BlogCardProps {
  post: BlogPost
  showExcerpt?: boolean
  size?: 'sm' | 'md' | 'lg'
}
```

#### BlogList コンポーネント
```typescript
interface BlogListProps {
  posts: BlogPost[]
  loading?: boolean
  pagination?: PaginationData
}
```

#### CommentSection コンポーネント
```typescript
interface CommentSectionProps {
  postId: string
  comments: Comment[]
  onAddComment: (comment: NewComment) => void
}
```

### レイアウトコンポーネント

#### Header コンポーネント
- ナビゲーション
- 検索バー
- レスポンシブメニュー

#### Footer コンポーネント
- サイト情報
- ソーシャルリンク
- カテゴリリンク

#### Sidebar コンポーネント
- カテゴリ一覧
- タグクラウド
- 最新記事

## データモデル

### BlogPost
```typescript
interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: Author
  publishedAt: Date
  updatedAt: Date
  category: Category
  tags: Tag[]
  featuredImage?: string
  seo: SEOData
  status: 'draft' | 'published'
}
```

### Category
```typescript
interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
}
```

### Tag
```typescript
interface Tag {
  id: string
  name: string
  slug: string
}
```

### Comment
```typescript
interface Comment {
  id: string
  postId: string
  author: string
  email: string
  content: string
  createdAt: Date
  status: 'pending' | 'approved' | 'rejected'
}
```

### Author
```typescript
interface Author {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
}
```

### SEOData
```typescript
interface SEOData {
  metaTitle: string
  metaDescription: string
  keywords: string[]
  ogImage?: string
}
```

## エラーハンドリング

### エラー境界
- React Error Boundary を使用してコンポーネントレベルのエラーをキャッチ
- Next.js のエラーページ（404、500）をカスタマイズ

### フォームバリデーション
- Zod を使用したスキーマベースバリデーション
- リアルタイムバリデーション
- ユーザーフレンドリーなエラーメッセージ

### API エラーハンドリング
- TanStack Query のエラーハンドリング機能を活用
- ネットワークエラー、サーバーエラーの適切な処理
- ユーザーへの分かりやすいエラー表示

## テスト戦略

### 単体テスト
- Jest + React Testing Library
- コンポーネントの動作テスト
- カスタムフックのテスト
- ユーティリティ関数のテスト

### 統合テスト
- ページレベルのテスト
- API との連携テスト
- フォーム送信フローのテスト

### E2Eテスト
- Playwright を使用
- 主要なユーザーフローのテスト
- ブログ記事の閲覧、検索、コメント投稿
- 管理者機能のテスト

## デザインシステム

### カラーパレット
```css
/* 落ち着いた色合い */
--color-primary: #6366f1      /* インディゴ */
--color-secondary: #64748b    /* スレートグレー */
--color-accent: #f59e0b       /* アンバー */
--color-neutral-50: #f8fafc
--color-neutral-100: #f1f5f9
--color-neutral-200: #e2e8f0
--color-neutral-300: #cbd5e1
--color-neutral-400: #94a3b8
--color-neutral-500: #64748b
--color-neutral-600: #475569
--color-neutral-700: #334155
--color-neutral-800: #1e293b
--color-neutral-900: #0f172a
```

### タイポグラフィ
- フォント: Inter (システムフォント)
- 見出し階層: H1-H6 の明確な定義
- 本文: 読みやすい行間とフォントサイズ
- コードブロック: JetBrains Mono

### スペーシング
- 8px グリッドシステム
- 一貫したマージン・パディング
- レスポンシブスペーシング

### レスポンシブブレークポイント
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## SEO対応

### メタデータ管理
- Next.js の Metadata API を使用
- 動的メタタイトル・ディスクリプション
- Open Graph タグ
- Twitter Card タグ

### 構造化データ
- JSON-LD 形式
- Article スキーマ
- BreadcrumbList スキーマ
- Organization スキーマ

### サイトマップ
- 動的 XML サイトマップ生成
- robots.txt の設定

## パフォーマンス最適化

### 画像最適化
- Next.js Image コンポーネント
- WebP 形式の使用
- 遅延読み込み

### コード分割
- 動的インポート
- ページレベルの分割
- コンポーネントレベルの分割

### キャッシュ戦略
- TanStack Query のキャッシュ
- Next.js の静的生成
- CDN キャッシュ

## セキュリティ

### 認証・認可
- NextAuth.js による管理者認証
- JWT トークン管理
- セッション管理

### データ検証
- サーバーサイドバリデーション
- XSS 対策
- CSRF 対策

### コンテンツセキュリティ
- コメントの承認制
- スパム対策
- 入力サニタイゼーション