"use client"

import Image from "next/image"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { CheckCircle, Palette, RefreshCw, Users } from "lucide-react"
import { findStyle } from "@/lib/art-data"
import { GALLERY_HUBS } from "@/lib/galleries"

const highlights = [
  {
    icon: RefreshCw,
    title: "Rotating Gallery",
    body: "Bored of the same pieces on your wall? Refresh your space quarterly with new, curated artwork.",
  },
  {
    icon: Palette,
    title: "Discover Your Style",
    body: "Not sure of your artistic taste? Our personalised curation helps you explore and refine your preferences.",
  },
  {
    icon: Users,
    title: "Support Artists",
    body: "Help emerging artists make a living through their passion while gaining access to their creative journey.",
  },
]

const promises = [
  "Quarterly art refreshes with monthly payment plans",
  "Personalised curation based on your preferences",
  "Gallery prints and limited editions, with originals joining the pilot",
  "Optional Frame Kit so every rotation is a 60-second swap",
  "Invites to exclusive exhibitions at our network of partner galleries",
]

// The salon wall: real works from the collection, hung the way a gallery hangs them.
const salonWall = [
  { styleId: "portrait", className: "top-[12%] left-[6%] w-[34%] rotate-[-1deg]", delay: "0ms" },
  { styleId: "abstract", className: "top-[8%] right-[8%] w-[42%] rotate-[0.5deg]", delay: "120ms" },
  { styleId: "mountain", className: "bottom-[10%] left-[14%] w-[38%] rotate-[0.75deg]", delay: "240ms", sub: true },
  { styleId: "minimalist", className: "bottom-[14%] right-[10%] w-[30%] rotate-[-0.5deg]", delay: "360ms" },
]

function salonImage(styleId: string, sub?: boolean) {
  if (sub) {
    for (const style of [findStyle("landscape")]) {
      const match = style?.subStyles.find((s) => s.id === styleId)
      if (match) return match.image
    }
  }
  return findStyle(styleId)?.image
}

export function IntroStep() {
  return (
    <div className="space-y-8 p-6">
      {/* Hero: headline beside a salon-hung wall of real works */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center md:min-h-[380px]">
        <div className="space-y-5 py-4">
          <p className="museum-label">
            <span className="museum-artist">A UK art membership · From real galleries</span>
          </p>
          <CardTitle className="text-4xl md:text-5xl font-serif font-semibold leading-[1.05]">
            Live with real art. Swap it every season.
          </CardTitle>
          <CardDescription className="text-lg leading-relaxed max-w-md">
            Gallery prints, chosen for your taste, delivered each quarter. Love a piece? Buy it. Ready for a
            change? Swap it.
          </CardDescription>
          <p className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <span className="red-dot shrink-0" aria-hidden />
            Every rotation pays the artist and their gallery
          </p>
        </div>

        <div className="relative h-[320px] md:h-[380px] rounded-lg bg-[#EDEAE3] border overflow-hidden" aria-hidden>
          {/* picture rail */}
          <div className="absolute top-5 left-0 right-0 h-px bg-foreground/25" />
          {salonWall.map(({ styleId, className, delay, sub }) => {
            const image = salonImage(styleId, sub)
            if (!image) return null
            return (
              <div
                key={styleId}
                className={`salon-frame salon-rise absolute ${className}`}
                style={{ animationDelay: delay }}
              >
                <Image
                  src={image.src}
                  alt=""
                  width={300}
                  height={220}
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border mt-10 rounded-lg overflow-hidden border">
        {highlights.map(({ icon: Icon, title, body }) => (
          <div key={title} className="bg-card p-8">
            <Icon className="h-5 w-5 text-primary mb-4" strokeWidth={1.5} />
            <h3 className="font-serif text-xl mb-2">{title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border shadow-subtle p-8 mt-10">
        <h3 className="text-2xl font-serif mb-2">Art from real galleries, not a print factory</h3>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Every work in circulation is a gallery-held edition with a named artist and a story. Artists and
          galleries earn a royalty every quarter their work hangs on your wall.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {GALLERY_HUBS.map((hub) => (
            <div key={hub.id} className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="font-serif font-medium leading-tight">{hub.name}</p>
              <p className="text-sm text-muted-foreground">{hub.location}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {hub.status === "anchor" ? "Anchor partner" : "Joining at launch"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary/5 rounded-lg p-8 border border-primary/20 shadow-subtle mt-10">
        <h3 className="text-2xl font-serif mb-4">The Canvas Club Experience</h3>
        <p className="mb-6 leading-relaxed">
          Our personalised art subscription service helps you discover new artists and styles while keeping your
          space fresh and inspiring. With quarterly deliveries, flexible options, and exclusive gallery access,
          you&rsquo;ll never get bored of your walls again.
        </p>
        <ul className="space-y-4">
          {promises.map((line) => (
            <li key={line} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" />
              <span className="leading-relaxed">{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
