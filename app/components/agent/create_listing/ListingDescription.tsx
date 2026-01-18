import { useState } from "react"
import { listingTypes } from "@lib/constants"

export default function ListingDescription({ listingDeets }: any) {
  const [descLength, setDescLength] = useState(0)

  const handleChange = (e: any) => {
    const value = e.target.value.slice(0, 600)
    listingDeets.description.value = value
    setDescLength(value.length)
  }

  return (
    <>
      <div className="form_group relative">
        {/* Listing Type */}

        <label
          className="font-semibold mb-1"
          htmlFor="listingType"
        >
          Listing Type
        </label>
        <select
          name="listingType"
          value={listingDeets.listingType.value}
          onChange={(e) => (listingDeets.listingType.value = e.target.value)}
          className="w-full border rounded p-3 dark:bg-darkGray dark:text-white"
        >
          <option>Select Listing Type </option>
          {listingTypes.map((type) => (
            <option
              key={type}
              value={type}
            >
              {type}
            </option>
          ))}
        </select>

        {/* Desc */}
        <label
          className="font-semibold mb-1"
          htmlFor="description"
        >
          Description
        </label>
        <div className="text-xs tracking-wide text-foreground break-words">
          {" "}
          Use the description to provide additional details, such as kitchen availability, whether a
          roommate is required, any extra utility costs, and differences between the first year's
          rent and subsequent years.{" "}
        </div>
        <textarea
          id="description"
          name="description"
          value={listingDeets.description.value}
          onChange={handleChange}
          placeholder="Enter description (max 600 chars)"
          className="pb-5 placeholder-gray-400 nobar resize-none h-60 dark:bg-darkGray"
        />
        <div className="absolute bottom-0 right-[5%] text-sm font-bold dark:text-white">
          {descLength}/600
        </div>
      </div>
    </>
  )
}
