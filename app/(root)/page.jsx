"use client"
import { useSearchParams } from "next/navigation"
import CardList from "@components/HomePage"
import HeroSection from "@components/Hero"
import Card from "@components/Card"
import CardOptions from "@components/CardOptions"

export default function Home() {
  const isPage = useSearchParams().get("page")

  return (
    <>
      {!isPage && <HeroSection />}
      {isPage && <div className="mt-20"></div>}
      <CardList />
      {/* <Card listing={listing}/> */}
      {/* <CardOptions /> */}
    </>
  )
}
