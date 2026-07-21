import Link from 'next/link'
import { Sparkles, MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <img 
                src="/images/logos/ecospark-logo-white.png" 
                alt="Eco Spark Green Energy" 
                className="h-10 sm:h-12 w-auto object-contain" 
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed pt-2">
              "Empowering a Cleaner Future"<br />
              Premium Lithium Battery (LiFePO4) energy systems, BESS, solar energy integration, and smart backup storage.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-poppins text-base font-bold tracking-wider uppercase text-secondary mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">Product Catalog</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Products Categories */}
          <div>
            <h3 className="font-poppins text-base font-bold tracking-wider uppercase text-secondary mb-4">Our Solutions</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>LiFePO4 Battery Systems</li>
              <li>Battery Energy Storage (BESS)</li>
              <li>Solar Energy Storage</li>
              <li>Industrial & UPS Backup</li>
              <li>EV Charging Solutions</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 text-sm text-white/70">
            <h3 className="font-poppins text-base font-bold tracking-wider uppercase text-secondary mb-4">Get In Touch</h3>
            <div className="flex items-start space-x-2.5">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>Pandesara, Surat, Gujarat, India</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Phone className="h-5 w-5 text-primary shrink-0" />
              <div className="flex flex-col">
                <a href="tel:+919924878518" className="hover:text-primary">+91 99248 78518</a>
                <a href="tel:+919979944344" className="hover:text-primary">+91 99799 44344</a>
              </div>
            </div>
            <div className="flex items-center space-x-2.5">
              <Mail className="h-5 w-5 text-primary shrink-0" />
              <a href="mailto:info@ecospark.in" className="hover:text-primary">info@ecospark.in</a>
            </div>
            <div className="flex items-center space-x-2.5 pt-1">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/50">
          <p>© {new Date().getFullYear()} Eco Spark Green Energy. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span>Surat, Gujarat</span>
            <Link href="/admin/login" className="hover:text-primary transition-colors font-medium">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
