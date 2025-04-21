import Hero from "@/components/hero"
import About from "@/components/about"
import Alignment from "@/components/alignment"
import Ideas from "@/components/ideas"
import CurrentWork from "@/components/current-work"
import Contact from "@/components/contact"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Alignment />
      <Ideas />
      <CurrentWork />
      <Contact />
    </main>
  )
}
