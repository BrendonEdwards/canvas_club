// Downloads the artwork image set into public/art/.
// Sources are restricted to: (a) Wikimedia Commons files of works whose artist
// died more than 70 years ago (public domain), addressed via the stable
// Special:FilePath redirect; (b) Unsplash CDN photos (Unsplash licence).
// Run: node scripts/fetch-art.mjs
import fs from "fs"
import path from "path"

const OUT = path.join(process.cwd(), "public", "art")
const UA = "CanvasClubPrototype/1.0 (image fetch for local dev; contact: repo owner)"

const wm = (file, width = 1024) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`
const us = (id) => `https://images.unsplash.com/${id}?w=900&q=80&fm=jpg&fit=crop`

// id -> source URL. Attribution lives in lib/art-data.ts next to each entry.
export const MANIFEST = {
  // ── top styles ──────────────────────────────────────────────
  "abstract": wm("Vassily Kandinsky, 1913 - Composition 7.jpg"),
  "impressionist": wm("Monet - Impression, Sunrise.jpg"),
  "landscape": wm("John Constable - The Hay Wain (1821).jpg"),
  "portrait": wm("Meisje met de parel.jpg"),
  "minimalist": wm("Whistler - Nocturne. Blue and Silver - Chelsea (1871).jpg"),
  "surrealism": wm("Henri Rousseau - Il sogno.jpg"),
  "pop-art": us("photo-1550935114-99de2f488f47"),
  "cubism": wm("Juan Gris - Portrait of Pablo Picasso - Google Art Project.jpg"),
  "watercolour": wm("Winslow Homer - The Blue Boat - Google Art Project.jpg"),
  "black-white": us("photo-1502657877623-f66bf489d236"),
  "urban": us("photo-1480714378408-67cf0d13bc1b"),
  "nature": us("photo-1441974231531-c6227db76b6e"),
  "digital-art": us("photo-1550745165-9bc0b252726f"),

  // ── sub-styles ──────────────────────────────────────────────
  "geometric": wm("Piet Mondriaan, 1930 - Mondrian Composition II in Red, Blue, and Yellow.jpg"),
  "expressive-abstract": wm("Vassily Kandinsky, 1923 - Composition 8, huile sur toile, 140 cm x 201 cm, Musée Guggenheim, New York.jpg"),
  "colour-field": wm("Hilma af Klint, 1915, Svanen, No. 17.jpg"),
  "fluid": us("photo-1541701494587-cb58502866ab"),

  "post-impressionism": wm("Van Gogh - Starry Night - Google Art Project.jpg"),
  "pointillism": wm("A Sunday on La Grande Jatte, Georges Seurat, 1884.jpg"),
  "plein-air": wm("Claude Monet - Woman with a Parasol - Madame Monet and Her Son - Google Art Project.jpg"),
  "modern-impressionism": us("photo-1578301978693-85fa9c0320b9"),

  "pastoral": wm("Themistokles von Eckenbrecher Utsikt over Lærdalsøren.jpeg"),
  "seascape": wm("Tsunami by hokusai 19th century.jpg"),
  "mountain": us("photo-1464822759023-fed622ff2c3b"),
  "forest": us("photo-1448375240586-882707db888b"),
  "urban-landscape": wm("Gustave Caillebotte - Paris Street; Rainy Day - Google Art Project.jpg"),

  "classical-portrait": wm("Mona Lisa, by Leonardo da Vinci, from C2RMF retouched.jpg"),
  "expressive-portrait": wm("Vincent van Gogh - Self-Portrait - Google Art Project.jpg"),
  "contemporary-portrait": us("photo-1531746020798-e6953c6e8e04"),
  "figurative": wm("Edgar Degas - The Ballet Class - Google Art Project.jpg"),

  "line-art": us("photo-1544967082-d9d25d867d66"),
  "monochrome": us("photo-1507525428034-b723cf961d3e"),
  "scandinavian": us("photo-1513519245088-0e12902e5a38"),
  "geometric-minimal": us("photo-1550684848-fac1c5b4e853"),

  "dreamscapes": wm("Henri Rousseau 010.jpg"),
  "symbolism": wm("Redon.cyclops.jpg"),
  "surreal-photography": us("photo-1549465220-1a8b9238cd48"),

  "comic-strip": us("photo-1612036782180-6f0b6cd846fe"),
  "advertising": us("photo-1572375992501-4b0892d50c69"),
  "collage-pop": us("photo-1579783901586-d88db74b4fe4"),

  "analytical-cubism": wm("Robert Delaunay, 1910, La ville no. 2, oil on canvas, 146 x 114 cm, Musée National d'Art Moderne, Centre Georges Pompidou, Paris.jpg"),
  "synthetic-cubism": wm("Still Life with Checked Tablecloth Juan Gris 1915.jpeg"),

  "loose-wash": wm("Venice MET DT2889.jpg"),
  "botanical-watercolour": us("photo-1520763185298-1b434c919102"),
  "urban-sketch": us("photo-1513364776144-60967b0f800f"),

  "documentary": us("photo-1533105079780-92b9be482077"),
  "architectural-bw": us("photo-1486718448742-163732cd1544"),
  "fine-art-bw": us("photo-1494548162494-384bba4ab999"),

  "cityscape": wm("Camille Pissarro - Boulevard Montmartre - Eremitage.jpg"),
  "night-city": us("photo-1519501025264-65ba15a82390"),

  "botanical": us("photo-1466781783364-36c955e42a7f"),
  "wildlife": us("photo-1474511320723-9a56873867b5"),
  "coastal-nature": us("photo-1505118380757-91f5f5632de0"),

  "glitch": us("photo-1550684376-efcbd6e3f031"),
  "render-3d": us("photo-1633356122544-f134324a6cee"),
  "digital-collage": us("photo-1547891654-e66ed7ebb968"),
}

function placeholderSVG(id) {
  // deterministic two-tone gradient so a failed download never breaks the UI
  let h = 0
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 360
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="hsl(${h},45%,72%)"/>
    <stop offset="100%" stop-color="hsl(${(h + 40) % 360},35%,45%)"/>
  </linearGradient></defs>
  <rect width="900" height="900" fill="url(#g)"/>
  <text x="450" y="460" font-family="Georgia, serif" font-size="42" fill="rgba(255,255,255,0.85)" text-anchor="middle">${id}</text>
</svg>`
}

async function fetchOne(id, url) {
  const dest = path.join(OUT, `${id}.jpg`)
  if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) return { id, status: "cached" }
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    const type = res.headers.get("content-type") ?? ""
    if (buf.length < 5000 || !type.startsWith("image/") || type.includes("svg")) {
      throw new Error(`suspicious payload (${buf.length}B, ${type})`)
    }
    fs.writeFileSync(dest, buf)
    return { id, status: "ok", bytes: buf.length }
  } catch (e) {
    fs.writeFileSync(path.join(OUT, `${id}.svg`), placeholderSVG(id))
    if (fs.existsSync(dest)) fs.unlinkSync(dest)
    return { id, status: "placeholder", reason: String(e.message ?? e) }
  }
}

fs.mkdirSync(OUT, { recursive: true })
const entries = Object.entries(MANIFEST)
const results = []
for (const [id, url] of entries) {
  const r = await fetchOne(id, url)
  results.push(r)
  if (r.status !== "cached") await new Promise((res) => setTimeout(res, 1500))
}
const failed = results.filter((r) => r.status === "placeholder")
console.log(`Fetched ${results.length - failed.length}/${results.length} images.`)
for (const f of failed) console.log(`  PLACEHOLDER ${f.id}: ${f.reason}`)
