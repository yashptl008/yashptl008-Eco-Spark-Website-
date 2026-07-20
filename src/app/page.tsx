import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Zap, BatteryCharging, Wrench, Building2, TowerControl, Activity, HeartPulse, Sparkles, MessageSquare } from 'lucide-react'
import HomeHero from '@/components/HomeHero'
import StatsCounter from '@/components/StatsCounter'
import FeaturedCarousel, { type Product } from '@/components/FeaturedCarousel'

export const revalidate = 0 // Disable cache for landing page so updates show immediately

export default async function HomePage() {
  let featuredProducts: Product[] = []
  
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('id, name, slug, category, short_description, images, specs')
      .eq('status', 'active')
      .eq('featured', true)
      
    if (data) {
      // Cast the jsonb specs into typed array
      featuredProducts = data.map((item: any) => ({
        ...item,
        specs: Array.isArray(item.specs) ? item.specs : [],
      }))
    }
  } catch (err) {
    console.error('Error fetching featured products:', err)
  }

  const whyChooseUs = [
    {
      icon: <BatteryCharging className="h-8 w-8 text-primary" />,
      title: 'Advanced LiFePO4 Technology',
      desc: 'Top-tier cell quality delivering longer lifecycles, superior thermal stability, and maximum energy density.',
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: 'Certified Safety Standards',
      desc: 'Integrated smart Battery Management Systems (BMS) protecting against short circuits, overcharging, and heating.',
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: 'High Efficiency Systems',
      desc: 'Optimized conversion rates designed for solar energy systems and industrial battery back-ups.',
    },
    {
      icon: <Wrench className="h-8 w-8 text-primary" />,
      title: 'End-to-End Execution',
      desc: 'From initial feasibility analysis to installation, testing, and periodic maintenance by expert engineers.',
    },
  ]

  const industries = [
    { icon: <Building2 className="h-6 w-6" />, name: 'Industrial Plants' },
    { icon: <TowerControl className="h-6 w-6" />, name: 'Power Utilities' },
    { icon: <Activity className="h-6 w-6" />, name: 'Solar EPC Developers' },
    { icon: <Activity className="h-6 w-6" />, name: 'Telecom Towers' },
    { icon: <HeartPulse className="h-6 w-6" />, name: 'Hospitals & Healthcare' },
    { icon: <Building2 className="h-6 w-6" />, name: 'Data Centers' },
  ]

  const testimonials = [
    {
      quote: "Eco Spark's BESS installation has completely resolved our factory's peak power demands. Their engineering support during the commissioning phase was exceptional.",
      author: "Rajesh Patel",
      role: "Operations Director, Gujarat Synthetics",
    },
    {
      quote: "The LiFePO4 battery banks we purchased for our corporate solar array operate flawlessly. High safety, zero maintenance, and remarkable efficiency.",
      author: "Meera Mehta",
      role: "Infrastructure Head, SunVolt EPC Solutions",
    },
  ]

  return (
    <div className="space-y-24 pb-24">
      {/* Cinematic Hero */}
      <HomeHero />

      {/* Trust Statistics Strip */}
      <div className="px-4">
        <StatsCounter />
      </div>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20">
            <Sparkles className="h-3 w-3" />
            <span>Featured Solutions</span>
          </div>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-dark tracking-tight">
            High Performance Energy Storage
          </h2>
          <p className="text-dark/70 text-sm sm:text-base">
            Engineered for reliability, long lifecycles, and maximum safety. Explore our featured products running across industrial and utility environments.
          </p>
        </div>

        <FeaturedCarousel products={featuredProducts} />
      </section>

      {/* Why Choose Us */}
      <section className="bg-primary/5 py-24 border-y border-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-dark tracking-tight">
              Why Eco Spark Green Energy?
            </h2>
            <p className="text-dark/70 text-sm sm:text-base">
              We lead the way in premium storage technology, ensuring businesses and communities have access to clean, reliable power systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-dark/5 hover:border-primary/20 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="bg-primary/5 w-14 h-14 rounded-xl flex items-center justify-center border border-primary/10">
                    {item.icon}
                  </div>
                  <h3 className="font-poppins text-lg font-bold text-dark leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-dark/70 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-dark tracking-tight">
            Industries We Empower
          </h2>
          <p className="text-dark/70 text-sm sm:text-base">
            Providing custom storage configurations to support power continuity across heavy sectors.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {industries.map((ind, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl border border-dark/5 text-center flex flex-col items-center justify-center space-y-3 hover:border-secondary/35 hover:shadow-md transition-all duration-300"
            >
              <div className="text-primary bg-secondary/10 p-3 rounded-full">
                {ind.icon}
              </div>
              <span className="font-poppins text-xs sm:text-sm font-bold text-dark/90 leading-tight">
                {ind.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-dark text-white py-24 relative overflow-hidden">
        {/* Abstract design elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Proven Track Record
            </h2>
            <p className="text-white/70 text-sm sm:text-base">
              Read how industries across Gujarat depend on Eco Spark for uninterruptible clean power backups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((test, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col justify-between space-y-6 backdrop-blur-sm"
              >
                <div className="space-y-4">
                  <MessageSquare className="h-8 w-8 text-secondary" />
                  <p className="text-white/90 text-sm sm:text-base italic leading-relaxed">
                    "{test.quote}"
                  </p>
                </div>
                <div>
                  <h4 className="font-poppins text-sm font-bold text-white leading-none">
                    {test.author}
                  </h4>
                  <p className="text-xs text-white/50 mt-1 leading-none">
                    {test.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
          {/* Subtle green decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to Transition to Smarter Energy?
          </h2>
          <p className="max-w-xl mx-auto text-white/80 text-sm sm:text-base leading-relaxed">
            Get in touch with our product team today to request configurations, battery capacity sizing, or technical pricing models.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-primary hover:bg-white/90 px-6 py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-md"
            >
              Contact Our Sales Team
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center border border-white/30 hover:border-white/50 text-white bg-white/5 hover:bg-white/10 px-6 py-3.5 rounded-xl font-semibold tracking-wide backdrop-blur-sm transition-all"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
