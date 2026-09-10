export { MEDUSA_BACKEND_URL } from "./commerce"

import { MEDUSA_BACKEND_URL } from "./commerce"

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${MEDUSA_BACKEND_URL}${endpoint}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

// Drops
export async function getDrops() {
  const data = await fetchAPI<{ drops: any[] }>("/store/drops")
  return data.drops
}

export async function getActiveDrop() {
  const drops = await getDrops()
  return drops.find((d: any) => d.status === "LIVE") || null
}

// Stories
export async function getStories() {
  const data = await fetchAPI<{ stories: any[] }>("/store/stories")
  return data.stories
}

export async function getStoryBySlug(slug: string) {
  const stories = await getStories()
  return stories.find((s: any) => s.slug === slug) || null
}

// Makers
export async function getMakers() {
  const data = await fetchAPI<{ makers: any[] }>("/store/makers")
  return data.makers
}

export async function getMakerBySlug(slug: string) {
  const makers = await getMakers()
  return makers.find((m: any) => m.slug === slug) || null
}

// Crafts
export async function getCrafts() {
  const data = await fetchAPI<{ crafts: any[] }>("/store/crafts")
  return data.crafts
}

export async function getCraftBySlug(slug: string) {
  const crafts = await getCrafts()
  return crafts.find((c: any) => c.slug === slug) || null
}

// Materials
export async function getMaterials() {
  const data = await fetchAPI<{ materials: any[] }>("/store/materials")
  return data.materials
}

export async function getMaterialBySlug(slug: string) {
  const materials = await getMaterials()
  return materials.find((m: any) => m.slug === slug) || null
}

// Places
export async function getPlaces() {
  const data = await fetchAPI<{ places: any[] }>("/store/places")
  return data.places
}

export async function getPlaceBySlug(slug: string) {
  const places = await getPlaces()
  return places.find((p: any) => p.slug === slug) || null
}

// Pages
export async function getPages() {
  const data = await fetchAPI<{ pages: any[] }>("/store/pages")
  return data.pages
}

export async function getPageBySlug(slug: string) {
  const pages = await getPages()
  return pages.find((p: any) => p.slug === slug) || null
}
