'use client'

import ListingForm from '@components/agent/create_listing/ListingForm'
import { useSearchParams } from 'next/navigation'

const Add = () => {
  const searchParams = useSearchParams()
  const listingTier = searchParams.get('type')

  return (
    <ListingForm listingTier={listingTier} />
  )
}

export default Add