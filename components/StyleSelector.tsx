"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Plus, Minus } from "lucide-react"
import { ART_STYLES } from "@/lib/art-data"

interface StyleSelectorProps {
  selectedStyles: string[]
  selectedSubStyles: string[]
  onToggleStyle: (styleId: string) => void
  onToggleSubStyle: (subStyleId: string) => void
}

export function StyleSelector({
  selectedStyles,
  selectedSubStyles,
  onToggleStyle,
  onToggleSubStyle,
}: StyleSelectorProps) {
  const [expandedStyles, setExpandedStyles] = useState<string[]>([])

  const toggleExpand = (styleId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedStyles((prev) =>
      prev.includes(styleId) ? prev.filter((id) => id !== styleId) : [...prev, styleId]
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {ART_STYLES.map((style) => {
          const isSelected = selectedStyles.includes(style.name) // Note: Keeping 'name' for backward compat with current art-subscription logic if needed, but 'id' is better. The current art-subscription uses names. Let's check if we should switch to IDs. The current codebase uses names in the array. I will map IDs to Names or stick to one. The mock data has 'id' and 'name'. Let's stick to 'name' for the main selection to minimize refactor, or refactor everything to IDs. I will use names for main styles to stay compatible, but IDs for subStyles.
          // actually, let's use names for main styles as per existing code, but the new data has lowercase IDs.
          // The existing code expected "Abstract", "Impressionist". My new data has "abstract", "Abstract".
          // I will use style.name for the main selection.

          const isExpanded = expandedStyles.includes(style.id)

          return (
            <div
              key={style.id}
              className={`flex flex-col rounded-lg border transition-all shadow-subtle hover:shadow-md ${
                isSelected ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              {/* Main Card Content - Click to Select */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => onToggleStyle(style.name)}
              >
                <div className="w-full h-24 bg-muted rounded-md overflow-hidden mb-3 relative group">
                  <img
                    src={style.image || "/placeholder.svg"}
                    alt={style.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-white rounded-full p-1">
                            <Plus className="h-4 w-4" />
                        </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`style-${style.id}`}
                      checked={isSelected}
                      onCheckedChange={() => {}} // Handled by parent div click
                      className="text-primary border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground pointer-events-none"
                    />
                    <Label className="cursor-pointer font-medium leading-relaxed pointer-events-none">
                      {style.name}
                    </Label>
                  </div>

                  {/* Expand Button */}
                  {isSelected && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-primary/20"
                        onClick={(e) => toggleExpand(style.id, e)}
                    >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </div>

              {/* Collapsible Sub-styles */}
              <Collapsible open={isExpanded && isSelected}>
                <CollapsibleContent className="px-4 pb-4 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="pt-2 border-t border-primary/10 mt-2">
                        <p className="text-xs text-muted-foreground mb-3">Refine your {style.name} taste:</p>
                        <div className="grid grid-cols-1 gap-2">
                            {style.subStyles.map((sub) => (
                                <div key={sub.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`sub-${sub.id}`}
                                        checked={selectedSubStyles.includes(sub.id)}
                                        onCheckedChange={() => onToggleSubStyle(sub.id)}
                                        className="h-3.5 w-3.5"
                                    />
                                    <Label htmlFor={`sub-${sub.id}`} className="text-sm font-normal text-muted-foreground cursor-pointer hover:text-foreground">
                                        {sub.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )
        })}
      </div>

      {/* Summary of Selected Sub-styles */}
      {selectedSubStyles.length > 0 && (
         <div className="mt-6 p-4 bg-background rounded-lg border shadow-sm">
             <p className="text-sm font-medium mb-2">Refined Preferences:</p>
             <div className="flex flex-wrap gap-2">
                 {ART_STYLES.flatMap(s => s.subStyles).filter(sub => selectedSubStyles.includes(sub.id)).map(sub => (
                     <Badge key={sub.id} variant="secondary" className="bg-secondary/50 text-xs">
                         {sub.name}
                         <button
                            className="ml-1 hover:text-destructive"
                            onClick={() => onToggleSubStyle(sub.id)}
                         >
                             <Minus className="h-3 w-3" />
                         </button>
                     </Badge>
                 ))}
             </div>
         </div>
      )}
    </div>
  )
}
