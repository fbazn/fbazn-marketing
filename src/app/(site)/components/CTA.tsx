// src/app/(site)/components/CTA.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center bg-gray-100 dark:bg-gray-900 py-20 px-6 rounded-xl mt-20"
    >
      <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 dark:text-white">
        Ready to simplify your FBA game?
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
        fbazn helps you make smarter sourcing decisions, track profitability, and stay up to date with Amazon news — all in one place.
      </p>
      <Link
        href="/signup"
        className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition"
      >
        Get Started Free →
      </Link>
    </motion.section>
  )
}
