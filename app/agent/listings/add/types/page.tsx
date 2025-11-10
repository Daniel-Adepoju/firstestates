import ListingTiers from "@components/agent/create_listing/ListingTiers"

const AddListingType = () => {
  return (
    <div className="p-2 mt-10">
      <h1 className="text-2xl font-bold mb-3 otherHead">Choose a Listing Tier</h1>
      <ListingTiers />
    </div>
  )
}

export default AddListingType
