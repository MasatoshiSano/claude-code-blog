FROM python:3.11-slim

# 環境変数設定
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 作業ディレクトリの設定
WORKDIR /app

# システムの依存関係をインストール
RUN apt-get update && apt-get install -y \
    postgresql-client \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Pythonの依存関係をインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードをコピー
COPY . .

# 権限設定
RUN chmod +x manage.py

# ポートを公開
EXPOSE 8000

# 開発サーバーを起動
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]