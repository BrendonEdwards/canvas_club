"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Plus, Minus, Maximize2, Check } from "lucide-react"
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
  const [activeStyleForModal, setActiveStyleForModal] = useState<string | null>(null)

  const activeStyleData = ART_STYLES.find(s => s.id === activeStyleForModal)

  const handleOpenModal = (styleId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveStyleForModal(styleId)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {ART_STYLES.map((style) => {
          const isSelected = selectedStyles.includes(style.name)
          const selectedSubCount = style.subStyles.filter(sub => selectedSubStyles.includes(sub.id)).length

          return (
            <div
              key={style.id}
              className={`flex flex-col rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                isSelected ? "border-primary shadow-md" : "border-transparent shadow-sm hover:shadow-md bg-white"
              }`}
            >
              {/* Main Card Content */}
              <div
                className="cursor-pointer group relative"
                onClick={() => onToggleStyle(style.name)}
              >
                <div className="aspect-[4/3] w-full relative overflow-hidden">
                  <img
                    src={style.image || "/placeholder.svg"}
                    alt={style.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-black/40 transition-opacity duration-200 flex items-center justify-center ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                     {isSelected ? (
                         <div className="bg-primary text-primary-foreground rounded-full p-2 animate-in zoom-in">
                             <Check className="h-6 w-6" />
                         </div>
                     ) : (
                         <div className="bg-white/20 backdrop-blur-sm text-white rounded-full p-2">
                             <Plus className="h-6 w-6" />
                         </div>
                     )}
                  </div>
                </div>

                <div className="p-4 bg-card">
                  <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-serif text-lg font-medium leading-none">{style.name}</h3>
                        {selectedSubCount > 0 && (
                            <p className="text-xs text-primary mt-1 font-medium">{selectedSubCount} sub-styles selected</p>
                        )}
                    </div>

                    {/* Expand/Refine Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={(e) => handleOpenModal(style.id, e)}
                        title="Explore sub-styles"
                    >
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Full Screen Modal for Sub-styles */}
      <Dialog open={!!activeStyleForModal} onOpenChange={(open) => !open && setActiveStyleForModal(null)}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
             {activeStyleData && (
                 <>
                    <DialogHeader className="p-6 pb-2 border-b shrink-0 bg-background z-10">
                        <DialogTitle className="text-2xl font-serif">Refine your {activeStyleData.name} taste</DialogTitle>
                        <DialogDescription>
                            Select specific styles you love. Click to toggle selection.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="overflow-y-auto p-6 flex-1 bg-[#FAFAFA]">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {activeStyleData.subStyles.map((sub) => {
                                const isSubSelected = selectedSubStyles.includes(sub.id)
                                return (
                                    <div
                                        key={sub.id}
                                        className={`group relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                                            isSubSelected ? 'border-primary shadow-md ring-2 ring-primary/20' : 'border-transparent shadow-sm hover:shadow-md'
                                        }`}
                                        onClick={() => onToggleSubStyle(sub.id)}
                                    >
                                        <div className="aspect-square relative">
                                            <img
                                                src={sub.image || "/placeholder.svg"}
                                                alt={sub.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className={`absolute inset-0 transition-colors duration-200 flex items-center justify-center ${isSubSelected ? 'bg-primary/20' : 'bg-black/0 group-hover:bg-black/10'}`}>
                                                {isSubSelected && (
                                                    <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-sm animate-in zoom-in">
                                                        <Check className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white border-t">
                                            <p className={`font-medium text-center ${isSubSelected ? 'text-primary' : 'text-foreground'}`}>
                                                {sub.name}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <DialogFooter className="p-4 border-t bg-background shrink-0 sm:justify-between items-center">
                         <div className="text-sm text-muted-foreground hidden sm:block">
                             {activeStyleData.subStyles.filter(s => selectedSubStyles.includes(s.id)).length} selected
                         </div>
                         <Button onClick={() => setActiveStyleForModal(null)} className="w-full sm:w-auto">
                             Done
                         </Button>
                    </DialogFooter>
                 </>
             )}
        </DialogContent>
      </Dialog>

      {/* Summary of Selected Sub-styles */}
      {selectedSubStyles.length > 0 && (
         <div className="p-4 bg-background rounded-lg border shadow-sm">
             <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-medium">Your Refined Palette:</p>
                <Button variant="ghost" size="sm" onClick={() => {
                    // This assumes the parent handles "clearing all" if needed,
                    // but for now we just show the count.
                }} className="h-auto p-0 text-xs text-muted-foreground hover:text-destructive">
                    {selectedSubStyles.length} selections
                </Button>
             </div>
             <div className="flex flex-wrap gap-2">
                 {ART_STYLES.flatMap(s => s.subStyles).filter(sub => selectedSubStyles.includes(sub.id)).map(sub => (
                     <Badge key={sub.id} variant="secondary" className="bg-secondary/50 text-xs pl-2 pr-1 py-1 flex items-center gap-1">
                         {sub.name}
                         <button
                            className="hover:bg-destructive/10 hover:text-destructive rounded-full p-0.5 transition-colors"
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
