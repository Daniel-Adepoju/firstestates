const normalize = (value) =>
  String(value || "")
    .toLocaleLowerCase()
    .normalize("NFKC")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")

/**
 * Resolve a listing's free-text school value without guessing between schools.
 * Exact matches against shortname and fullname are intentionally required.
 */
export const matchSchool = (listingSchool, schools) => {
  const value = normalize(listingSchool)
  if (!value || !Array.isArray(schools)) return null

  const matches = schools.filter((school) =>
    [school?.shortname, school?.fullname].some((name) => normalize(name) === value),
  )

  return matches.length === 1 ? matches[0] : null
}

export { normalize as normalizeSchoolName }
