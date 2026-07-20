import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Sparkles, MessageCircle, BarChart3, Database, FileText, CheckCircle2, AlertTriangle } from 'lucide-react'

export const revalidate = 0 // Disable cache for Admin Overview dashboard

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Define date limits
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const dateLimit = thirtyDaysAgo.toISOString()

  let totalProducts = 0
  let whatsappClicks = 0
  let pageViews = 0
  let totalLeads = 0
  let recentProducts: any[] = []
  let recentLeads: any[] = []

  try {
    // 1. Total Products
    const { count: prodCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
    totalProducts = prodCount || 0

    // 2. WhatsApp click-throughs (last 30 days)
    const { count: waCount } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'whatsapp_click')
      .gte('created_at', dateLimit)
    whatsappClicks = waCount || 0

    // 3. Page Views (last 30 days)
    const { count: pvCount } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'page_view')
      .gte('created_at', dateLimit)
    pageViews = pvCount || 0

    // 4. Total Form Leads
    const { count: leadCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
    totalLeads = leadCount || 0

    // 5. Recent Products
    const { data: prods } = await supabase
      .from('products')
      .select('id, name, category, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    recentProducts = prods || []

    // 6. Recent Leads
    const { data: leads } = await supabase
      .from('leads')
      .select('id, name, email, phone, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    recentLeads = leads || []
  } catch (err) {
    console.error('Error fetching admin statistics:', err)
  }

  const statCards = [
    {
      title: 'Total Catalog Products',
      value: totalProducts,
      icon: <Database className="h-6 w-6 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-100',
    },
    {
      title: 'WhatsApp Click-throughs (30d)',
      value: whatsappClicks,
      icon: <MessageCircle className="h-6 w-6 text-green-600" />,
      bg: 'bg-green-50 border-green-100',
    },
    {
      title: 'Page Views (30d)',
      value: pageViews,
      icon: <BarChart3 className="h-6 w-6 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-100',
    },
    {
      title: 'Total Inquiries (Leads)',
      value: totalLeads,
      icon: <FileText className="h-6 w-6 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-100',
    },
  ]

  return (
    <div className="space-y-12">
      {/* Welcome Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-poppins text-3xl font-bold text-dark">
            Dashboard Overview
          </h1>
          <p className="text-dark/70 text-sm mt-1">
            Real-time analytics and data summary for Eco Spark Green Energy.
          </p>
        </div>
        <div className="text-xs font-bold text-dark/40 bg-dark/5 px-4 py-2 rounded-lg shrink-0">
          Last 30 Days stats
        </div>
      </div>

      {/* Grid of Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl border ${card.bg} shadow-sm flex items-center justify-between`}
          >
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-dark/60 uppercase tracking-wider">
                {card.title}
              </span>
              <span className="block text-3xl font-extrabold text-dark">
                {card.value}
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-inner shrink-0">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Lists of Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recently Added Products */}
        <div className="bg-white border border-dark/5 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-dark/5 pb-4">
            <h3 className="font-poppins text-base font-bold text-dark">
              Recently Added Products
            </h3>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-primary hover:underline"
            >
              Manage Catalog
            </Link>
          </div>

          {recentProducts.length > 0 ? (
            <div className="divide-y divide-dark/5">
              {recentProducts.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="block text-sm font-semibold text-dark">{p.name}</span>
                    <span className="block text-[10px] text-dark/50 uppercase font-bold tracking-wider mt-0.5">
                      {p.category}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      p.status === 'active'
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-dark/40">
              No products found in database.
            </div>
          )}
        </div>

        {/* Recently Received Leads */}
        <div className="bg-white border border-dark/5 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-dark/5 pb-4">
            <h3 className="font-poppins text-base font-bold text-dark">
              Recent Sales Leads
            </h3>
            <span className="text-[10px] text-dark/40 font-bold uppercase tracking-wider">
              From Forms
            </span>
          </div>

          {recentLeads.length > 0 ? (
            <div className="divide-y divide-dark/5">
              {recentLeads.map((l) => (
                <div key={l.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="block text-sm font-semibold text-dark">{l.name}</span>
                    <span className="block text-[10px] text-dark/50 mt-0.5">
                      {l.email} &middot; {l.phone}
                    </span>
                  </div>
                  <span className="text-[10px] text-dark/40">
                    {new Date(l.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-dark/40">
              No inquiries received yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
