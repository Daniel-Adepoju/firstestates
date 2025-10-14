"use client"
import Image from "next/image"
import { Plus, Trash, Loader2, X } from "lucide-react"
import { Skeleton } from "@components/ui/skeleton"
import { axiosdata } from "@utils/axiosUrl"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Button from "@lib/Button"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useToast } from "@utils/Toast"

const SchoolView = () => {
  const queryClient = useQueryClient()
  const params = useParams()
  const schoolId = params.id
  const [showForm, setShowForm] = useState(false)
  const [areaValue, setAreaValue] = useState("")
  const [selectedAreaIndex, setSelectedAreaIndex] = useState<number | null>(null)
 const {setToastValues} = useToast()
  const fetchData = async () => {
    try {
      const res = await axiosdata.value.get(`/api/schools/${schoolId}`)
      return res.data
    } catch (err) {
      console.error("Error fetching school data", err)
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ["schools", schoolId],
    queryFn: fetchData,
    enabled: !!schoolId,
  })

  const addArea = async (val: any) => {
    try {
      const response = await axiosdata.value.patch(`/api/schools/${schoolId}`, val)
  setToastValues({
        isActive: true,
        message: "School area added successfully",
        status: "success",
        duration: 2000,
      })
      return response.data
    } catch (err) {
      throw new Error("Error adding area")
    }
  }
  const removeArea = async (val: any) => {
    try {
      const response = await axiosdata.value.patch(`/api/schools/${schoolId}?deleteArea=true`, val)
      setToastValues({
        isActive: true,
        message: "School area removed successfully",
        status: "success",
        duration: 2000,
      })
      setSelectedAreaIndex(null)
      return response.data
    } catch (err) {
      throw new Error("Error removing area")
    }
  }

  const addAreaMutation = useMutation({
    mutationKey: ["addArea"],
    mutationFn: addArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools", schoolId] })
      setAreaValue("")
      setShowForm(false)
    },
  })

  const removeAreaMutation = useMutation({
    mutationKey: ["removeArea"],
    mutationFn: removeArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools", schoolId] })
      setAreaValue("")
      setShowForm(false)
    },
  })

  return (
    <div className="w-full flex flex-col">
    
      {/* school */}
      <div className="flex flex-col items-center gap-2 mt-8">
        {isLoading ? (
          <Skeleton className="w-24 h-24 rounded-full border-2 border-gray-300" />
        ) : (
          <Image
            src={data?.logo}
            width={100}
            height={100}
            alt="school logo"
            className="rounded-full border-2 border-gray-300"
          />
        )}
        <h1 className="otherHead text-lg font-bold">{data?.shortname}</h1>
        <h2 className="text-md">{data?.fullname}</h2>
      </div>

      {/* school area */}
      <div
        onClick={() => setShowForm(!showForm)}
        className="clickable  flex self-center-safe md:self-end mt-8 mr-8 cursor-pointer bg-darkblue dark:bg-coffee text-white px-4 py-2 rounded-md smallScale"
      >
        <span className="font-bold">Add School Area</span>
        {showForm ? <X className="ml-2" /> : <Plus className="ml-2" />}
      </div>

      <div
        className={`${
          !showForm && "hidden"
        } mt-4 w-[90%] md:w-[70%] lg:w-[60%] mx-auto p-4 border rounded-md shadow-md`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            addAreaMutation.mutate({ areaValue })
          }}
          className="form"
        >
          <label htmlFor="areaValue">School Area</label>
          <input
            type="text"
            placeholder="Add new school area"
            value={areaValue}
            onChange={(e) => setAreaValue(e.target.value)}
            required
          />
          <Button
            text="Add Area"
            type="submit"
            className="clickable darkblueBtn directional w-60 mt-4"
          >
            {addAreaMutation.isPending && <Loader2 className="animate-spin mr-2" />}
          </Button>
        </form>
      </div>

      <h3 className="text-lg font-semibold mt-4">School Areas</h3>
      <p className="text-sm text-gray-400">Clicking the trash button deletes the selected area</p>
      <div className="flex flex-wrap gap-8  items-start mt-4 ml-2 lg:ml-8 mb-8">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-50 h-10 p-2 shadow-xs rounded-md transition bg-gray-500/20"
              />
            ))
          : data?.schoolAreas.map((area: any, i: number) => (
              <div
                key={i}
                className="w-50 flex justify-between p-2 shadow-md rounded-md hover:shadow-lg transition"
              >
                <span>{area}</span>
                {removeAreaMutation.isPending && i === selectedAreaIndex ? (
                  <Loader2 className="animate-spin mr-2 text-red-700" />
                ) : (
                  <Trash
                    onClick={() => {
                      removeAreaMutation.mutate({ areaValue: area })
                      setSelectedAreaIndex(i)
                    }}
                    className="clickable ml-2 cursor-pointer text-red-700"
                  />
                )}
              </div>
            ))}
        {data?.schoolAreas.length === 0 && !isLoading && (
          <p className="text-gray-500 dark:text-gray-300 text-2xl font-bold">
            No school area added yet
          </p>
        )}
      </div>
    </div>
  )
}

export default SchoolView
