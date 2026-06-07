import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import DashboardSection from './components/DashboardSection'
import EconomicsSection from './components/EconomicsSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <div style={{ background: '#E8E4DC' }}>
      <HeroSection />
      <FeaturesSection />
      <DashboardSection />
      <EconomicsSection />
      <Footer />
    </div>
  )
}
