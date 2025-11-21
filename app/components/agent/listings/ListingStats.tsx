"use client"

export default function ListingStats({ data, formatNumber }:any) {
  return (
    <div className="adminDashboard_content grid grid-cols-1 md:grid-cols-2 gap-4 dark:text-white self-center">
      <div className="content_item banner full font-head">
        <h3>Renting</h3>
        <div className="text">
          <span>{formatNumber(data?.currentRentings ?? "0")}</span>
        </div>
      </div>

      <div className="content_item banner full font-head">
        <h3>All Listings</h3>
        <div className="text">
          <span>{formatNumber(data?.currentListings ?? "0")}</span>
        </div>
      </div>
    </div>
  )
}
