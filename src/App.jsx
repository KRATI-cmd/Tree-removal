import Header from './components/Header'
import Hero from './components/Hero'
import TrustBadges from './components/TrustBadges'
import StormStory from './components/StormStory'
import Services from './components/Services'
import Calculator from './components/Calculator'
import Showcase from './components/Showcase'
import Reviews from './components/Reviews'
import Faq from './components/Faq'
import Footer from './components/Footer'
import MobileCallBar from './components/MobileCallBar'

export default function App() {
  return (
    // Bottom padding on mobile keeps the footer clear of the fixed call bar.
    <div id="top" className="pb-24 md:pb-0">
      <Header />
      <main>
        <Hero />
        <TrustBadges />
        <StormStory />
        <Services />
        <Calculator />
        <Showcase />
        <Reviews />
        <Faq />
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  )
}
