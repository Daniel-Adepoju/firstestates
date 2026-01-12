"use client"

import Typewriter from "@components/Typewriter"

const EditListingDetails = ({
  listingDeets,
  descriptionLength,
  handleInputChange,
  areas,
  area,
  setArea,
}) => {
  return (
    <>
      {/* notes */}
      {/* <Typewriter
        text="Note: changing status from available to rented will yield the following effects: 1) the listing will no longer appear in search results 2) potential tenants will not be able to view the listing 3) the listing will be marked as rented on your dashboard."
        className="m-0 p-0 mb-1 text-md text-gray-500 dark:text-gray-300"
        waitTime={50000}
      /> */}

      {/* Desc */}
      <div className="form_group relative">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={listingDeets.description.value}
          onChange={handleInputChange}
          placeholder="Enter a description, it cannot be more than 600 characters"
          className="pb-5 nobar placeholder-gray-500 resize-none h-60"
        />
        <div className="otherHead backdrop-blur-sm text-xs font-list font-bold absolute bottom-0 right-[5%]">
          {descriptionLength}/600
        </div>
      </div>

      {/* Price */}
      <div className="form_group">
        <label htmlFor="price">Price</label>
        <input
          id="price"
          name="price"
          type="number"
          value={listingDeets.price.value}
          onChange={handleInputChange}
          placeholder="Enter the price"
        />
      </div>

      {/* Amenities */}
      <div className="form_group amenities">
        <label htmlFor="amenities">Amenities</label>
        <div className="items">
          <div>
            <label htmlFor="bedrooms">Bedrooms</label>
            <input
              id="bedrooms"
              name="bedrooms"
              type="number"
              value={listingDeets.bedrooms.value}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="bathrooms">Bathrooms</label>
            <input
              id="bathrooms"
              name="bathrooms"
              type="number"
              value={listingDeets.bathrooms.value}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="toilets">Toilets</label>
            <input
              id="toilets"
              name="toilets"
              type="number"
              value={listingDeets.toilets.value}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="form_group">
        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          type="text"
          value={listingDeets.address.value}
          onChange={handleInputChange}
          placeholder="Enter the address"
        />
      </div>

      {/* Location */}
      <div className="form_group">
        <label>Location</label>
        <select
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

export default EditListingDetails
