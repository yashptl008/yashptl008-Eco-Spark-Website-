import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, Sparkles, LayoutDashboard, Database, PlusCircle, ArrowLeft } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Double check admin role in profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-dark/5 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-dark text-white p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Admin Brand */}
          <div className="flex items-center space-x-2">
            <img src="/images/logos/ecospark-icon-white.png" alt="Eco Spark Logo" className="h-8 w-8 object-contain bg-red-600 p-1.5 rounded-lg" />
            <div className="flex flex-col">
              <span className="font-poppins text-sm font-bold text-white leading-none">ECO SPARK</span>
              <span className="text-[10px] text-red-500 tracking-wider font-semibold uppercase leading-none mt-1">Admin Panel</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-2">
            <Link
              href="/admin"
              className="flex items-center space-x-2.5 px-4 py-2.5 rounded-lg hover:bg-white/10 text-sm font-semibold tracking-wide transition-all"
            >
              <LayoutDashboard className="h-4.5 w-4.5 text-secondary" />
              <span>Overview</span>
            </Link>
            
            <Link
              href="/admin/products"
              className="flex items-center space-x-2.5 px-4 py-2.5 rounded-lg hover:bg-white/10 text-sm font-semibold tracking-wide transition-all"
            >
              <Database className="h-4.5 w-4.5 text-secondary" />
              <span>Manage Products</span>
            </Link>

            <Link
              href="/admin/products/new"
              className="flex items-center space-x-2.5 px-4 py-2.5 rounded-lg hover:bg-white/10 text-sm font-semibold tracking-wide transition-all"
            >
              <PlusCircle className="h-4.5 w-4.5 text-secondary" />
              <span>Add New Product</span>
            </Link>

            <Link
              href="/"
              className="flex items-center space-x-2.5 px-4 py-2.5 rounded-lg hover:bg-white/10 text-sm font-semibold text-white/60 tracking-wide transition-all pt-8 border-t border-white/5"
            >
              <ArrowLeft className="h-4.5 w-4.5 text-white/50" />
              <span>Return to Site</span>
            </Link>
          </nav>
        </div>

        <div className="text-[10px] text-white/30 pt-8 mt-8 border-t border-white/5">
          Eco Spark Admin &middot; Authenticated session
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
