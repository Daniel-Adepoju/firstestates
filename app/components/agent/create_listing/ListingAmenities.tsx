import React from "react"

export default function ListingAmenities({ listingDeets, handleInputChange }: any) {
  if (!listingDeets) return null

  const fields = [
    { key: "bedrooms", label: "Bedrooms" },
    { key: "bathrooms", label: "Bathrooms" },
    { key: "toilets", label: "Toilets" },
  ]

  return (
    <div className="form_group amenities">
      <label className="group_label font-semibold">Amenities</label>
      <div className="items flex flex-row gap-4">
        {fields.map((f) => (
          <div
            key={f.key}
            className="flex flex-col"
          >
            <label
              className="font-semibold mb-0.5"
              htmlFor={f.key}
            >
              {f.label}
            </label>
            <input
              id={f.key}
              name={f.key}
              type="number"
              placeholder="0"
              value={listingDeets[f.key].value || ""}
              onChange={handleInputChange}
              className="border rounded p-2 dark:text-white dark:bg-darkGray"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
