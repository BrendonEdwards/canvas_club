// Launch hub galleries. Hubs are supply and curation partners, not geographic
// limits — Canvas Club serves the whole UK from launch (Business Plan v3 §8.1).
export interface GalleryHub {
  id: string
  name: string
  location: string
  role: string
  status: "anchor" | "onboarding"
}

export const GALLERY_HUBS: GalleryHub[] = [
  {
    id: "red-house",
    name: "Red House Gallery",
    location: "Harrogate",
    role: "Anchor partner — prints and editions",
    status: "anchor",
  },
  {
    id: "manchester-hub",
    name: "Manchester hub",
    location: "Manchester",
    role: "Creative and professional market",
    status: "onboarding",
  },
  {
    id: "london-hub-one",
    name: "London hub one",
    location: "London",
    role: "Design culture and media",
    status: "onboarding",
  },
  {
    id: "london-hub-two",
    name: "London hub two",
    location: "London",
    role: "Artist network and stock diversity",
    status: "onboarding",
  },
]
