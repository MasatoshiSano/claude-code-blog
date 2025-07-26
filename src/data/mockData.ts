import { Author, Category, Tag, BlogPost, Comment } from "@/types";

export const mockAuthors: Author[] = [
  {
    id: "1",
    name: "田中太郎",
    email: "tanaka@example.com",
    avatar: "/images/authors/tanaka.jpg",
    bio: "フロントエンド開発者として10年の経験を持つ。React、TypeScript、Next.jsを専門とする。",
  },
  {
    id: "2",
    name: "佐藤花子",
    email: "sato@example.com",
    avatar: "/images/authors/sato.jpg",
    bio: "UI/UXデザイナー兼フロントエンドエンジニア。美しいWebサイトの制作に情熱を注ぐ。",
  },
  {
    id: "3",
    name: "鈴木一郎",
    email: "suzuki@example.com",
    avatar: "/images/authors/suzuki.jpg",
    bio: "バックエンド開発とインフラに詳しいフルスタックエンジニア。",
  },
];

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "技術",
    slug: "technology",
    description: "プログラミングやWeb開発に関する記事",
    color: "#6366f1",
  },
  {
    id: "2",
    name: "ライフスタイル",
    slug: "lifestyle",
    description: "日常生活や趣味に関する記事",
    color: "#f59e0b",
  },
  {
    id: "3",
    name: "チュートリアル",
    slug: "tutorial",
    description: "実践的な学習コンテンツ",
    color: "#10b981",
  },
  {
    id: "4",
    name: "レビュー",
    slug: "review",
    description: "ツールやサービスのレビュー",
    color: "#8b5cf6",
  },
];

export const mockTags: Tag[] = [
  { id: "1", name: "React", slug: "react" },
  { id: "2", name: "TypeScript", slug: "typescript" },
  { id: "3", name: "Next.js", slug: "nextjs" },
  { id: "4", name: "JavaScript", slug: "javascript" },
  { id: "5", name: "CSS", slug: "css" },
  { id: "6", name: "HTML", slug: "html" },
  { id: "7", name: "Node.js", slug: "nodejs" },
  { id: "8", name: "Python", slug: "python" },
  { id: "9", name: "デザイン", slug: "design" },
  { id: "10", name: "UI/UX", slug: "ui-ux" },
  { id: "11", name: "パフォーマンス", slug: "performance" },
  { id: "12", name: "セキュリティ", slug: "security" },
  { id: "13", name: "ツール", slug: "tools" },
  { id: "14", name: "初心者向け", slug: "beginner" },
  { id: "15", name: "上級者向け", slug: "advanced" },
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Next.js 14の新機能完全ガイド",
    slug: "nextjs-14-complete-guide",
    excerpt:
      "Next.js 14で追加された新機能について詳しく解説します。App Routerの改善点やパフォーマンス向上について学びましょう。",
    content: `
# Next.js 14の新機能完全ガイド

Next.js 14がリリースされ、多くの新機能と改善が追加されました。この記事では、主要な新機能について詳しく解説します。

## 主要な新機能

### 1. Server Actions の安定化

Server Actionsが安定版となり、フォームの処理がより簡単になりました。

\`\`\`typescript
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  // データベースに保存
  await savePost({ title, content })
}
\`\`\`

### 2. Turbopack の改善

開発環境でのビルド速度が大幅に向上しました。

### 3. Metadata API の拡張

SEO対応がより簡単になりました。

\`\`\`typescript
export const metadata: Metadata = {
  title: 'My Blog Post',
  description: 'This is a great blog post',
  openGraph: {
    title: 'My Blog Post',
    description: 'This is a great blog post',
    images: ['/og-image.jpg'],
  },
}
\`\`\`

## まとめ

Next.js 14は開発者体験の向上に重点を置いたアップデートとなっています。ぜひ新機能を活用してみてください。
    `,
    author: mockAuthors[0],
    publishedAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    category: mockCategories[0],
    tags: [mockTags[2], mockTags[1], mockTags[0]],
    featuredImage:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    seo: {
      metaTitle: "Next.js 14の新機能完全ガイド | ブログサイト",
      metaDescription:
        "Next.js 14で追加された新機能について詳しく解説します。App Routerの改善点やパフォーマンス向上について学びましょう。",
      keywords: ["Next.js", "React", "TypeScript", "Web開発"],
      ogImage: "/images/posts/nextjs-14-og.jpg",
    },
    status: "published",
  },
  {
    id: "2",
    title: "TypeScriptの型安全性を活用したReact開発",
    slug: "typescript-react-type-safety",
    excerpt:
      "TypeScriptを使ったReact開発で型安全性を確保する方法について解説します。実践的なパターンやベストプラクティスを紹介。",
    content: `
# TypeScriptの型安全性を活用したReact開発

TypeScriptとReactを組み合わせることで、より安全で保守性の高いコードを書くことができます。

## 基本的な型定義

### Props の型定義

\`\`\`typescript
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  variant: 'primary' | 'secondary'
}

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled, variant }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={\`btn btn-\${variant}\`}
    >
      {children}
    </button>
  )
}
\`\`\`

### State の型定義

\`\`\`typescript
interface User {
  id: string
  name: string
  email: string
}

const [user, setUser] = useState<User | null>(null)
\`\`\`

## 高度なパターン

### Generic Component

\`\`\`typescript
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
\`\`\`

## まとめ

TypeScriptを活用することで、開発時のエラーを削減し、より良いDXを実現できます。
    `,
    author: mockAuthors[0],
    publishedAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    category: mockCategories[0],
    tags: [mockTags[1], mockTags[0], mockTags[3]],
    featuredImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    seo: {
      metaTitle: "TypeScriptの型安全性を活用したReact開発 | ブログサイト",
      metaDescription:
        "TypeScriptを使ったReact開発で型安全性を確保する方法について解説します。実践的なパターンやベストプラクティスを紹介。",
      keywords: ["TypeScript", "React", "JavaScript", "型安全性"],
    },
    status: "published",
  },
  {
    id: "3",
    title: "モダンCSSでレスポンシブデザインを作る",
    slug: "modern-css-responsive-design",
    excerpt:
      "CSS Grid、Flexbox、Container QueriesなどのモダンなCSS機能を使って、効率的にレスポンシブデザインを作成する方法を紹介します。",
    content: `
# モダンCSSでレスポンシブデザインを作る

現代のCSS機能を活用することで、より効率的にレスポンシブデザインを作成できます。

## CSS Grid

### 基本的なグリッドレイアウト

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
\`\`\`

### レスポンシブなグリッド

\`\`\`css
.responsive-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .responsive-grid {
    grid-template-columns: 2fr 1fr;
  }
}

@media (min-width: 1024px) {
  .responsive-grid {
    grid-template-columns: 1fr 2fr 1fr;
  }
}
\`\`\`

## Flexbox

### 中央寄せ

\`\`\`css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
\`\`\`

## Container Queries

新しいContainer Queriesを使用することで、より柔軟なレスポンシブデザインが可能です。

\`\`\`css
@container (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
\`\`\`

## まとめ

モダンなCSS機能を活用することで、メディアクエリに頼らない柔軟なデザインが可能になります。
    `,
    author: mockAuthors[1],
    publishedAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
    category: mockCategories[0],
    tags: [mockTags[4], mockTags[8], mockTags[9]],
    featuredImage:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    seo: {
      metaTitle: "モダンCSSでレスポンシブデザインを作る | ブログサイト",
      metaDescription:
        "CSS Grid、Flexbox、Container QueriesなどのモダンなCSS機能を使って、効率的にレスポンシブデザインを作成する方法を紹介します。",
      keywords: ["CSS", "レスポンシブデザイン", "CSS Grid", "Flexbox"],
    },
    status: "published",
  },
  {
    id: "4",
    title: "効率的なワークフローのための開発環境構築",
    slug: "efficient-development-environment",
    excerpt:
      "開発者の生産性を向上させるための開発環境の構築方法について解説します。VS Code、Git、ターミナルの設定からDockerまで。",
    content: `
# 効率的なワークフローのための開発環境構築

開発者にとって効率的な開発環境は生産性向上の鍵となります。

## VS Code の設定

### 必須拡張機能

- Prettier - Code formatter
- ESLint
- GitLens
- Auto Rename Tag
- Bracket Pair Colorizer

### 設定例

\`\`\`json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
\`\`\`

## Git の設定

### グローバル設定

\`\`\`bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
\`\`\`

### 便利なエイリアス

\`\`\`bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
\`\`\`

## ターミナル環境

### Zsh + Oh My Zsh

\`\`\`bash
# Oh My Zsh のインストール
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
\`\`\`

### 便利なプラグイン

- zsh-autosuggestions
- zsh-syntax-highlighting
- z (ディレクトリジャンプ)

## Docker の活用

### 開発環境の統一

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## まとめ

適切な開発環境の構築により、コーディングに集中できる環境を作ることができます。
    `,
    author: mockAuthors[2],
    publishedAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    category: mockCategories[2],
    tags: [mockTags[12], mockTags[13], mockTags[6]],
    featuredImage:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    seo: {
      metaTitle: "効率的なワークフローのための開発環境構築 | ブログサイト",
      metaDescription:
        "開発者の生産性を向上させるための開発環境の構築方法について解説します。VS Code、Git、ターミナルの設定からDockerまで。",
      keywords: ["開発環境", "VS Code", "Git", "Docker", "ワークフロー"],
    },
    status: "published",
  },
  {
    id: "5",
    title: "Webアクセシビリティの基本と実践",
    slug: "web-accessibility-basics",
    excerpt:
      "すべてのユーザーが利用しやすいWebサイトを作るためのアクセシビリティの基本概念と実装方法について詳しく解説します。",
    content: `
# Webアクセシビリティの基本と実践

Webアクセシビリティは、すべてのユーザーがWebサイトを利用できるようにするための重要な概念です。

## アクセシビリティの4つの原則

### 1. 知覚可能（Perceivable）
- 代替テキストの提供
- 十分なコントラスト比
- 拡大可能なテキスト

### 2. 操作可能（Operable）
- キーボードアクセシビリティ
- 十分な時間の提供
- 発作を引き起こすコンテンツの回避

### 3. 理解可能（Understandable）
- 読みやすいテキスト
- 予測可能な機能
- 入力支援

### 4. 堅牢（Robust）
- 支援技術との互換性
- 標準準拠のマークアップ

## 実装例

### セマンティックHTML

\`\`\`html
<article>
  <header>
    <h1>記事のタイトル</h1>
    <p>投稿日: <time datetime="2024-01-01">2024年1月1日</time></p>
  </header>
  <main>
    <p>記事の内容...</p>
  </main>
</article>
\`\`\`

### ARIA属性の使用

\`\`\`html
<button 
  aria-expanded="false" 
  aria-controls="menu"
  aria-label="メニューを開く"
>
  メニュー
</button>

<ul id="menu" aria-hidden="true">
  <li><a href="/home">ホーム</a></li>
  <li><a href="/about">会社概要</a></li>
</ul>
\`\`\`

### キーボードナビゲーション

\`\`\`typescript
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onClick()
  }
}

<div 
  role="button" 
  tabIndex={0}
  onKeyDown={handleKeyDown}
  onClick={onClick}
>
  クリック可能な要素
</div>
\`\`\`

## ツールとテスト

### 自動テストツール
- axe-core
- Lighthouse
- WAVE

### 手動テスト
- キーボードのみでの操作
- スクリーンリーダーでの確認
- ズーム機能での確認

## まとめ

アクセシビリティは特別な機能ではなく、Web開発の基本的な要素です。すべてのユーザーが利用できるWebサイトを目指しましょう。
    `,
    author: mockAuthors[1],
    publishedAt: new Date("2023-12-28"),
    updatedAt: new Date("2023-12-28"),
    category: mockCategories[0],
    tags: [mockTags[9], mockTags[5], mockTags[13]],
    featuredImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    seo: {
      metaTitle: "Webアクセシビリティの基本と実践 | ブログサイト",
      metaDescription:
        "すべてのユーザーが利用しやすいWebサイトを作るためのアクセシビリティの基本概念と実装方法について詳しく解説します。",
      keywords: ["アクセシビリティ", "HTML", "ARIA", "ユーザビリティ"],
    },
    status: "published",
  },
];

export const mockComments: Comment[] = [
  {
    id: "1",
    postId: "1",
    author: "山田太郎",
    email: "yamada@example.com",
    content:
      "とても参考になる記事でした！Next.js 14の新機能について理解が深まりました。Server Actionsの使い方がとても分かりやすかったです。",
    createdAt: new Date("2024-01-16"),
    status: "approved",
  },
  {
    id: "2",
    postId: "1",
    author: "鈴木花子",
    email: "suzuki.hanako@example.com",
    content:
      "Metadata APIの拡張について詳しく知りたかったので助かりました。実際のプロジェクトで活用してみたいと思います。",
    createdAt: new Date("2024-01-17"),
    status: "approved",
  },
  {
    id: "3",
    postId: "2",
    author: "佐藤一郎",
    email: "sato.ichiro@example.com",
    content:
      "TypeScriptの型定義について、とても実践的な内容でした。Generic Componentの例が特に勉強になりました。",
    createdAt: new Date("2024-01-11"),
    status: "approved",
  },
  {
    id: "4",
    postId: "3",
    author: "田中美咲",
    email: "tanaka.misaki@example.com",
    content:
      "CSS Gridの使い方が分からなかったのですが、この記事のおかげで理解できました。Container Queriesも試してみたいと思います。",
    createdAt: new Date("2024-01-06"),
    status: "approved",
  },
  {
    id: "5",
    postId: "4",
    author: "高橋健太",
    email: "takahashi.kenta@example.com",
    content:
      "開発環境の構築について、網羅的にまとめられていて助かります。VS Codeの設定を見直してみます。",
    createdAt: new Date("2024-01-02"),
    status: "approved",
  },
];
