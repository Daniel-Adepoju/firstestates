const EARTH_RADIUS_KM = 6371

export const haversineDistanceKm = (from, to) => {
  if (!from || !to) return null
  const values = [from.latitude, from.longitude, to.latitude, to.longitude].map(Number)
  if (values.some((value) => !Number.isFinite(value))) return null

  const [latitude1, longitude1, latitude2, longitude2] = values.map((value) => (value * Math.PI) / 180)
  const latitudeDelta = latitude2 - latitude1
  const longitudeDelta = longitude2 - longitude1
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(latitude1) * Math.cos(latitude2) * Math.sin(longitudeDelta / 2) ** 2

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
