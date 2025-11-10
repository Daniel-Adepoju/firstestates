interface ListingLocationProps {
  listingDeets: any
  school: string
  setSchool: (value: string) => void
  area: string
  setArea: (value: string) => void
  schools: any[]
  areas: string[]
}

export default function ListingLocation({
  listingDeets,
  school,
  setSchool,
  area,
  setArea,
  schools,
  areas,
}: ListingLocationProps) {
  return (
    <>
      {/* Address */}
      <div className="form_group">
        <label
          htmlFor="address"
          className="mb-1 font-semibold"
        >
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          placeholder="Enter the address"
          value={listingDeets?.address.value}
          onChange={(e) => (listingDeets.address.value = e.target.value)}
          className="w-full border rounded p-2 dark:bg-darkGray dark:text-white"
        />
      </div>

      {/* School Select */}
      <div className="form_group">
        <label
          htmlFor="school"
          className="mb-1 font-semibold"
        >
          School
        </label>
        <select
          id="school"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          className="w-full border rounded p-2 dark:bg-darkGray dark:text-white"
        >
          <option value="">Select a school</option>
          {schools.map((school) => (
            <option
              key={school._id}
              value={school.shortname}
            >
              {school.shortname} ({school.fullname})
            </option>
          ))}
        </select>
      </div>

      {/* Location Select */}
      <div className="form_group">
        <label
          htmlFor="area"
          className="mb-1 font-semibold"
        >
          Location
        </label>
        <select
          id="area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full border rounded p-2 dark:bg-darkGray dark:text-white"
        >
          <option value="">Select a location</option>
          {areas.map((loc) => (
            <option
              key={loc}
              value={loc}
            >
              {loc}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}
