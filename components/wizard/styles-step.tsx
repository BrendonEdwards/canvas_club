"use client"

import { Badge } from "@/components/ui/badge"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { Palette } from "lucide-react"
import { StyleSelector } from "@/components/StyleSelector"
import { findStyle } from "@/lib/art-data"
import type { WizardState } from "./use-wizard-state"

export function StylesStep({ wizard }: { wizard: WizardState }) {
  const { form, errors, toggleStyle, toggleSubStyle } = wizard

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-3">
        <CardTitle className="flex items-center gap-3 text-2xl font-serif">
          <Palette className="h-6 w-6 text-primary" />
          Art Preferences
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">
          Select the styles that resonate with you, then hit <span className="font-medium">Explore</span> on any
          style to drill into its sub-genres — love Cubism? Tell us if it&rsquo;s the analytical or the synthetic kind.
        </CardDescription>
      </div>

      <StyleSelector
        selectedStyles={form.mainStyles}
        selectedSubStyles={form.subStyles}
        onToggleStyle={toggleStyle}
        onToggleSubStyle={toggleSubStyle}
      />

      {errors.mainStyles && <p className="text-sm text-red-500">{errors.mainStyles}</p>}

      {form.mainStyles.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <span className="text-sm font-medium mr-2">Selected:</span>
          {form.mainStyles.map((id) => (
            <Badge key={id} variant="secondary" className="bg-white text-[#121212] shadow-subtle">
              {findStyle(id)?.name ?? id}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
