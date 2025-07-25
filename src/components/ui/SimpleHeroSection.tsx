'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { fadeInUp, staggerContainer, floatingAnimation } from '@/lib/animations'

export const SimpleHeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black">
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 border border-gray-200 dark:border-gray-800 rounded-full"
          variants={floatingAnimation}
          animate="animate"
          style={{ animationDelay: '0s' }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-black/5 dark:bg-white/5 rounded-lg transform rotate-45"
          variants={floatingAnimation}
          animate="animate"
          style={{ animationDelay: '1s' }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-12 h-12 border-2 border-gray-300 dark:border-gray-700 rounded-full"
          variants={floatingAnimation}
          animate="animate"
          style={{ animationDelay: '2s' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-24 h-1 bg-black/10 dark:bg-white/10"
          variants={floatingAnimation}
          animate="animate"
          style={{ animationDelay: '0.5s' }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-4xl mx-auto"
        >
          {/* Subtitle */}
          <motion.div
            variants={fadeInUp}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400">
              限界を超えた デザイン
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold leading-tight mb-8"
          >
            <span className="block text-black dark:text-white">モノトーン</span>
            <span className="block bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              ブログ
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12"
          >
            黒、白、グレースケールの世界で紡がれる
            <br className="hidden sm:block" />
            スタイリッシュでクールな体験
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/blog"
                className="inline-flex items-center px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-full hover:opacity-90 transition-opacity text-lg group"
              >
                記事を読む
                <motion.svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </motion.svg>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-4 border-2 border-black dark:border-white text-black dark:text-white font-semibold rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 text-lg"
              >
                About
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={fadeInUp}
            className="mt-20"
          >
            <motion.div
              className="mx-auto w-6 h-10 border-2 border-gray-300 dark:border-gray-700 rounded-full flex justify-center"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                className="w-1 h-3 bg-black dark:bg-white rounded-full mt-2"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 uppercase tracking-wider">
              Scroll
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(0,0,0,0.1) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }} />
      </div>
    </section>
  )
}