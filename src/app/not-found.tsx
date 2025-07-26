"use client";

import Link from "next/link";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="container max-w-4xl py-16">
      <div className="text-center">
        <div className="max-w-md mx-auto">
          <svg
            className="mx-auto h-24 w-24 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>

          <h1 className="mt-8 text-6xl font-bold text-neutral-900">404</h1>
          <h2 className="mt-4 text-2xl font-semibold text-neutral-700">
            ページが見つかりません
          </h2>
          <p className="mt-4 text-neutral-600">
            お探しのページは存在しないか、移動した可能性があります。
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                ホームに戻る
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => window.history.back()}
            >
              前のページに戻る
            </Button>
          </div>

          <div className="mt-12">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              こちらもおすすめ
            </h3>
            <div className="text-left space-y-2">
              <Link
                href="/"
                className="block text-primary-600 hover:text-primary-700 transition-colors"
              >
                → 最新のブログ記事を見る
              </Link>
              <Link
                href="/?category=technology"
                className="block text-primary-600 hover:text-primary-700 transition-colors"
              >
                → 技術記事を見る
              </Link>
              <Link
                href="/contact"
                className="block text-primary-600 hover:text-primary-700 transition-colors"
              >
                → お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
