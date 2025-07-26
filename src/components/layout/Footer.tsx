import { ReactNode } from "react";
import { Container, Logo, Navigation } from "@/components/layout";

interface FooterSection {
  title: string;
  items: Array<{
    href: string;
    label: string;
    external?: boolean;
  }>;
}

interface FooterProps {
  className?: string;
  variant?: "default" | "minimal";
  description?: string;
  sections?: FooterSection[];
  showLogo?: boolean;
  copyrightText?: string;
  socialLinks?: Array<{
    href: string;
    label: string;
    icon: ReactNode;
  }>;
}

const Footer = ({
  className,
  variant = "default",
  description = "美しいデザインと読みやすさを追求したブログサイト。技術記事から日常まで、質の高いコンテンツをお届けします。",
  sections,
  showLogo = true,
  copyrightText,
  socialLinks,
}: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const defaultSections: FooterSection[] = [
    {
      title: "サイトマップ",
      items: [
        { href: "/", label: "ホーム" },
        { href: "/contact", label: "お問い合わせ" },
      ],
    },
    {
      title: "カテゴリ",
      items: [
        { href: "/?category=technology", label: "技術" },
        { href: "/?category=lifestyle", label: "ライフスタイル" },
        { href: "/?category=tutorial", label: "チュートリアル" },
      ],
    },
  ];

  const footerSections = sections || defaultSections;
  const copyright = copyrightText || `© ${currentYear} ブログサイト. All rights reserved.`;

  if (variant === "minimal") {
    return (
      <footer className={`bg-neutral-100 py-8 mt-16 ${className || ""}`}>
        <Container center padding>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {showLogo && <Logo size="sm" />}
            <p className="text-sm text-neutral-600">{copyright}</p>
          </div>
        </Container>
      </footer>
    );
  }

  return (
    <footer className={`bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-neutral-300 py-16 mt-32 ${className || ""}`}>
      <Container center padding>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            {showLogo && (
              <div className="mb-6">
                <Logo 
                  size="lg"
                  textClassName="text-white"
                />
              </div>
            )}
            <p className="text-neutral-400 mb-6 leading-relaxed">
              {description}
            </p>
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors"
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold text-white mb-4">
                {section.title}
              </h4>
              <Navigation
                items={section.items}
                direction="vertical"
                variant="default"
                size="sm"
                itemClassName="text-neutral-300 hover:text-white transition-colors py-1"
              />
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 text-center">
          <p className="text-neutral-400">{copyright}</p>
        </div>
      </Container>
    </footer>
  );
};

export { Footer, type FooterProps, type FooterSection };
export default Footer;
