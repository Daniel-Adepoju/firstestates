"use client"
import Image from "next/image"
import Searchbar from "@components/Searchbar"
import { Plus, Loader2, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useGetSchools } from "@lib/customApi"
import { Skeleton } from "@components/ui/skeleton"
import Button from "@lib/Button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosdata } from "@utils/axiosUrl"
import { useNextPage } from "@lib/useIntersection"
import { useToast } from "@utils/Toast"

const Schools = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [debounced, setDebounced] = useState("")
  const [showForm, setShowForm] = useState(false)
  const {setToastValues} = useToast()
  const [formValues, setFormValues] = useState({
    fullname: "",
    shortname: "",
    logo: "",
    address: "",
  })
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetSchools({
    search: debounced,
  })
  const ref = useNextPage({ isLoading, hasNextPage, fetchNextPage })

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(search)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
  }

  const addSchool = async (val: any) => {
    try {
      const response = await axiosdata.value.post("/api/schools", val)
      setToastValues({
        isActive: true,
        message: "School added successfully",
        status: "success",
        duration: 2000,
      })
      return response.data
    } catch (err) {
      throw new Error("Error adding school")
    }
  }

  const addSchoolMutation = useMutation({
    mutationKey: ["addSchool"],
    mutationFn: addSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] })
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addSchoolMutation.mutate(formValues)
    setFormValues({
      fullname: "",
      shortname: "",
      logo: "",
      address: "",
    })
    setShowForm(false)
  }

  return (
    <div className="w-full flex flex-col pb-3">
      <h2 className="otherHead mx-auto text-2xl font-bold mb-6">List of Available Schools</h2>
      <Searchbar
        search={search}
        setSearch={(e) => setSearch(e.target.value)}
        placeholder="Search for schools"
        className="mb-8 mx-auto gap-1 w-full flex flex-row justify-center items-center md:justify-end  md:w-[60%]"
      />
      <div
        onClick={() => setShowForm(!showForm)}
        className="clickable  flex self-end mr-8 cursor-pointer bg-darkblue dark:bg-coffee text-white px-4 py-2 rounded-md smallScale"
      >
        <span className="font-bold">Add School</span>

        {showForm ? <X /> : <Plus className="ml-2" />}
      </div>

      {/* form */}
      <div
        className={`${
          !showForm && "hidden"
        } mt-4 w-[90%] md:w-[70%] lg:w-[60%] mx-auto p-4 border rounded-md shadow-md`}
      >
        <form
          className="flex flex-col form "
          onSubmit={handleSubmit}
        >
          <label htmlFor="fullname">Fullname:</label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            placeholder="Enter full name"
            required
            value={formValues.fullname}
            onChange={handleInputChange}
          />

          <label htmlFor="shortname">Shortname:</label>
          <input
            type="text"
            id="shortname"
            name="shortname"
            placeholder="Enter short name"
            value={formValues.shortname}
            onChange={handleInputChange}
          />

          <label htmlFor="logo">Logo Link:</label>
          <input
            type="url"
            id="logo"
            name="logo"
            placeholder="Enter logo URL"
            value={formValues.logo}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Enter address"
            value={formValues.address}
            onChange={handleInputChange}
            required
          />

          <Button
            className="darkblueBtn clickable directional w-50 p-2  mx-auto my-4"
            type="submit"
            text="Add School"
            disabled={addSchoolMutation.isPending}
          >
            {addSchoolMutation.isPending && <Loader2 className="animate-spin mr-2" />}
          </Button>
        </form>
      </div>

      {/* schools */}
      <div className="flex flex-col gap-8  items-start mt-8 ml-2 lg:ml-8">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              className="inline-block h-20  w-full md:w-150 lg:w-200 rounded-md bg-gray-500/20 mb-6"
            />
          ))
        ) : data?.pages[0].schools.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300 text-2xl font-bold">No school found</p>
        ) : (
          <>
            {data?.pages?.flatMap((items: any) => {
              return items.schools.map((school: any, index: number) => (
                <Link
                  key={school._id}
                  ref={index === items.schools.length - 1 ? ref : null}
                  href={`/admin/schools/${school._id}`}
                  className="w-full md:w-150 lg:w-200 flex p-2 dark:bg-darkGray shadow-sm dark:shadow-black rounded-md hover:shadow-lg transition"
                >
                  <div className="schoolLogo">
                    <Image
                      src={school?.logo}
                      width={60}
                      height={60}
                      alt="school logo"
                      className="rounded-full border-2 border-gray-300"
                    />
                  </div>
                  <div className="flex flex-col ml-2">
                    <h2 className="text-lg font-bold">{school?.shortname}</h2>
                    <h3 className="text-sm">{school?.fullname}</h3>
                    <p className="text-xs">{school?.address}</p>
                  </div>
                </Link>
              ))
            })}
            {isFetchingNextPage && (
              <Loader2 className="animate-spin mx-auto my-2 text-gray-500 dark:text-gray-300" />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Schools
