import { ArrowDown } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="flex flex-col justify-center items-center min-h-screen pt-16 pb-8 px-4 text-center">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-6">Brendon Edwards</h1>
      <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-12 text-gray-700 dark:text-gray-300">
        Exploring alignment, behavioural nuance and the human side of intelligent systems.
      </p>
      <Link
        href="#about"
        className="animate-bounce mt-12 p-2 rounded-full border border-gray-300 dark:border-gray-700"
        aria-label="Scroll down"
      >
        <ArrowDown className="h-6 w-6" />
      </Link>
    </section>
  )
}
