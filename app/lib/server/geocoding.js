const USER_AGENT = process.env.GEOCODING_USER_AGENT || "FirstEstates/1.0"

export const geocodeAddress = async (address) => {
  const cleanAddress = String(address || "").trim()
  if (!cleanAddress) return null

  const url = new URL("https://nominatim.openstreetmap.org/search")
  url.searchParams.set("q", cleanAddress)
  url.searchParams.set("format", "jsonv2")
  url.searchParams.set("limit", "1")

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 86400 },
    })
    if (!response.ok) return null
    const results = await response.json()
    const result = results?.[0]
    const latitude = Number(result?.lat)
    const longitude = Number(result?.lon)
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
    return { latitude, longitude }
  } catch {
    // Geocoding is an enhancement and must never break listing or school flows.
    return null
  }
}
