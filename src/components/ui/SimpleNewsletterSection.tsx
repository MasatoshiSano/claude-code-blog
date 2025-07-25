'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'

export const SimpleNewsletterSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-black/20 dark:border-white/20 rounded-full" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-black/10 dark:bg-white/10 rounded-lg transform rotate-45" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-black/10 dark:border-white/10 rounded-full" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl lg:text-4xl font-serif font-bold mb-6 text-black dark:text-white"
          >
            最新記事をお届け
          </motion.h2>
          
          <motion.p
            variants={fadeInUp}
            className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            新しい記事やデザインのインスピレーション、
            <br className="hidden sm:block" />
            テクノロジーの最新トレンドを定期的にお送りします
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <div className="flex-1">
              <input
                type="email"
                placeholder="メールアドレスを入力"
                className="w-full px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-black dark:focus:border-white focus:outline-none transition-colors duration-200"
                aria-label="メールアドレス"
              />
            </div>
            <motion.button
              className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-full hover:opacity-90 transition-opacity duration-200 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              購読する
            </motion.button>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-xs text-gray-500 dark:text-gray-500 mt-4"
          >
            いつでも購読解除できます。プライバシーポリシーをご確認ください。
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-black dark:text-white mb-2">
                1,200+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                購読者
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-black dark:text-white mb-2">
                50+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                記事
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-black dark:text-white mb-2">
                98%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                満足度
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}