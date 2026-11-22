"use client"
import Button from "@lib/Button"
import { useEffect, useState } from "react"
import { SlidersHorizontal, ListFilter, X } from "lucide-react"
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
  category: "student" | "residential" | ""
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
  category,
}: FilterProps) => {
  useSignals()
  const params = useSearchParams()
  const searchParams = new URLSearchParams(params.toString())
  const router = useRouter()
  const [school, setSchool] = useState("")
  const [area, setArea] = useState("")
  const [areas, setAreas] = useState<string[]>([])
  const MAX_AMOUNT = 5000000
  const [minPriceState, setMinPriceState] = useState<number>(0)
  const [maxPriceState, setMaxPriceState] = useState<number>(MAX_AMOUNT)
  const [bedsState, setBedsState] = useState("")
  const [bathsState, setBathsState] = useState("")
  const [toiletsState, setToiletsState] = useState("")
  const { schools } = useSchools()
  const isSchoolFocus = params.get("school") !== null

  useEffect(() => {
    if (category === "residential") {
      setSchool("")
      selectedSchool.value = ""
    }
    if (selectedSchool.value && selectedSchool.value !== school) {
      setSchool(selectedSchool.value)
    }
    if (!school) {
      setAreas([])
    }

    const getSchoolArea =
      (schools as any[]).find((s: any) => s.shortname.toLowerCase() === school.toLowerCase())
        ?.schoolAreas ?? []

    if (school) {
      setAreas(getSchoolArea)
    }
  }, [school, schools, category])

  useEffect(() => {
    if (!active.value) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") active.value = false
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [active.value])

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
    router.push(`?${searchParams.toString()}#listing`)
  }

  return (
    <>
      {active.value && (
        <div className="fixed inset-0 z-[210] bg-slate-950/45 backdrop-blur-[2px]" onClick={() => (active.value = false)}>
        <form
          onSubmit={handleSubmit}
          role="dialog"
          aria-modal="true"
          id="listing-filter-dialog"
          aria-labelledby="listing-filter-title"
          onClick={(event) => event.stopPropagation()}
          className="absolute bottom-0 left-0 flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-3xl border border-border/70 bg-background p-4 shadow-2xl sm:max-h-[82vh] sm:p-6 lg:bottom-auto lg:left-0 lg:top-0 lg:h-full lg:max-h-none lg:w-[min(27rem,90vw)] lg:rounded-none lg:rounded-r-3xl"
        >
          {/*  Header */}
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 pb-4 text-left">
            <div className="flex items-center gap-2 text-xl font-extrabold capitalize tracking-wide">
            <ListFilter
              className="inline-block w-6 h-6
             text-foreground"
            />
            <span id="listing-filter-title">{isSchoolFocus ? `Filter ${selectedSchool.value} Listings` : "Filter Listings"}</span>
            </div>
            <button type="button" aria-label="Close filters" onClick={() => (active.value = false)} className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"><X size={20} /></button>
          </header>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto py-4 pr-1">
            {/* School Select */}
            {!isSchoolFocus && category !== "residential" && (
              <div>
                <label
                  htmlFor="school"
                  className="block text-sm font-medium"
                >
                  School {school}
                </label>
                <select
                  id="school"
                  name="school"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="dark:bg-darkGray w-full rounded-lg border border-slate-300 bg-transparent p-2.5 py-3 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600"
                >
                  <option value="">All Schools</option>
                  {schools.map((school: School) => (
                    <option
                      key={school._id}
                      value={school?.shortname?.toLocaleLowerCase()}
                    >
                      {school?.shortname} ({school?.fullname})
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                className="dark:bg-darkGray w-full rounded-lg border border-slate-300 bg-transparent p-2.5 py-3 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600"
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
                  max={MAX_AMOUNT}
                  step={1}
                  onValueChange={([val]) => setMinPriceState(val)}
                  className="
            [&_[role=slider]]:gold-gradient
            [&>span:first-child]:bg-white
            [&_[role=slider]]:outline-slate-200 dark:outline-gray-800-gray-200
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
                  max={MAX_AMOUNT}
                  step={1}
                  inverted={true}
                  onValueChange={([val]) => setMaxPriceState(val)}
                  className="
            [&_[role=slider]]:gold-gradient
            [&>span:first-child]:bg-white
            [&_[role=slider]]:outline-slate-200 dark:outline-gray-800-gray-200
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
                  className="w-16 rounded-lg border border-slate-300 bg-transparent p-2 text-center text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-darkGray"
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
                  className="w-16 rounded-lg border border-slate-300 bg-transparent p-2 text-center text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-darkGray"
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
                  className="w-16 rounded-lg border border-slate-300 bg-transparent p-2 text-center text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-darkGray"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex shrink-0 justify-end border-t border-border/50 pt-4">
            <Button
              type="submit"
              text="Apply Filters"
              className="darkblueBtn group clickable directional flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 font-list font-semibold text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:w-52"
            >
              <SlidersHorizontal
                size={17}
                className="transition-transform duration-200 group-hover:rotate-12"
              />
            </Button>
          </div>
        </form>
        </div>
      )}
    </>
  )
}

export default Filter
