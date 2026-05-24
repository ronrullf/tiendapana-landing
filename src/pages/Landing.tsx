import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { TrustBar } from '@/components/sections/TrustBar'
import { PainSection } from '@/components/sections/PainSection'
import { InstagramSection } from '@/components/sections/InstagramSection'
import { PromiseBlock } from '@/components/sections/PromiseBlock'
import { WhatsIncluded } from '@/components/sections/WhatsIncluded'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { BeforeAfter } from '@/components/sections/BeforeAfter'
import { SocialProof } from '@/components/sections/SocialProof'
import { Authority } from '@/components/sections/Authority'
import { FAQ } from '@/components/sections/FAQ'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/sections/Footer'
import { StickyBottomCTA } from '@/components/StickyBottomCTA'

export default function Landing() {
  return (
    <div className="w-full overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <PainSection />
        <InstagramSection />
        <PromiseBlock />
        <WhatsIncluded />
        <HowItWorks />
        <BeforeAfter />
        <SocialProof />
<Authority />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <StickyBottomCTA />
    </div>
  )
}
