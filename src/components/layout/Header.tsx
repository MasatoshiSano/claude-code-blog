"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import SearchClient from "@/components/ui/SearchClient";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-neutral-200/50 sticky top-0 z-50">
      <div className="container max-w-6xl">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-2xl font-bold text-neutral-900 hover:text-primary-600 transition-all duration-300"
            >
              <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                Blog
              </span>
              <span className="text-neutral-800 ml-1">Site</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-neutral-700 hover:text-primary-600 transition-colors"
              >
                ホーム
              </Link>
              <Link
                href="/contact"
                className="text-neutral-700 hover:text-primary-600 transition-colors"
              >
                お問い合わせ
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block w-64">
              <SearchClient placeholder="記事を検索..." />
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-neutral-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                ホーム
              </Link>
              <Link
                href="/contact"
                className="text-neutral-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                お問い合わせ
              </Link>
              <div className="pt-4">
                <SearchClient placeholder="記事を検索..." />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
