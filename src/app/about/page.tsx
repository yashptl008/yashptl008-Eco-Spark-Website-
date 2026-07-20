'use client'

import { motion } from 'framer-motion'
import { Sparkles, Target, Eye, Heart, CheckCircle2, Factory, Zap, ShieldCheck, HeartHandshake } from 'lucide-react'

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80 } },
  }

  const values = [
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: 'Integrity First',
      desc: 'Doing what is right, always. We maintain complete transparency in our battery specifications, capacity metrics, and pricing structures.',
    },
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: 'Continuous Innovation',
      desc: 'constantly evolving our tech stack, BMS design, and cell integrations to offer the safest, most efficient lithium storage.',
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-primary" />,
      title: 'Safety Obsessed',
      desc: 'Safety is non-negotiable. Every system is multi-tested and equipped with active protection systems before installation.',
    },
  ]

  const metrics = [
    { title: 'Top Cell Quality', desc: 'Grade-A LiFePO4 cells only' },
    { title: 'Local Support', desc: 'Surat-based engineering team' },
    { title: 'Long Warranty', desc: 'Up to 5+ years replacement cover' },
    { title: 'Zero Maintenance', desc: 'True fit-and-forget designs' },
  ]

  return (
    <div className="pb-24 pt-12 space-y-24">
      {/* Header Banner */}
      <section className="relative bg-gradient-to-tr from-dark via-dark/95 to-primary/25 text-white py-24 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-secondary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm mb-4"
          >
            <Sparkles className="h-3 w-3 text-secondary animate-pulse" />
            <span className="text-[10px] sm:text-xs text-white/90 font-bold uppercase tracking-widest">
              Empowering a Cleaner Future
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-poppins text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
          >
            Our Mission & Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-2xl mx-auto text-sm sm:text-base text-white/70 leading-relaxed"
          >
            Eco Spark Green Energy is a leading installer and provider of modern Lithium Iron Phosphate (LiFePO4) storage systems based in Pandesara, Surat, Gujarat.
          </motion.p>
        </div>
      </section>

      {/* Story & Company Overview */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="font-poppins text-3xl font-bold text-dark tracking-tight">
              Leading the Clean Energy Transition in Gujarat
            </h2>
            <p className="text-dark/80 text-sm sm:text-base leading-relaxed">
              Founded with a vision to eliminate fossil-fuel dependence, Eco Spark Green Energy supplies state-of-the-art power backups and grid energy systems. We integrate Grade-A LiFePO4 batteries with intelligent BMS systems to guarantee safety, zero maintenance, and decades of reliable power.
            </p>
            <p className="text-dark/70 text-sm leading-relaxed">
              From our operational warehouse and test lab in Surat, our team of mechanical and electrical engineers configures, tests, and deploys scalable solar storage and industrial backup setups across the state.
            </p>
          </motion.div>

          {/* Visual Placeholder / Abstract Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-primary/10 to-secondary/5 border border-dark/5 p-12 rounded-3xl min-h-[350px] flex flex-col justify-between overflow-hidden shadow-sm"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/15 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-4">
              <Factory className="h-10 w-10 text-primary" />
              <h3 className="font-poppins text-xl font-bold text-dark">Production & Testing Hub</h3>
              <p className="text-dark/70 text-xs sm:text-sm leading-relaxed">
                Located in Pandesara GIDC, our facility houses cell grading equipment, laser welding cells, and dynamic testing loads to simulate extreme operational demands.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-dark/5 pt-6 mt-6">
              <div>
                <span className="block text-2xl font-bold text-primary font-poppins">100%</span>
                <span className="block text-[10px] text-dark/50 uppercase font-bold tracking-wider">Quality Tested</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-primary font-poppins">Surat</span>
                <span className="block text-[10px] text-dark/50 uppercase font-bold tracking-wider">Gujarat HQ</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission / Vision Cards */}
      <section className="bg-primary/5 py-24 border-y border-primary/5">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Mission Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white p-8 sm:p-10 rounded-2xl border border-dark/5 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center border border-primary/20 text-primary">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-poppins text-xl font-bold text-dark">Our Mission</h3>
              <p className="text-dark/75 text-sm leading-relaxed">
                To build high-performance, cost-effective lithium storage systems that support Gujarat's industrial, solar EPC, and telecom sectors with safer, cleaner energy options.
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white p-8 sm:p-10 rounded-2xl border border-dark/5 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center border border-secondary/20 text-primary">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="font-poppins text-xl font-bold text-dark">Our Vision</h3>
              <p className="text-dark/75 text-sm leading-relaxed">
                To become the premier supplier of integrated smart BESS and renewable storage systems in Western India, enabling seamless decarbonization.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="font-poppins text-3xl font-bold text-dark tracking-tight">Our Core Values</h2>
          <p className="text-dark/70 text-sm">
            Our behavior, designs, and services are governed by strict commitments to customer trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-white border border-dark/5 p-8 rounded-xl shadow-sm text-center flex flex-col items-center space-y-4"
            >
              <div className="bg-primary/5 p-3 rounded-full border border-primary/10">
                {v.icon}
              </div>
              <h3 className="font-poppins text-base font-bold text-dark">{v.title}</h3>
              <p className="text-dark/70 text-xs sm:text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Expanded Why Choose Eco Spark */}
      <section className="bg-dark text-white py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-poppins text-3xl font-bold tracking-tight text-white">
              Why Engineers and EPCs Trust Eco Spark
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              We specialize in resolving complex storage requirements where standard batteries fail. Our custom engineered BESS panels and backup systems offer critical advantages.
            </p>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Active Balancing BMS</h4>
                  <p className="text-xs text-white/60">Maintains voltage alignment across cells, maximizing lifespan and capacity retrieval.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Rigorous Cell Grading</h4>
                  <p className="text-xs text-white/60">Every cell goes through capacity, internal resistance, and cycle degradation tests before pack assembly.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {metrics.map((m, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-2 backdrop-blur-sm">
                <span className="block font-poppins text-sm font-bold text-secondary">{m.title}</span>
                <span className="block text-xs text-white/70">{m.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
