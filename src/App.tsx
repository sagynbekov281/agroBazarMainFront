import Header from './components/Header'
import Hero from './components/Hero'
import Categories from './components/Categories'
import Products from './components/Products'
import Farmers from './components/Farmers'
import Transport from './components/Transport'
import PriceStats from './components/PriceStats'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <Header />
      <main>
        <Hero />
        <Categories />
        <Products />
        <Farmers />

        <section id="transport" className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <Transport />
            <PriceStats />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
