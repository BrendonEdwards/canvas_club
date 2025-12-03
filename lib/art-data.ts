import { ArtStyle } from "./types"

export const ART_STYLES: ArtStyle[] = [
  {
    id: "abstract",
    name: "Abstract",
    image: "https://m.media-amazon.com/images/I/51DjA2n+QYL._UXNaN_FMjpg_QL85_.jpg",
    subStyles: [
      { id: "geometric", name: "Geometric" },
      { id: "expressionism", name: "Abstract Expressionism" },
      { id: "color-field", name: "Color Field" },
      { id: "minimalist-abstract", name: "Minimalist Abstract" }
    ]
  },
  {
    id: "impressionist",
    name: "Impressionist",
    image: "https://galeriemontblanc.com/cdn/shop/files/Vue_avion_1.jpg?v=1731889683",
    subStyles: [
      { id: "neo-impressionism", name: "Neo-Impressionism" },
      { id: "post-impressionism", name: "Post-Impressionism" },
      { id: "luminism", name: "Luminism" }
    ]
  },
  {
    id: "landscape",
    name: "Landscape",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Themistokles_von_Eckenbrecher_Utsikt_over_L%C3%A6rdals%C3%B8ren.jpeg/1200px-Themistokles_von_Eckenbrecher_Utsikt_over_L%C3%A6rdals%C3%B8ren.jpeg",
    subStyles: [
      { id: "pastoral", name: "Pastoral" },
      { id: "sublime", name: "Romantic / Sublime" },
      { id: "urban-landscape", name: "Urban Landscape" },
      { id: "seascape", name: "Seascape" }
    ]
  },
  {
    id: "portrait",
    name: "Portrait",
    image: "https://media.meer.com/attachments/823e3abf8cd5ca97690888cf8e21b3ee0e7ef2a1/store/fill/860/645/67568b9166ef3f4eef54cc259f1951f7a178342cdfaa41fbfad508cff067/Girl-with-a-Pearl-Earring-is-an-oil-painting-by-Dutch-Golden-Age-painter-Johannes-Vermeer-dated.jpg",
    subStyles: [
      { id: "classical-portrait", name: "Classical" },
      { id: "contemporary-portrait", name: "Contemporary" },
      { id: "surreal-portrait", name: "Surreal" },
      { id: "pop-portrait", name: "Pop Art Style" }
    ]
  },
  {
    id: "minimalist",
    name: "Minimalist",
    image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQYslGqXLPDTbM7Y4Dy7qJRXC8CPa_0dAUClKNeM39h9OiLrmG6",
    subStyles: [
      { id: "line-art", name: "Line Art" },
      { id: "monochrome", name: "Monochrome" },
      { id: "bauhaus", name: "Bauhaus Inspired" }
    ]
  },
  {
    id: "surrealism",
    name: "Surrealism",
    image: "https://jimmoir.com/wp-content/uploads/2024/12/Batman-Ironing.jpg",
    subStyles: [
      { id: "dreamscapes", name: "Dreamscapes" },
      { id: "automatism", name: "Automatism" },
      { id: "veristic", name: "Veristic Surrealism" }
    ]
  },
  {
    id: "pop-art",
    name: "Pop Art",
    image: "https://i.pinimg.com/originals/28/d8/9a/28d89a1a0e13f6912bbcdcf3659520b8.jpg",
    subStyles: [
      { id: "comic-strip", name: "Comic Strip Style" },
      { id: "advertising", name: "Advertising Aesthetic" },
      { id: "collage-pop", name: "Collage" }
    ]
  },
  {
    id: "cubism",
    name: "Cubism",
    image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Pablo_Picasso,_1909,_Brick_Factory_at_Tortosa,_oil_on_canvas,_50.7_x_60.2_cm,_The_State_Hermitage_Museum,_Saint_Petersburg.jpg/330px-Pablo_Picasso,_1909,_Brick_Factory_at_Tortosa,_oil_on_canvas,_50.7_x_60.2_cm,_The_State_Hermitage_Museum,_Saint_Petersburg.jpg",
    subStyles: [
      { id: "analytical", name: "Analytical Cubism" },
      { id: "synthetic", name: "Synthetic Cubism" }
    ]
  },
  {
    id: "watercolor",
    name: "Watercolor",
    image: "https://artsdot.com/ADC/Art.nsf/O/8XYCCS/$File/John-Singer-Sargent-White-Ships.JPG",
    subStyles: [
      { id: "botanical", name: "Botanical" },
      { id: "wet-on-wet", name: "Wet-on-Wet Abstract" },
      { id: "landscape-wash", name: "Landscape Wash" }
    ]
  },
  {
    id: "still-life",
    name: "Still Life",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Memling,_Hans_%E2%80%94_Flowers_in_a_Jug_(reverse).jpg/250px-Memling,_Hans_%E2%80%94_Flowers_in_a_Jug_(reverse).jpg",
    subStyles: [
      { id: "floral", name: "Floral" },
      { id: "vanitas", name: "Vanitas" },
      { id: "modern-still-life", name: "Modern Object" }
    ]
  },
  {
    id: "urban",
    name: "Urban",
    image: "https://i0.wp.com/manchesterbe.es/wp-content/uploads/2019/08/1111.jpg?resize=1024,683",
    subStyles: [
      { id: "street-art", name: "Street Art / Graffiti" },
      { id: "architecture", name: "Architecture" },
      { id: "industrial", name: "Industrial" }
    ]
  },
  {
    id: "nature",
    name: "Nature",
    image: "https://th-thumbnailer.cdn-si-edu.com/BNUNX1xJuq93KATbeIuAt2aXOYM=/1026x684/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/25MikeReyfman_Waterfall.jpg",
    subStyles: [
      { id: "wildlife", name: "Wildlife" },
      { id: "botanical-illustration", name: "Botanical Illustration" },
      { id: "macro", name: "Macro Nature" }
    ]
  },
  {
    id: "black-white",
    name: "Black & White",
    image: "https://cyclingindependent.com/wp-content/uploads/2022/11/RUR-Shape-4-750x430.jpg",
    subStyles: [
      { id: "photography-bw", name: "B&W Photography" },
      { id: "charcoal", name: "Charcoal / Sketch" },
      { id: "ink", name: "Ink Wash" }
    ]
  },
  {
    id: "contemporary",
    name: "Contemporary",
    image: "https://redtreetimes.com/wp-content/uploads/2016/10/yayoi-kusama-all-the-eternal-love-i-have-for-the-pumpkins-2016.jpg?w=768",
    subStyles: [
      { id: "conceptual", name: "Conceptual" },
      { id: "mixed-media", name: "Mixed Media" },
      { id: "installation-photo", name: "Installation Photography" }
    ]
  },
  {
    id: "digital-art",
    name: "Digital Art",
    image: "https://cdn.inprnt.com/thumbs/11/b8/11b8120923b29073a19d2d8564228b3a.jpg",
    subStyles: [
      { id: "3d-render", name: "3D Rendering" },
      { id: "pixel-art", name: "Pixel Art" },
      { id: "vector", name: "Vector Illustration" }
    ]
  }
]
