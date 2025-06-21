'use client'
import { useSearchParams } from 'next/navigation'
import Main from '@components/Main'
import CardList from '@components/CardList'
import HeroSection from '@components/Hero'

export default function Home() {
  const isPage = useSearchParams().get('page')

  return (
   <>
   {!isPage && <HeroSection />}
   {isPage && <div className='mt-20'></div>}
   <CardList/>
   </>
  );
}