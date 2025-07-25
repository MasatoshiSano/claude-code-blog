import { SimpleHeroSection } from '@/components/ui/SimpleHeroSection'
import { SimpleFeaturedArticles } from '@/components/blog/SimpleFeaturedArticles'
import { SimpleNewsletterSection } from '@/components/ui/SimpleNewsletterSection'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <SimpleHeroSection />
      
      {/* Featured Articles */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SimpleFeaturedArticles />
        </div>
      </section>
      
      {/* Newsletter Section */}
      <SimpleNewsletterSection />
      
      {/* Latest Articles */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-center mb-12 text-black dark:text-white">
            最新記事
          </h2>
          <div className="text-center text-gray-600 dark:text-gray-400">
            記事はまだありません。コンテンツを追加してください。
          </div>
        </div>
      </section>
    </div>
  )
}