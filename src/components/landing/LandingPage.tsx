'use client'

import FAQ from '@/components/landing/FAQ'
import Features from '@/components/landing/Features'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import Pricing from '@/components/landing/Pricing'
import SnapPage from '@/components/landing/SnapPage'

export default function LandingPage() {
  return (
    <SnapPage>
      {(scrollToId) => (
        <div className="bg-white text-slate-900">
          <Header onNavigate={scrollToId} />
          <main>
            <Hero onScrollToId={scrollToId} />
            <Features />
            <HowItWorks />
            <Pricing />
            <FAQ />
          </main>
          <Footer />
        </div>
      )}
    </SnapPage>
  )
}
