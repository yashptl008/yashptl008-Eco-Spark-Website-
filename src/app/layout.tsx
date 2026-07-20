import type { Metadata } from 'next'
import { Poppins, Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AnalyticsTracker from '@/components/AnalyticsTracker'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-poppins',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Eco Spark Green Energy | Powering a Cleaner Future',
  description: 'Eco Spark Green Energy provides premium LiFePO4 batteries, BESS (Battery Energy Storage Systems), industrial backup, solar energy systems, and smart energy management solutions in Surat, Gujarat, India.',
  keywords: 'Lithium Battery, LiFePO4, BESS, Solar Storage, Industrial Backup, Eco Spark Green Energy, Surat, Gujarat',
  authors: [{ name: 'Eco Spark Green Energy' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Eco Spark Green Energy | Powering a Cleaner Future',
    description: 'Eco Spark Green Energy provides premium LiFePO4 batteries, BESS, and industrial backup systems in Gujarat, India.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-inter text-dark bg-white">
        <AnalyticsTracker />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
