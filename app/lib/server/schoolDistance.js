import School from "@models/school"
import { geocodeAddress } from "./geocoding"
import { haversineDistanceKm } from "./distance"
import { matchSchool } from "./schoolMatching"

const coordinatesFor = async (document, address, Model) => {
  if (!address) return null
  if (
    document?.geocoding?.sourceAddress === address &&
    Number.isFinite(document?.geocoding?.latitude) &&
    Number.isFinite(document?.geocoding?.longitude)
  ) {
    return document.geocoding
  }

  const coordinates = await geocodeAddress(address)
  if (!coordinates) return null
  await Model.updateOne(
    { _id: document._id },
    { $set: { geocoding: { ...coordinates, sourceAddress: address, geocodedAt: new Date() } } },
  )
  return { ...coordinates, sourceAddress: address }
}

export const getSchoolDistance = async (listing, ListingModel) => {
  if (!listing?.school || listing?.category === "residential" || !listing?.address) return null

  const schools = await School.find({}).lean()
  const school = matchSchool(listing.school, schools)
  if (!school?.address) return null

  const [schoolCoordinates, listingCoordinates] = await Promise.all([
    coordinatesFor(school, school.address, School),
    coordinatesFor(listing, listing.address, ListingModel),
  ])
  const distance = haversineDistanceKm(schoolCoordinates, listingCoordinates)
  return distance === null ? null : Number(distance.toFixed(1))
}
