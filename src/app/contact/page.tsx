'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    honeypot: '', // bot protection
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          sourcePage: 'contact',
          honeypot: formData.honeypot,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', message: '', honeypot: '' })
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
    }
  }

  return (
    <div className="pb-24 pt-12 space-y-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20">
          Get in Touch
        </span>
        <h1 className="font-poppins text-4xl sm:text-5xl font-bold text-dark tracking-tight">
          Contact Eco Spark Green Energy
        </h1>
        <p className="text-dark/70 text-sm sm:text-base leading-relaxed">
          Have an inquiry about our BESS setups, industrial backups, or custom batteries? Reach out to our Pandesara office and we'll get back to you within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-dark/5 shadow-sm space-y-6">
            <h2 className="font-poppins text-xl font-bold text-dark border-b border-dark/5 pb-4">
              Office Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3.5">
                <div className="bg-primary/5 p-2.5 rounded-lg border border-primary/10 text-primary shrink-0 mt-0.5">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-dark text-sm">Location</h4>
                  <p className="text-dark/70 text-sm mt-1 leading-relaxed">
                    Pandesara, Surat, Gujarat, India.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="bg-primary/5 p-2.5 rounded-lg border border-primary/10 text-primary shrink-0 mt-0.5">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-dark text-sm">Phone Numbers</h4>
                  <p className="text-dark/70 text-sm mt-1 leading-relaxed">
                    <a href="tel:+919924878518" className="hover:text-primary block font-medium">+91 99248 78518</a>
                    <a href="tel:+919979944344" className="hover:text-primary block font-medium">+91 99799 44344</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="bg-primary/5 p-2.5 rounded-lg border border-primary/10 text-primary shrink-0 mt-0.5">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-dark text-sm">Email Inquiries</h4>
                  <p className="text-dark/70 text-sm mt-1 leading-relaxed">
                    <a href="mailto:info@ecospark.in" className="hover:text-primary font-medium">info@ecospark.in</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="bg-primary/5 p-2.5 rounded-lg border border-primary/10 text-primary shrink-0 mt-0.5">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-dark text-sm">Working Hours</h4>
                  <p className="text-dark/70 text-sm mt-1 leading-relaxed">
                    Monday &ndash; Saturday: 9:00 AM &ndash; 7:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="bg-white p-2 rounded-2xl border border-dark/5 shadow-sm overflow-hidden h-[300px] relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.226849419143!2d72.80918717593259!3d21.143365883838153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be053d489cd3bf5%3A0xe543c7b3c20dbd15!2sPandesara%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Eco Spark Green Energy Location Map"
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-dark/5 shadow-sm">
          <h2 className="font-poppins text-xl font-bold text-dark mb-6">
            Send Us a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot field - hidden from users, visible to bots */}
            <div className="hidden">
              <label htmlFor="honeypot">Leave this field blank if you are human</label>
              <input
                type="text"
                id="honeypot"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rajesh Patel"
                  className="w-full px-4 py-3 rounded-lg border border-dark/15 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm bg-white"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 99000 00000"
                  className="w-full px-4 py-3 rounded-lg border border-dark/15 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. rajesh@company.com"
                className="w-full px-4 py-3 rounded-lg border border-dark/15 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm bg-white"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-bold text-dark/70 uppercase tracking-wider mb-2">
                Your Message / Inquiry Detail
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your battery backup requirements, required capacity (kWh), BESS load needs, etc..."
                className="w-full px-4 py-3 rounded-lg border border-dark/15 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm bg-white resize-none"
              />
            </div>

            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center space-x-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                <span>Thank you! Your message has been received. Our sales team will get back to you shortly.</span>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center space-x-3 text-sm">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full inline-flex items-center justify-center space-x-2 bg-primary hover:bg-primary/95 text-white py-3.5 px-6 rounded-lg text-sm font-bold tracking-wide transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{status === 'submitting' ? 'Submitting...' : 'Send Inquiry'}</span>
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
