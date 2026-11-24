import { CallToAction } from '@/components/landing/CallToAction'
import { Features } from '@/components/landing/Features'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingNavbar } from '@/components/landing/LandingNavbar'
import { Pricing } from '@/components/landing/Pricing'
import { ProductCarousel } from '@/components/landing/ProductCarousel'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <LandingNavbar />
      <main>
        <Hero />
        <div className="container-page pb-8 pt-4 sm:pb-12">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.25em] text-zinc-600">
            A closer look at the workspace
          </p>
          <ProductCarousel />
        </div>
        <Features />
        <HowItWorks />
        <Pricing />
        <CallToAction />
      </main>
      <LandingFooter />
    </div>
  )
}
