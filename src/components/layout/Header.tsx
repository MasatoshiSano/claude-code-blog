"use client";

import { useState } from "react";
import { Button, Container } from "@/components/ui";
import { Logo, Navigation } from "@/components/layout";
import SearchClient from "@/components/ui/SearchClient";
import { usePathname } from "next/navigation";

interface HeaderProps {
  className?: string;
  sticky?: boolean;
  transparent?: boolean;
  navigationItems?: Array<{
    href: string;
    label: string;
    isActive?: boolean;
  }>;
}

const Header = ({ 
  className,
  sticky = true,
  transparent = true,
  navigationItems,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const defaultNavigationItems = [
    { href: "/", label: "ホーム", isActive: pathname === "/" },
    { href: "/contact", label: "お問い合わせ", isActive: pathname === "/contact" },
  ];

  const items = navigationItems || defaultNavigationItems;

  const headerClasses = [
    "border-b border-neutral-200/50 z-50",
    sticky && "sticky top-0",
    transparent ? "bg-white/80 backdrop-blur-md" : "bg-white",
    className,
  ].filter(Boolean).join(" ");

  return (
    <header className={headerClasses}>
      <Container center padding>
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <Logo size="md" />

            <div className="hidden md:block">
              <Navigation 
                items={items}
                variant="default"
                size="md"
              />
            </div>
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
              aria-label="メニューを開く"
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
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-4">
            <Navigation
              items={items}
              direction="vertical"
              variant="default"
              size="md"
              onItemClick={() => setIsMenuOpen(false)}
            />
            <div className="pt-4">
              <SearchClient placeholder="記事を検索..." />
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

export { Header, type HeaderProps };
export default Header;
