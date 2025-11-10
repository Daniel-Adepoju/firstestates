export default function ListingPrice({ listingDeets }: any) {
  return (
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
    </div>
  )
}
