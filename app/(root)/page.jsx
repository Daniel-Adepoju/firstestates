'use client'
import { useSearchParams } from 'next/navigation'
import CardList from '@components/CardList'
import HeroSection from '@components/Hero'
import Card from '@components/Card'
import CardOptions from '@components/CardOptions'

export default function Home() {
  const isPage = useSearchParams().get('page')
let listing = {
  _id: "lst_001",
  address: "12 Palm Grove Avenue, Lekki Phase 1, Lagos",
  location: "Lagos, Nigeria",
  image: "igy0tozve5oyjrsfmq3o",
  price: "₦450,000 / year",
  description: "Spacious modern hostel room located near the university with easy access to transport and shops.",
  bedrooms: 1,
  bathrooms: 1,
  toilets: 1,
  agent: {
    _id: "agt_101",
    name: "Chinedu Okafor",
    phone: "+2348100000000",
    email: "chinedu@firstestates.com",
    avatar: "/agents/chinedu.jpg",
  },
  mainImage: "igy0tozve5oyjrsfmq3o",
  gallery: [
    "igy0tozve5oyjrsfmq3o",
    "x83hf8b2d1hjf02lx7b9",
    "k2mdp39dlq9wqf7ujw4a",
  ],
  reportedBy: [],
  createdAt: new Date().toISOString(),
  status: "available",
  school: "Unilag",
  weeklyViews: 42,
  totalViews: 385,
  isFeatured: true,
}
  return (
   <>
   {!isPage && <HeroSection />}
   {isPage && <div className='mt-20'></div>}
   <CardList/>
   {/* <Card listing={listing}/> */}
   {/* <CardOptions /> */}
   </>
  );
}