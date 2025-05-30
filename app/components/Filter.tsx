'use client'
import Button from "@lib/Button"
import { useEffect, useState } from "react"
import { useUser } from "@utils/user"

interface FilterProps {
    selectedSchool: Record<string, any>;
    selectedArea: Record<string,any>;
    selectedPrice: Record<string,any>;
    active:boolean;
} 
const schoolArea = {
  "North West": ["Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe"],
  "North East": ["Benue", "Borno", "Gombe", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Ogun", "Ondo", "Osun", "Oyo"],
  "Lasu": ["First Gate","Iyana School","Ipaye","Post Office"]
}
const schools = Object.keys(schoolArea)
const Filter = ({active,selectedSchool, selectedArea,selectedPrice}: FilterProps) => {
  const [school, setSchool] = useState("")
  const [area, setArea] = useState("")
  const [areas,setAreas] = useState<string[]>([])
  const [price, setPrice] = useState<number>(0)
  const {session} = useUser()

useEffect(() => {
  if(!school) {
    setAreas([])
  }
  if(school) {
    setAreas(schoolArea[school as keyof typeof schoolArea])
  }
},[school])

useEffect(() => {
  if(session) {
    setSchool(session?.user.school)
  }
},[session])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    selectedSchool.value = school
    selectedArea.value = area
    selectedPrice.value = price
  }

  return (
    <>
   
  {active && 
  <form onSubmit={handleSubmit} className="dark:bg-gray-600 bg-white mx-auto w-[80%] p-4 rounded-xl shadow space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* School Select */}
        <div>
          <label className="block text-sm font-medium">School</label>
          <select
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">All Schools</option>
            {schools.map((school) => (
        <option key={school} value={school}
        >{school}</option>
            ))}
          </select>
        </div>

        {/* Area Select */}
        <div>
          <label className="block text-sm font-medium">Area</label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">All Areas</option>
            {areas.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

    

        {/* Price Range */}
        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="p-2 block text-sm font-medium">Minimum Price Range</label>
            <input
            type="range"
            value={price}
            min={0}
            max={2000000}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full border rounded "
              placeholder="₦0"
            />
    <div className="ml-4">&#8358; {price.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          text='Apply Filters'
          className="darkblueBtn clickable directional p-2">
        </Button>
      </div>
 
    </form>}
    </>
  )
}

export default Filter
