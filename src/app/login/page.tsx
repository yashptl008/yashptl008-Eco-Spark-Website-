'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, ArrowRight } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginContent() {
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setErrorMsg(errorParam)
    }
  }, [searchParams])

  const handleGoogleLogin = async () => {
    setLoading(true)
    setErrorMsg('')
    
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${siteUrl}/api/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to initialize Google Login')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-primary/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-dark/5 p-8 rounded-2xl shadow-xl space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="mx-auto bg-primary w-12 h-12 rounded-xl flex items-center justify-center text-white">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="font-poppins text-2xl font-bold text-dark">
            Welcome to Eco Spark
          </h2>
          <p className="text-dark/70 text-xs sm:text-sm">
            Sign in with your Google account to explore customized battery systems and order products.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 bg-white border border-dark/15 hover:border-dark/30 hover:bg-dark/5 text-dark px-4 py-3.5 rounded-xl font-semibold tracking-wide transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Google Icon SVG */}
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>{loading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
          </button>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary hover:text-secondary transition-all"
          >
            <span>Back to Home</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center bg-primary/5">
        <span className="text-sm font-semibold text-dark/70">Loading authentication interface...</span>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
