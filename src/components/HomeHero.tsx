'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Leaf, Zap, ShieldAlert } from 'lucide-react'

export default function HomeHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-tr from-dark via-dark/95 to-primary/30 py-20 px-4 sm:px-6 lg:px-8">
      {/* Cinematic Animated Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* Animated Gradient Blob 1 */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/20 blur-[120px] pointer-events-none"
        />
        {/* Animated Gradient Blob 2 */}
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -60, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-secondary/15 blur-[150px] pointer-events-none"
        />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md"
        >
          <Leaf className="h-4 w-4 text-secondary animate-bounce" />
          <span className="text-xs text-white/90 font-semibold tracking-wider uppercase">
            Surat, Gujarat's Trusted Renewable Energy Partner
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="font-poppins text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]"
        >
          Powering Gujarat with <br />
          <span className="bg-gradient-to-r from-secondary via-white to-secondary bg-clip-text text-transparent">
            Smart Energy Solutions
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-white/80 font-medium leading-relaxed"
        >
          Advanced Lithium Battery Systems (LiFePO4) &middot; Battery Energy Storage Solutions (BESS) &middot; Smart Grid Integration for Industrial & Commercial Operations.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-secondary hover:bg-secondary/90 text-dark px-8 py-4 rounded-xl text-base font-bold tracking-wide shadow-lg hover:shadow-xl transition-all"
          >
            <span>Explore Products</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white/10 hover:bg-white/15 text-white border border-white/20 px-8 py-4 rounded-xl text-base font-semibold tracking-wide backdrop-blur-sm transition-all"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>

      {/* Bottom overlay curve */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  )
}
