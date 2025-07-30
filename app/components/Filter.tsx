"use client"
import Button from "@lib/Button"
import { useEffect, useState } from "react"
import { useUser } from "@utils/user"
import { schoolArea, schools } from "@lib/constants"
import { useRouter, useSearchParams } from "next/navigation"
import { Signal } from "@preact/signals-react"
import { useSignals } from "@preact/signals-react/runtime"
import { Slider } from "./ui/slider"

interface FilterProps {
  selectedSchool: Record<string, any>
  selectedArea: Record<string, any>
  minPrice: Record<string, any>
  maxPrice: Record<string, any>
  beds: Record<string, any>
  baths: Record<string, any>
  toilets: Record<string, any>
  active: Signal<boolean>
}

const Filter = ({
  active,
  selectedSchool,
  selectedArea,
  minPrice,
  maxPrice,
  beds,
  baths,
  toilets,
}: FilterProps) => {
  useSignals()
  const params = useSearchParams()
  const searchParams = new URLSearchParams(params.toString())
  const router = useRouter()
  const [school, setSchool] = useState("")
  const [area, setArea] = useState("")
  const [areas, setAreas] = useState<string[]>([])
  const [minPriceState, setMinPriceState] = useState<number>(0)
  const [maxPriceState, setMaxPriceState] = useState<number>(2000000)
  const [bedsState, setBedsState] = useState("")
  const [bathsState, setBathsState] = useState("")
  const [toiletsState, setToiletsState] = useState("")
  const { session } = useUser()

  useEffect(() => {
    if (!school) {
      setAreas([])
    }
    if (school) {
      setAreas(schoolArea[school as keyof typeof schoolArea])
    }
  }, [school])

  useEffect(() => {
    if (session) {
      setSchool(session?.user.school ?? "")
    }
  }, [session])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    active.value = false
    selectedSchool.value = school
    selectedArea.value = area
    minPrice.value = minPriceState
    maxPrice.value = maxPriceState
    beds.value = bedsState
    baths.value = bathsState
    toilets.value = toiletsState

    searchParams.set("page", "1")
    router.push(`?${searchParams.toString()}`)
  }

  return (
    <>
      {active.value && (
        <form
          onSubmit={handleSubmit}
          className="dark:bg-gray-600 bg-white mx-auto w-[88%] p-4 rounded-xl shadow space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* School Select */}
            <div>
              <label className="block text-sm font-medium">School</label>
              <select
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="dark:bg-gray-600 w-full border rounded p-2"
              >
                <option value="">All Schools</option>
                {schools.map((school) => (
                  <option
                    key={school}
                    value={school}
                  >
                    {school}
                  </option>
                ))}
              </select>
            </div>

            {/* Area Select */}
            <div>
              <label className="block text-sm font-medium">Area</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="dark:bg-gray-600 w-full border rounded p-2"
              >
                <option value="">All Areas</option>
                {areas.map((area) => (
                  <option
                    key={area}
                    value={area}
                  >
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="flex gap-2">
            
              <div className="w-1/2">
                <label className="p-2 block text-sm font-medium">Min Price Range</label>
              <Slider
                value={[minPriceState]}
                min={0}
                max={2000000}
                step={1}
                onValueChange={([val]) => setMinPriceState(val)}
                className="
            [&_[role=slider]]:bg-[#0874c7]
            [&_[role=slider]]:dark:bg-[#A88F6E]
            [&>span:first-child]:bg-white
            [&_[role=slider]]:border-gray-200
            [&_[data-state=active]]:ring-gray-200"
              />
                <div className="ml-4">&#8358; {minPriceState.toLocaleString()}</div>
              </div>
              <div className="w-1/2 direction-rtl">
                <label className="p-2 block text-sm font-medium">Max Price Range</label>
                    <Slider
                value={[maxPriceState]}
                min={0}
                max={2000000}
                step={1}
                inverted={true}
                onValueChange={([val]) => setMaxPriceState(val)}
                className="
            [&_[role=slider]]:bg-[#0874c7]
            [&_[role=slider]]:dark:bg-[#A88F6E]
            [&>span:first-child]:bg-white
            [&_[role=slider]]:border-gray-200
            [&_[data-state=active]]:ring-gray-200"
              />
                <div className="ml-4">&#8358; {maxPriceState.toLocaleString()}</div>
              </div>
            </div>

            {/*beds toilets etc */}
            <div className="flex flex-row justify-evenly gap-2">
              <div className="flex flex-col items-center">
                <label className="text-sm">Bedrooms</label>
                <input
                  type="number"
                  min={0}
                  value={bedsState}
                  placeholder="0"
                  onChange={(e) => setBedsState(e.target.value)}
                  className="w-16 p-1 border rounded text-center dark:bg-gray-600"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-sm">Bathrooms</label>
                <input
                  type="number"
                  min={0}
                  value={bathsState}
                  placeholder="0"
                  onChange={(e) => setBathsState(e.target.value)}
                  className="w-16 p-1 border rounded text-center dark:bg-gray-600"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-sm">Toilets</label>
                <input
                  type="number"
                  min={0}
                  value={toiletsState}
                  placeholder="0"
                  onChange={(e) => setToiletsState(e.target.value)}
                  className="w-16 p-1 border rounded text-center dark:bg-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              text="Apply Filters"
              className="darkblueBtn clickable directional p-2 w-50"
            ></Button>
          </div>
        </form>
      )}
    </>
  )
}

export default Filter
