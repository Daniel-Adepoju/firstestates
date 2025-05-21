// components/PopularThisWeek.tsx

'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Listing = {
  _id: string;
  title: string;
  weeklyViews: number;
};

const fetchPopularListings = async (): Promise<Listing[]> => {
  const res = await axios.get('/api/listings/popular-weekly');
  return res.data;
};

export default function PopularThisWeek() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['popularListingsThisWeek'],
    queryFn: fetchPopularListings,
    staleTime: 1000 * 60 * 10, // 10 minutes (optional caching),
  });

  if (isLoading) return <div>Loading popular listings...</div>;
  if (isError) return <div>Failed to load popular listings.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Popular This Week</h2>
      <ul className="space-y-2">
        {data?.map((listing) => (
          <li
            key={listing._id}
            className="border p-4 rounded-lg shadow-md bg-white dark:bg-gray-900"
          >
            <div className="text-lg font-medium">{listing.title}</div>
            <div className="text-sm text-gray-500">
              {listing.weeklyViews} views this week
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
