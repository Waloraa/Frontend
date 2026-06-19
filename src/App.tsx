import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import DashboardSection from './components/DashboardSection'
import EconomicsSection from './components/EconomicsSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <div style={{ background: '#050C1A' }}>
      <Navbar />
      <HeroSection />
      <DashboardSection />
      <FeaturesSection />
      <EconomicsSection />
      <Footer />
    </div>
  )
}
