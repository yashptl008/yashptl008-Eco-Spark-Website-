'use client'

import { motion } from 'framer-motion'

interface StatItem {
  value: string
  label: string
  suffix: string
}

const stats: StatItem[] = [
  { value: '10', label: 'Years of Experience', suffix: '+' },
  { value: '150', label: 'Projects Completed', suffix: '+' },
  { value: '2000', label: 'Customers Served', suffix: '+' },
  { value: '24/7', label: 'Service & Support', suffix: '' },
]

export default function StatsCounter() {
  return (
    <div className="bg-white relative z-10 -mt-10 max-w-5xl mx-auto rounded-2xl shadow-xl border border-dark/5 p-8 sm:p-10 grid grid-cols-2 md:grid-cols-4 gap-8 divide-y-2 md:divide-y-0 md:divide-x divide-dark/5">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="text-center pt-6 first:pt-0 md:pt-0 flex flex-col justify-center"
        >
          <span className="block font-poppins text-3xl sm:text-4xl font-extrabold text-primary">
            {stat.value}
            <span className="text-secondary">{stat.suffix}</span>
          </span>
          <span className="block mt-2 text-xs sm:text-sm font-semibold text-dark/70 tracking-wide uppercase">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
