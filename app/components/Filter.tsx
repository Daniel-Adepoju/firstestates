"use client"
import Button from "@lib/Button"
import { useEffect, useState } from "react"
import { useUser } from "@utils/user"
import { useRouter, useSearchParams } from "next/navigation"
import { Signal } from "@preact/signals-react"
import { useSignals } from "@preact/signals-react/runtime"
import { Slider } from "./ui/slider"
import { useSchools } from "@lib/useSchools"

interface FilterProps {
  selectedSchool: Record<string, any>
  selectedArea: Record<string, any>
  minPrice: Record<string, any>
  maxPrice: Record<string, any>
  beds: Record<string, any>
  baths: Record<string, any>
  toilets: Record<string, any>
  active: Signal<boolean>
  statusVal: Signal<string>
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
  statusVal,
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
  const [status, setStatus] = useState("")
  const { session } = useUser()
  const { schools } = useSchools()

  const schoolArea = schools
    .filter((s: any) => s.shortname.toLocaleLowerCase() === school.toLocaleLowerCase())
    .map((s: any) => s.schoolAreas)
    .flat()

  useEffect(() => {
    if (!school) {
      setAreas([])
    }
    if (school) {
      setAreas(schoolArea)
    }
  }, [school])

  // useEffect(() => {
  //   if (session) {
  //     setSchool(session?.user.school ?? "")
  //   }
  // }, [session])

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
    statusVal.value = status
    searchParams.set("page", "1")
    router.push(`?${searchParams.toString()}#listing`)
  }

  return (
    <>
      {active.value && (
        <form
          onSubmit={handleSubmit}
          className="dark:bg-darkGray bg-white mx-auto w-[88%] p-4 rounded-xl shadow space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="dark:bg-darkGray w-full border rounded-sm p-2 py-2.5"
              >
                <option value="">All</option>
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
              </select>
            </div>

            {/* School Select */}
            <div>
              <label
                htmlFor="school"
                className="block text-sm font-medium"
              >
                School
              </label>
              <select
                id="school"
                name="school"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="dark:bg-darkGray w-full border rounded-sm p-2 py-2.5"
              >
                <option value="">All Schools</option>
                {schools.map((school: School) => (
                  <option
                    key={school._id}
                    value={school?.shortname}
                  >
                    {school?.shortname} ({school?.fullname})
                  </option>
                ))}
              </select>
            </div>

            {/* Area Select */}
            <div>
              <label
                htmlFor="area"
                className="block text-sm font-medium"
              >
                Area
              </label>
              <select
                id="area"
                name="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="dark:bg-darkGray w-full border rounded-sm p-2 py-2.5"
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
                <label
                  htmlFor="minPrice"
                  className="p-2 block text-sm font-medium"
                >
                  Min Price Range
                </label>
                <Slider
                  id="minPrice"
                  name="minPrice"
                  value={[minPriceState]}
                  min={0}
                  max={2000000}
                  step={1}
                  onValueChange={([val]) => setMinPriceState(val)}
                  className="
            [&_[role=slider]]:gold-gradient
            [&>span:first-child]:bg-white
            [&_[role=slider]]:border-gray-200
            [&_[data-state=active]]:ring-gray-200"
                />
                <div className="ml-4">&#8358; {minPriceState.toLocaleString()}</div>
              </div>
              <div className="w-1/2 direction-rtl">
                <label
                  htmlFor="maxPrice"
                  className="p-2 block text-sm font-medium"
                >
                  Max Price Range
                </label>
                <Slider
                  id="maxPrice"
                  name="maxPrice"
                  value={[maxPriceState]}
                  min={0}
                  max={2000000}
                  step={1}
                  inverted={true}
                  onValueChange={([val]) => setMaxPriceState(val)}
                  className="
            [&_[role=slider]]:gold-gradient
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
                <label
                  htmlFor="bedrooms"
                  className="text-sm"
                >
                  Bedrooms
                </label>
                <input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  min={0}
                  value={bedsState}
                  placeholder="0"
                  onChange={(e) => setBedsState(e.target.value)}
                  className="w-16 p-1 border rounded text-center dark:bg-darkGray"
                />
              </div>
              <div className="flex flex-col items-center">
                <label
                  htmlFor="bathrooms"
                  className="text-sm"
                >
                  Bathrooms
                </label>
                <input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  min={0}
                  value={bathsState}
                  placeholder="0"
                  onChange={(e) => setBathsState(e.target.value)}
                  className="w-16 p-1 border rounded text-center dark:bg-darkGray"
                />
              </div>
              <div className="flex flex-col items-center">
                <label
                  htmlFor="toilets"
                  className="text-sm"
                >
                  Toilets
                </label>
                <input
                  id="toilets"
                  name="toilets"
                  type="number"
                  min={0}
                  value={toiletsState}
                  placeholder="0"
                  onChange={(e) => setToiletsState(e.target.value)}
                  className="w-16 p-1 border rounded text-center dark:bg-darkGray"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end ">
            <Button
              type="submit"
              text="Apply Filters"
              className="darkblueBtn clickable font-list directional font-medium text-sm p-2 w-50"
            ></Button>
          </div>
        </form>
      )}
    </>
  )
}

export default Filter
