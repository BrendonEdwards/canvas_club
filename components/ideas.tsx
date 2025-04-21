import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Ideas() {
  const ideas = [
    {
      title: "Scenario-Based Alignment",
      description:
        "I'm developing a way of testing AI models through story-driven hypotheticals that play out real-world dilemmas. These aren't just edge cases, they're behavioural stress tests that reveal how a model reasons through ambiguity, pressure, or cultural tension. It's a bit like QA testing for values, using fiction as a probe.",
    },
    {
      title: "Synkron",
      description:
        "This is an idea for a compressed symbolic language designed for communication between AI agents. Think of it like a glyph-based shorthand that captures structure, intent, and logic more tightly than natural language. The goal is to explore whether models could collaborate more efficiently if they weren't bound by human syntax.",
    },
    {
      title: "Clarity-First Reward Systems",
      description:
        "I've been toying with the idea that we may be reinforcing the wrong behaviours in models by rewarding surface traits like politeness or verbosity instead of deeper ones like clarity, honesty, and contextual awareness. This concept rethinks reward functions to promote substance over style and asks what happens when we reward models for making themselves truly understood.",
    },
    {
      title: "Canvas Club",
      description:
        "At first glance, this is a curated art subscription service. Under the hood, it's a system for preference modelling. Subscribers are gradually introduced to new works based on what they've liked, but also challenged just enough to explore adjacent styles. It's a metaphor for taste alignment, long term feedback loops, and how soft preferences evolve over time.",
    },
    {
      title: "Conversational Profiling for Recruitment",
      description:
        "This one flips the hiring process. Instead of analysing CVs and cover letters, the idea is to use a conversational AI to explore how someone thinks. You'd learn how they reason, how they explain ethical trade offs, how they approach uncertainty. It could be used to surface hidden talent or better understand cognitive fit between people and teams. Especially relevant in neurodiverse or creatively structured workplaces.",
    },
  ]

  return (
    <section id="ideas" className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-medium mb-12 border-b pb-4 border-gray-200 dark:border-gray-800">
          Some Ideas I've Been Playing With
        </h2>
        <div className="grid gap-6 md:gap-8">
          {ideas.map((idea, index) => (
            <Card key={index} className="border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">{idea.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">{idea.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
