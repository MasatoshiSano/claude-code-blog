'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'

export const SimpleFeaturedArticles = () => {
  const mockArticles = [
    {
      id: '1',
      title: 'モノトーンデザインの美学',
      excerpt: '黒と白の世界で表現される無限の可能性について探求します。シンプルでありながら深みのあるデザインの魅力に迫ります。',
      readingTime: 5,
      category: 'デザイン',
      publishedAt: new Date('2024-01-15'),
      image: '/images/featured-1.jpg'
    },
    {
      id: '2',
      title: 'Next.js 14の新機能解説',
      excerpt: '最新のNext.js 14で追加された革新的な機能について詳しく解説します。開発効率を向上させる新しいアプローチを学びましょう。',
      readingTime: 8,
      category: 'テクノロジー',
      publishedAt: new Date('2024-01-10'),
      image: '/images/featured-2.jpg'
    },
    {
      id: '3',
      title: 'Framer Motionで作る滑らかなアニメーション',
      excerpt: 'Webサイトに生命を吹き込む高品質なアニメーションの実装方法を具体的なコード例とともに紹介します。',
      readingTime: 12,
      category: 'フロントエンド',
      publishedAt: new Date('2024-01-05'),
      image: '/images/featured-3.jpg'
    }
  ]

  return (
    <div>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16"
      >
        <motion.h2
          variants={fadeInUp}
          className="text-3xl lg:text-4xl font-serif font-bold mb-4 text-black dark:text-white"
        >
          注目の記事
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          最新のテクノロジーとデザインに関する厳選された記事をお届けします
        </motion.p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {mockArticles.map((article, index) => (
          <motion.article
            key={article.id}
            variants={fadeInUp}
            className="group cursor-pointer"
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 bg-white/80 dark:bg-black/80 backdrop-blur-sm text-xs font-medium text-black dark:text-white rounded-full">
                    {article.category}
                  </span>
                </div>
                {/* Geometric overlay */}
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-black/5 dark:bg-white/5 transform rotate-45 translate-x-10 translate-y-10" />
              </div>

              <div className="p-6">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-500 mb-3 space-x-4">
                  <time dateTime={article.publishedAt.toISOString()}>
                    {article.publishedAt.toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <span>・</span>
                  <span>{article.readingTime}分で読める</span>
                </div>

                <h3 className="text-xl font-serif font-semibold text-black dark:text-white mb-3 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-200">
                  {article.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="flex items-center text-black dark:text-white text-sm font-medium group-hover:translate-x-2 transition-transform duration-200">
                  続きを読む
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <motion.button
          className="inline-flex items-center px-8 py-3 border-2 border-black dark:border-white text-black dark:text-white font-semibold rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          すべての記事を見る
        </motion.button>
      </motion.div>
    </div>
  )
}