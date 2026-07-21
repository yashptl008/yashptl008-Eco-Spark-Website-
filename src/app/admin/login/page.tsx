'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, ShieldAlert, KeyRound, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      // 1. Sign in with email and password
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (user) {
        // 2. Query profile role to verify they are an admin
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profileErr || !profile || profile.role !== 'admin') {
          // If not an admin, sign out and throw warning
          await supabase.auth.signOut()
          throw new Error('Access Denied. You do not have administrator permissions.')
        }

        // 3. Redirect to Admin Dashboard
        router.push('/admin')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-red-50/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-red-100 p-8 rounded-2xl shadow-xl space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="mx-auto bg-red-600 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg">
            <img src="/images/logos/ecospark-icon-white.png" alt="Admin Shield" className="h-10 w-10 object-contain" />
          </div>
          <h2 className="font-poppins text-2xl font-bold text-dark">
            Eco Spark Admin Portal
          </h2>
          <p className="text-dark/70 text-xs sm:text-sm">
            Sign in with your administrative email and credentials.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40 h-4.5 w-4.5" />
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ecospark.in"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-dark/15 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">
                Security Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40 h-4.5 w-4.5" />
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-dark/15 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none text-sm bg-white"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-3.5 px-6 rounded-xl text-sm font-bold tracking-wide transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Verifying Admin Authority...' : 'Sign In as Admin'}</span>
          </button>
        </form>
      </div>
    </div>
  )
}
