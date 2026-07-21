'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogIn, LogOut, ShieldAlert, Sparkles, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { type User as SupabaseUser } from '@supabase/supabase-js'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [role, setRole] = useState<string>('customer')
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    // Get current user session
    const getUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        // Fetch profile role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        if (profile) {
          setRole(profile.role)
        }
      }
    }

    getUserSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        if (profile) {
          setRole(profile.role)
        }
      } else {
        setUser(null)
        setRole('customer')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
  ]

  const activeLinkStyle = "text-primary font-semibold border-b-2 border-secondary"
  const inactiveLinkStyle = "text-dark/80 hover:text-primary transition-colors duration-200"

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img 
              src="/images/logos/ecospark-logo-color.png" 
              alt="Eco Spark Green Energy" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.path
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`text-sm tracking-wide font-medium py-1 px-0.5 ${isActive ? activeLinkStyle : inactiveLinkStyle}`}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>

          {/* Auth CTA & Admin Area */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-100 text-xs font-semibold tracking-wide transition-all"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <div className="flex items-center space-x-2 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                  {user.user_metadata?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata.full_name || 'User'}
                      className="h-6 w-6 rounded-full border border-secondary"
                    />
                  ) : (
                    <User className="h-4 w-4 text-primary" />
                  )}
                  <span className="text-xs text-dark/95 font-medium max-w-[100px] truncate">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1.5 text-xs text-dark/70 hover:text-red-500 font-medium transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1.5 bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-semibold tracking-wide shadow-sm hover:shadow transition-all"
              >
                <LogIn className="h-4 w-4" />
                <span>Customer Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {user && role === 'admin' && (
              <Link href="/admin" className="mr-3 p-1.5 bg-red-50 text-red-600 rounded-lg border border-red-200">
                <ShieldAlert className="h-5 w-5" />
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-dark/80 hover:text-primary p-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-dark/5 shadow-inner"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.path
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-base font-medium ${
                      isActive ? 'bg-primary/10 text-primary font-bold' : 'text-dark/80 hover:bg-dark/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
              <div className="pt-4 border-t border-dark/10">
                {user ? (
                  <div className="flex flex-col space-y-3 px-3">
                    <div className="flex items-center space-x-3">
                      {user.user_metadata?.avatar_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="Avatar"
                          className="h-8 w-8 rounded-full border border-secondary"
                        />
                      )}
                      <div>
                        <div className="text-sm font-semibold text-dark leading-none">
                          {user.user_metadata?.full_name || 'Customer'}
                        </div>
                        <div className="text-xs text-dark/50 mt-1">{user.email}</div>
                      </div>
                    </div>
                    {role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center space-x-1.5 bg-red-50 text-red-600 py-2.5 rounded-lg border border-red-200 text-sm font-bold w-full"
                      >
                        <ShieldAlert className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        handleSignOut()
                      }}
                      className="flex items-center justify-center space-x-1.5 w-full bg-dark/5 text-dark/70 hover:bg-red-50 hover:text-red-500 py-2.5 rounded-lg text-sm font-medium transition-all"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center space-x-1.5 bg-primary text-white py-3 rounded-lg text-sm font-bold shadow-sm"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Customer Login</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
