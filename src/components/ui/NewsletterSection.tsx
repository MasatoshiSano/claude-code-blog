'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'

export const NewsletterSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-background via-surface to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-primary/20 rounded-full" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-primary/10 rounded-lg transform rotate-45" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary/10 rounded-full" />
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
            className="text-3xl lg:text-4xl font-serif font-bold mb-6"
          >
            最新記事をお届け
          </motion.h2>
          
          <motion.p
            variants={fadeInUp}
            className="text-lg text-secondary mb-8 max-w-2xl mx-auto"
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
                className="w-full px-6 py-4 bg-background border-2 border-border rounded-full text-primary placeholder-quaternary focus:border-primary focus:outline-none transition-colors duration-200"
                aria-label="メールアドレス"
              />
            </div>
            <motion.button
              className="px-8 py-4 bg-primary text-background font-semibold rounded-full hover:opacity-90 transition-opacity duration-200 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              購読する
            </motion.button>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-xs text-quaternary mt-4"
          >
            いつでも購読解除できます。プライバシーポリシーをご確認ください。
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border/50"
          >
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-primary mb-2">
                1,200+
              </div>
              <div className="text-sm text-secondary">
                購読者
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-primary mb-2">
                50+
              </div>
              <div className="text-sm text-secondary">
                記事
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-primary mb-2">
                98%
              </div>
              <div className="text-sm text-secondary">
                満足度
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}