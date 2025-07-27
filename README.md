# Claude Code Blog

モダンなブログアプリケーション - Django REST Framework + Next.js 14

## 🌟 特徴

- **フロントエンド**: Next.js 14 App Router, TypeScript, Tailwind CSS
- **バックエンド**: Django 4.2, Django REST Framework, PostgreSQL
- **認証**: NextAuth.js + JWT (Simple JWT)
- **ソーシャルログイン**: Google, GitHub
- **スタイリング**: Tailwind CSS, モノトーンデザイン
- **状態管理**: Zustand + TanStack Query
- **キャッシュ**: Redis
- **コンテナ**: Docker Compose

## 🚀 クイックスタート

### 前提条件

- Node.js 18+
- Python 3.9+
- Docker & Docker Compose (推奨)

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd claude-code-blog
```

### 2. 環境変数の設定

```bash
# フロントエンド環境変数
cp .env.example .env.local

# バックエンド環境変数
cp backend/.env.example backend/.env
```

### 3. Docker Composeで起動 (推奨)

```bash
# サービス起動
npm run docker:up

# 初回セットアップ
npm run backend:migrate
npm run backend:loaddata
```

### 4. 個別起動（開発用）

```bash
# 依存関係インストール
npm install
cd backend && pip install -r requirements.txt

# バックエンド起動 (ターミナル1)
cd backend && python manage.py runserver

# フロントエンド起動 (ターミナル2)
npm run dev
```

### 5. アクセス

- **フロントエンド**: http://localhost:3003
- **バックエンドAPI**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin

## 📁 プロジェクト構造

```
claude-code-blog/
├── src/                    # Next.js フロントエンド
│   ├── app/               # App Router ページ
│   ├── components/        # React コンポーネント
│   ├── lib/              # ユーティリティ・API クライアント
│   ├── hooks/            # カスタムフック
│   ├── types/            # TypeScript 型定義
│   └── data/             # モックデータ
├── backend/               # Django バックエンド
│   ├── blog_project/     # Django プロジェクト設定
│   ├── blog/             # ブログアプリ
│   ├── authentication/   # 認証アプリ
│   └── requirements.txt  # Python 依存関係
├── scripts/              # ユーティリティスクリプト
├── docker-compose.yml    # Docker 設定
└── INTEGRATION.md       # 統合ガイド
```

## 🛠️ 開発コマンド

### フロントエンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド
npm run lint         # ESLint実行
npm run type-check   # TypeScriptチェック
```

### バックエンド

```bash
npm run backend:migrate    # データベースマイグレーション
npm run backend:loaddata   # モックデータ読み込み
```

### Docker

```bash
npm run docker:up     # サービス起動
npm run docker:down   # サービス停止
```

### テスト

```bash
npm run test:integration  # 統合テスト実行
```

## 🎨 主要機能

### ✅ 実装済み機能

- [x] ブログ記事の表示・一覧
- [x] カテゴリ・タグによるフィルタリング
- [x] 全文検索
- [x] ページネーション
- [x] レスポンシブデザイン
- [x] コメントシステム
- [x] ユーザー認証 (JWT + NextAuth.js)
- [x] ソーシャルログイン (Google, GitHub)
- [x] SEO最適化
- [x] Django REST API
- [x] Redis キャッシュ
- [x] セキュリティ対策
- [x] 統合テスト

### 🔮 今後の機能

- [ ] 記事作成・編集機能
- [ ] 管理画面の強化
- [ ] 画像アップロード
- [ ] メール通知
- [ ] PWA対応
- [ ] 多言語対応

## 🔧 技術スタック

### フロントエンド

- **Next.js 14**: React フレームワーク (App Router)
- **TypeScript**: 型安全性
- **Tailwind CSS**: スタイリング
- **NextAuth.js**: 認証
- **TanStack Query**: サーバー状態管理
- **Zustand**: クライアント状態管理
- **React Hook Form**: フォーム管理
- **Zod**: バリデーション

### バックエンド

- **Django 4.2**: Webフレームワーク
- **Django REST Framework**: API開発
- **Simple JWT**: JWT認証
- **django-allauth**: ソーシャル認証
- **PostgreSQL**: データベース
- **Redis**: キャッシュ・セッション
- **django-cors-headers**: CORS対応

### インフラ・ツール

- **Docker**: コンテナ化
- **PostgreSQL**: 本番データベース
- **Redis**: キャッシュ
- **ESLint**: コード品質
- **Prettier**: コードフォーマット

## 🔐 セキュリティ

実装済みセキュリティ機能：

- JWT認証による安全なAPI アクセス
- CORS設定
- CSRF保護
- XSS防止
- SQL インジェクション対策
- セキュリティヘッダー
- レート制限
- 入力値検証

## 📚 ドキュメント

- [統合ガイド](./INTEGRATION.md) - バックエンド・フロントエンド統合の詳細
- [API ドキュメント](http://localhost:8000/api/schema/) - Django REST Framework
- [フロントエンド コンポーネント](./src/components/) - コンポーネント構造

## 🚢 デプロイ

### 本番環境設定

1. 環境変数の設定
   - `DEBUG=False`
   - `NEXT_PUBLIC_USE_API=true`
   - セキュアなシークレットキー
   - 本番ドメインのCORS設定

2. ビルド・起動

```bash
# フロントエンド
npm run build
npm run start

# バックエンド
python manage.py collectstatic
python manage.py migrate
gunicorn blog_project.wsgi:application
```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### 開発ルール

- TypeScript strict モードを使用
- ESLint・Prettier でコード品質を維持
- テストの追加・実行
- コミットメッセージは[Conventional Commits](https://conventionalcommits.org/)に従う

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🙏 謝辞

- [Next.js](https://nextjs.org/) - React フレームワーク
- [Django](https://www.djangoproject.com/) - Python Webフレームワーク
- [Tailwind CSS](https://tailwindcss.com/) - CSSフレームワーク
- [Unsplash](https://unsplash.com/) - 画像素材

## 📞 サポート

質問やイシューがある場合は、GitHubのIssuesを作成してください。

---

**Claude Code Blog** - モダンなブログアプリケーションの完全な実装例