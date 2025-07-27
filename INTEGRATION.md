# 統合ガイド - Django REST API + Next.js フロントエンド

このドキュメントは、Django REST APIバックエンドとNext.jsフロントエンドの統合に関する包括的なガイドです。

## 🏗️ アーキテクチャ概要

### バックエンド (Django)
- **フレームワーク**: Django 4.2 + Django REST Framework
- **認証**: JWT (Simple JWT) + django-allauth
- **データベース**: PostgreSQL (本番) / SQLite (開発)
- **キャッシュ**: Redis
- **ポート**: 8000

### フロントエンド (Next.js)
- **フレームワーク**: Next.js 14 with App Router
- **認証**: NextAuth.js
- **状態管理**: Zustand + TanStack Query
- **スタイリング**: Tailwind CSS
- **ポート**: 3003

## 🚀 セットアップ手順

### 1. 環境変数の設定

#### バックエンド (.env)
```bash
# Django設定
DEBUG=True
SECRET_KEY=your-django-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

# データベース
DATABASE_URL=postgresql://user:password@localhost:5432/blog_db

# Redis
REDIS_URL=redis://localhost:6379/0

# CORS設定
CORS_ALLOWED_ORIGINS=http://localhost:3003

# JWT設定
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=60
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7

# ソーシャル認証
GOOGLE_OAUTH2_CLIENT_ID=your-google-client-id
GOOGLE_OAUTH2_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

#### フロントエンド (.env.local)
```bash
# API設定
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_USE_API=true

# NextAuth.js設定
NEXTAUTH_URL=http://localhost:3003
NEXTAUTH_SECRET=your-nextauth-secret-key

# ソーシャル認証
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

### 2. 依存関係のインストール

#### バックエンド
```bash
cd backend
pip install -r requirements.txt
```

#### フロントエンド
```bash
npm install
```

### 3. データベース設定

```bash
# マイグレーション実行
npm run backend:migrate

# モックデータ読み込み
npm run backend:loaddata
```

### 4. 開発サーバー起動

#### Docker Compose使用（推奨）
```bash
npm run docker:up
```

#### 個別起動
```bash
# バックエンド (ターミナル1)
cd backend
python manage.py runserver

# フロントエンド (ターミナル2)
npm run dev
```

## 📡 API統合

### データフロー切り替え

環境変数 `NEXT_PUBLIC_USE_API` でモックデータとAPI間の切り替えが可能：

- `true`: Django API使用
- `false`: モックデータ使用（開発用）

### API エンドポイント

| エンドポイント | メソッド | 説明 |
|---------------|---------|------|
| `/api/blog/posts/` | GET, POST | ブログ記事一覧・作成 |
| `/api/blog/posts/{id}/` | GET, PUT, DELETE | ブログ記事詳細・更新・削除 |
| `/api/blog/categories/` | GET | カテゴリ一覧 |
| `/api/blog/tags/` | GET | タグ一覧 |
| `/api/blog/comments/` | GET, POST | コメント一覧・作成 |
| `/api/auth/jwt/token/` | POST | JWTトークン取得 |
| `/api/auth/jwt/token/refresh/` | POST | JWTトークン更新 |

### 認証フロー

1. **ユーザーログイン** → NextAuth.js がDjango APIを呼び出し
2. **JWTトークン取得** → セッションに保存
3. **API呼び出し** → Authorization ヘッダーにトークン設定
4. **トークン更新** → リフレッシュトークンで自動更新

## 🧪 テスト

### 統合テスト実行
```bash
npm run test:integration
```

### 個別テスト

#### バックエンドテスト
```bash
cd backend
python manage.py test
```

#### フロントエンドテスト
```bash
npm run lint
npm run type-check
```

## 🔧 トラブルシューティング

### よくある問題

#### 1. CORS エラー
**症状**: フロントエンドからAPIアクセス時にCORSエラー
**解決**: `backend/blog_project/settings/development.py` のCORS設定確認

#### 2. 認証エラー
**症状**: NextAuth.js でログインできない
**解決**: 
- 環境変数の確認
- DjangoのJWT設定確認
- NextAuth.js の設定確認

#### 3. データベース接続エラー
**症状**: Django起動時にデータベースエラー
**解決**:
- PostgreSQL起動確認
- データベース設定確認
- マイグレーション実行

#### 4. ポート衝突
**症状**: サーバー起動時にポートエラー
**解決**:
- プロセス終了: `sudo lsof -ti:3003 | xargs kill -9`
- ポート変更: package.json のdevスクリプト修正

## 📚 API使用例

### ブログ記事取得
```typescript
import { getBlogPosts } from '@/lib/data';

const { posts, pagination } = await getBlogPosts({
  page: 1,
  category: 'technology',
  query: 'React'
});
```

### 認証状態確認
```typescript
import { useAuth } from '@/hooks/useAuth';

const { user, isAuthenticated, login, logout } = useAuth();
```

### コメント投稿
```typescript
import { addComment } from '@/lib/data';

const comment = await addComment({
  postId: '1',
  author: 'ユーザー名',
  email: 'user@example.com',
  content: 'コメント内容'
});
```

## 🚢 本番デプロイ

### 環境変数の設定
- `DEBUG=False`
- `NEXT_PUBLIC_USE_API=true`
- セキュアなシークレットキー設定
- 本番ドメインのCORS設定

### ビルド
```bash
# フロントエンド
npm run build
npm run start

# バックエンド
python manage.py collectstatic
python manage.py migrate
```

## 📊 監視とログ

### ログ確認
```bash
# Django
tail -f backend/django.log

# Next.js
# ブラウザのDevToolsコンソール確認
```

### パフォーマンス監視
- Django: django-debug-toolbar
- Next.js: Web Vitals, Vercel Analytics

## 🔐 セキュリティ

### 実装済みセキュリティ機能
- JWT認証
- CORS設定
- CSRF保護
- XSS防止
- セキュリティヘッダー
- レート制限

### セキュリティチェックリスト
- [ ] 本番環境でのDEBUG=False設定
- [ ] セキュアなシークレットキー使用
- [ ] HTTPS設定
- [ ] 適切なCORS設定
- [ ] 環境変数の適切な管理

## 📈 パフォーマンス最適化

### バックエンド
- Redis キャッシュ
- データベースインデックス
- API レスポンス圧縮
- ページネーション

### フロントエンド
- Next.js Image Optimization
- コード分割
- ISR (Incremental Static Regeneration)
- TanStack Query キャッシュ

## 🤝 コントリビューション

1. フィーチャーブランチ作成
2. 変更実装
3. テスト実行
4. プルリクエスト作成

```bash
git checkout -b feature/new-feature
# 変更実装
npm run test:integration
git commit -m "feat: 新機能追加"
git push origin feature/new-feature
```

## 📞 サポート

技術的な問題や質問については、以下を参照してください：

- Django REST Framework: https://www.django-rest-framework.org/
- Next.js: https://nextjs.org/docs
- NextAuth.js: https://next-auth.js.org/
- TailwindCSS: https://tailwindcss.com/docs