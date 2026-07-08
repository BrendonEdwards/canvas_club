"use client"

import Image from "next/image"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { Card, CardContent } from "@/components/ui/card"
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

export function IntroStep() {
  const landscape = findStyle("landscape")
  const portrait = findStyle("impressionist")

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-4 text-center">
        <CardTitle className="text-3xl md:text-4xl font-serif font-bold">
          Redefine Your Space with Canvas Club
        </CardTitle>
        <CardDescription className="text-lg leading-relaxed">
          A quarterly art subscription that transforms your home and supports emerging artists
        </CardDescription>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {highlights.map(({ icon: Icon, title, body }) => (
          <Card
            key={title}
            className="bg-primary/5 border-primary/20 shadow-subtle rounded-lg overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px]"
          >
            <CardContent className="pt-8 pb-6 px-6 text-center">
              <div className="mx-auto bg-primary/10 w-14 h-14 flex items-center justify-center rounded-full mb-6">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl mb-3">{title}</h3>
              <p className="text-muted-foreground leading-relaxed">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative mt-10 mb-10">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#FAFAFA] px-4 text-muted-foreground font-medium tracking-wider">How It Works</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {[
          {
            image: landscape?.image,
            title: "Transform Your Space",
            body: "Every quarter, receive carefully selected artwork based on your preferences. Create a constantly evolving gallery in your home that reflects your evolving taste and style.",
          },
          {
            image: portrait?.image,
            title: "Empower Artists",
            body: "Your subscription directly supports talented artists at every stage of their career. We ensure fair compensation and exposure for creators, helping them sustain their artistic practice.",
          },
        ].map(({ image, title, body }) => (
          <div key={title} className="space-y-5">
            {image && (
              <div className="aspect-video relative rounded-lg overflow-hidden bg-muted shadow-subtle">
                <Image
                  src={image.src}
                  alt={`${image.title} by ${image.artist}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            )}
            <h3 className="text-2xl font-serif">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{body}</p>
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
