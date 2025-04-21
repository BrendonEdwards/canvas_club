import { Mail, Linkedin } from "lucide-react"
import Link from "next/link"

export default function Contact() {
  return (
    <section id="contact" className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-medium mb-12">Say Hello</h2>
        <p className="text-lg mb-8">
          If you're exploring these ideas too, alignment, interpretability, weird edge cases, I'd love to connect. You
          can reach me at:
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
          <Link
            href="mailto:brendon.edwards@live.co.uk"
            className="flex items-center gap-2 text-lg hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <Mail className="h-5 w-5" />
            brendon.edwards@live.co.uk
          </Link>
          <Link
            href="https://linkedin.com/in/brendon-edwards"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-lg hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <Linkedin className="h-5 w-5" />
            LinkedIn
          </Link>
        </div>
      </div>
    </section>
  )
}
