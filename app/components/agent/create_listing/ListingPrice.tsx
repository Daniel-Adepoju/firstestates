"use client"
import { useSignals } from "@preact/signals-react/runtime"
export default function ListingPrice({ listingDeets }: any) {
  useSignals()

  return (
    <>
      <div className="form_group">
        <label
          htmlFor="price"
          className="mb-1 font-semibold"
        >
          Price (₦)
        </label>
        <input
          type="number"
          name="price"
          id="price"
          placeholder="Enter amount"
          value={listingDeets.price.value}
          onChange={(e) => (listingDeets.price.value = e.target.value)}
          className="w-full border rounded p-2 dark:bg-darkGray dark:text-white"
        />

        {/* Price Unit */}
        <label
          htmlFor="priceUnit"
          className="mb-1 mt-4 font-semibold"
        >
          Price Unit
        </label>
        <select
          name="priceUnit"
          id="priceUnit"
          value={listingDeets.priceUnit.value}
          required
          onChange={(e) => (listingDeets.priceUnit.value = e.target.value)}
          className="w-full border rounded p-2  dark:bg-darkGray dark:text-white"
        >
          <option value="">Select Price Unit </option>
          <option value="entireUnit">Entire Unit </option>
          <option value="perPerson">Per Person</option>
          <option value="perRoom">Per Room</option>
        </select>

           {/* Price Duration */}
      <label
        htmlFor="priceDuration"
        className="mb-1 mt-4 font-semibold"
      >
        Price Duration
      </label>
      <select
        name="priceDuration"
        id="priceDuration"
        required
        value={listingDeets.priceDuration.value}
        onChange={(e) => (listingDeets.priceDuration.value = e.target.value)}
        className="w-full leading-26 border rounded p-2  dark:bg-darkGray dark:text-white"
      >
        <option value="">Select Price Duration </option>
        <option value="perYear">Per Year</option>
        <option value="perMonth">Per Month</option>
        {/* <option value="perDay">Per Day</option> */}
      </select>
      </div>

   
    </>
  )
}
