import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-neutral-300 py-16 mt-32">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <span className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                Blog
              </span>
              <span className="text-3xl font-bold text-white ml-1">Site</span>
            </div>
            <p className="text-neutral-400 mb-6 leading-relaxed">
              美しいデザインと読みやすさを追求したブログサイト。技術記事から日常まで、質の高いコンテンツをお届けします。
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              サイトマップ
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  ホーム
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">カテゴリ</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/?category=technology"
                  className="hover:text-white transition-colors"
                >
                  技術
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=lifestyle"
                  className="hover:text-white transition-colors"
                >
                  ライフスタイル
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=tutorial"
                  className="hover:text-white transition-colors"
                >
                  チュートリアル
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 text-center">
          <p className="text-neutral-400">
            © {currentYear} ブログサイト. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
