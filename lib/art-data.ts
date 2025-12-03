import { ArtStyle } from "./types"

export const ART_STYLES: ArtStyle[] = [
  {
    id: "abstract",
    name: "Abstract",
    image: "https://m.media-amazon.com/images/I/51DjA2n+QYL._UXNaN_FMjpg_QL85_.jpg",
    subStyles: [
      { id: "geometric", name: "Geometric", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=300&h=300&fit=crop" },
      { id: "expressionism", name: "Abstract Expressionism", image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&h=300&fit=crop" },
      { id: "color-field", name: "Color Field", image: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=300&h=300&fit=crop" },
      { id: "minimalist-abstract", name: "Minimalist Abstract", image: "https://images.unsplash.com/photo-1507643179173-617d6c11813e?w=300&h=300&fit=crop" },
      { id: "fluid", name: "Fluid Art", image: "https://images.unsplash.com/photo-1515405295579-ba7b45490615?w=300&h=300&fit=crop" },
      { id: "cubist-abstract", name: "Cubist Abstract", image: "https://images.unsplash.com/photo-1555431189-0fabf2667795?w=300&h=300&fit=crop" }
    ]
  },
  {
    id: "impressionist",
    name: "Impressionist",
    image: "https://galeriemontblanc.com/cdn/shop/files/Vue_avion_1.jpg?v=1731889683",
    subStyles: [
      { id: "neo-impressionism", name: "Neo-Impressionism", image: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=300&h=300&fit=crop" },
      { id: "post-impressionism", name: "Post-Impressionism", image: "https://images.unsplash.com/photo-1577720580479-7d839d829c73?w=300&h=300&fit=crop" },
      { id: "luminism", name: "Luminism", image: "https://images.unsplash.com/photo-1464660439080-b79116909ce7?w=300&h=300&fit=crop" },
      { id: "modern-impressionism", name: "Modern Impressionism", image: "https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?w=300&h=300&fit=crop" }
    ]
  },
  {
    id: "landscape",
    name: "Landscape",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Themistokles_von_Eckenbrecher_Utsikt_over_L%C3%A6rdals%C3%B8ren.jpeg/1200px-Themistokles_von_Eckenbrecher_Utsikt_over_L%C3%A6rdals%C3%B8ren.jpeg",
    subStyles: [
      { id: "pastoral", name: "Pastoral", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=300&fit=crop" },
      { id: "sublime", name: "Romantic / Sublime", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=300&fit=crop" },
      { id: "urban-landscape", name: "Urban Landscape", image: "https://images.unsplash.com/photo-1449824913929-2b3a3e3620c1?w=300&h=300&fit=crop" },
      { id: "seascape", name: "Seascape", image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=300&h=300&fit=crop" },
      { id: "mountain", name: "Mountainscapes", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=300&fit=crop" },
      { id: "forest", name: "Forest Scenes", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop" }
    ]
  },
  {
    id: "portrait",
    name: "Portrait",
    image: "https://media.meer.com/attachments/823e3abf8cd5ca97690888cf8e21b3ee0e7ef2a1/store/fill/860/645/67568b9166ef3f4eef54cc259f1951f7a178342cdfaa41fbfad508cff067/Girl-with-a-Pearl-Earring-is-an-oil-painting-by-Dutch-Golden-Age-painter-Johannes-Vermeer-dated.jpg",
    subStyles: [
      { id: "classical-portrait", name: "Classical", image: "https://images.unsplash.com/photo-1579965342575-16428a7c8881?w=300&h=300&fit=crop" },
      { id: "contemporary-portrait", name: "Contemporary", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop" },
      { id: "surreal-portrait", name: "Surreal", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&h=300&fit=crop" },
      { id: "pop-portrait", name: "Pop Art Style", image: "https://images.unsplash.com/photo-1550935114-99de2f488f47?w=300&h=300&fit=crop" }
    ]
  },
  {
    id: "minimalist",
    name: "Minimalist",
    image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQYslGqXLPDTbM7Y4Dy7qJRXC8CPa_0dAUClKNeM39h9OiLrmG6",
    subStyles: [
      { id: "line-art", name: "Line Art", image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=300&h=300&fit=crop" },
      { id: "monochrome", name: "Monochrome", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=300&fit=crop" },
      { id: "bauhaus", name: "Bauhaus Inspired", image: "https://images.unsplash.com/photo-1582201382894-6b281c3c2573?w=300&h=300&fit=crop" },
      { id: "scandinavian", name: "Scandinavian", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&h=300&fit=crop" }
    ]
  },
  {
    id: "surrealism",
    name: "Surrealism",
    image: "https://jimmoir.com/wp-content/uploads/2024/12/Batman-Ironing.jpg",
    subStyles: [
      { id: "dreamscapes", name: "Dreamscapes", image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=300&h=300&fit=crop" },
      { id: "automatism", name: "Automatism", image: "https://images.unsplash.com/photo-1533158307587-828f0a76ef93?w=300&h=300&fit=crop" },
      { id: "veristic", name: "Veristic Surrealism", image: "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?w=300&h=300&fit=crop" }
    ]
  },
  {
    id: "pop-art",
    name: "Pop Art",
    image: "https://i.pinimg.com/originals/28/d8/9a/28d89a1a0e13f6912bbcdcf3659520b8.jpg",
    subStyles: [
      { id: "comic-strip", name: "Comic Strip Style", image: "https://images.unsplash.com/photo-1614730341194-75c60740a2d3?w=300&h=300&fit=crop" },
      { id: "advertising", name: "Advertising Aesthetic", image: "https://images.unsplash.com/photo-1620503299767-f5da77215c2d?w=300&h=300&fit=crop" },
      { id: "collage-pop", name: "Collage", image: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=300&h=300&fit=crop" }
    ]
  },
  {
    id: "cubism",
    name: "Cubism",
    image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Pablo_Picasso,_1909,_Brick_Factory_at_Tortosa,_oil_on_canvas,_50.7_x_60.2_cm,_The_State_Hermitage_Museum,_Saint_Petersburg.jpg/330px-Pablo_Picasso,_1909,_Brick_Factory_at_Tortosa,_oil_on_canvas,_50.7_x_60.2_cm,_The_State_Hermitage_Museum,_Saint_Petersburg.jpg",
    subStyles: [
      { id: "analytical", name: "Analytical Cubism", image: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=300&h=300&fit=crop" },
      { id: "synthetic", name: "Synthetic Cubism", image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=300&h=300&fit=crop" }
    ]
  },
  {
    id: "watercolor",
    name: "Watercolor",
    image: "https://artsdot.com/ADC/Art.nsf/O/8XYCCS/$File/John-Singer-Sargent-White-Ships.JPG",
    subStyles: [
      { id: "botanical", name: "Botanical", image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=300&h=300&fit=crop" },
      { id: "wet-on-wet", name: "Wet-on-Wet Abstract", image: "https://images.unsplash.com/photo-1581850380310-09a5676cb4c9?w=300&h=300&fit=crop" },
      { id: "landscape-wash", name: "Landscape Wash", image: "https://images.unsplash.com/photo-1627986064115-46b7a2d69e4d?w=300&h=300&fit=crop" }
    ]
  },
  {
    id: "still-life",
    name: "Still Life",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Memling,_Hans_%E2%80%94_Flowers_in_a_Jug_(reverse).jpg/250px-Memling,_Hans_%E2%80%94_Flowers_in_a_Jug_(reverse).jpg",
    subStyles: [
      { id: "floral", name: "Floral", image: "https://images.unsplash.com/photo-1490750967868-58cb75069fa6?w=300&h=300&fit=crop" },
      { id: "vanitas", name: "Vanitas", image: "https://images.unsplash.com/photo-1569300551082-843d43e58988?w=300&h=300&fit=crop" },
      { id: "modern-still-life", name: "Modern Object", image: "https://images.unsplash.com/photo-1582201968431-b05c862d2d93?w=300&h=300&fit=crop" }
    ]
  },
  {
    id: "urban",
    name: "Urban",
    image: "https://i0.wp.com/manchesterbe.es/wp-content/uploads/2019/08/1111.jpg?resize=1024,683",
    subStyles: [
      { id: "street-art", name: "Street Art / Graffiti", image: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=300&h=300&fit=crop" },
      { id: "architecture", name: "Architecture", image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=300&h=300&fit=crop" },
      { id: "industrial", name: "Industrial", image: "https://images.unsplash.com/photo-1504918237279-34dc309115de?w=300&h=300&fit=crop" }
    ]
  },
  {
    id: "nature",
    name: "Nature",
    image: "https://th-thumbnailer.cdn-si-edu.com/BNUNX1xJuq93KATbeIuAt2aXOYM=/1026x684/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/25MikeReyfman_Waterfall.jpg",
    subStyles: [
      { id: "wildlife", name: "Wildlife", image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=300&h=300&fit=crop" },
      { id: "botanical-illustration", name: "Botanical Illustration", image: "https://images.unsplash.com/photo-1507747806126-1d1257125345?w=300&h=300&fit=crop" },
      { id: "macro", name: "Macro Nature", image: "https://images.unsplash.com/photo-1463123081488-789f998ac9c4?w=300&h=300&fit=crop" }
    ]
  },
  {
    id: "black-white",
    name: "Black & White",
    image: "https://cyclingindependent.com/wp-content/uploads/2022/11/RUR-Shape-4-750x430.jpg",
    subStyles: [
      { id: "photography-bw", name: "B&W Photography", image: "https://images.unsplash.com/photo-1465922338908-6205791a84c9?w=300&h=300&fit=crop" },
      { id: "charcoal", name: "Charcoal / Sketch", image: "https://images.unsplash.com/photo-1582201968884-297eb06b5283?w=300&h=300&fit=crop" },
      { id: "ink", name: "Ink Wash", image: "https://images.unsplash.com/photo-1627986064115-46b7a2d69e4d?w=300&h=300&fit=crop" }
    ]
  },
  {
    id: "contemporary",
    name: "Contemporary",
    image: "https://redtreetimes.com/wp-content/uploads/2016/10/yayoi-kusama-all-the-eternal-love-i-have-for-the-pumpkins-2016.jpg?w=768",
    subStyles: [
      { id: "conceptual", name: "Conceptual", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=300&h=300&fit=crop" },
      { id: "mixed-media", name: "Mixed Media", image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=300&h=300&fit=crop" },
      { id: "installation-photo", name: "Installation Photography", image: "https://images.unsplash.com/photo-1492370284958-c20b15c692d2?w=300&h=300&fit=crop" }
    ]
  },
  {
    id: "digital-art",
    name: "Digital Art",
    image: "https://cdn.inprnt.com/thumbs/11/b8/11b8120923b29073a19d2d8564228b3a.jpg",
    subStyles: [
      { id: "3d-render", name: "3D Rendering", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop" },
      { id: "pixel-art", name: "Pixel Art", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=300&h=300&fit=crop" },
      { id: "vector", name: "Vector Illustration", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=300&h=300&fit=crop" }
    ]
  }
]
