"use client"

import Searchbar from "@components/Searchbar"
import { useSignal, useSignals } from "@preact/signals-react/runtime"
import { useGetUsers } from "@lib/customApi"
import Pagination from "@components/Pagination"
import UsersCard, { User } from "@components/UsersCard"
import { Loader } from "@utils/loaders"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface UsersData {
  users: User[]
  cursor: number | string
  numOfPages: number | string
}

const GetUsers = () => {
  useSignals()
  const limit = useSignal(10)
  const page = useSearchParams().get("page") || "1"
  const search = useSignal("")
  const debounced = useSignal("")
  const params = useSearchParams()
  const searchParams = new URLSearchParams(params.toString())
  const router = useRouter()
  const menuId = useSignal("");

  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchParams.set("page", "1")
      router.push(`?${searchParams.toString()}`)
      debounced.value = search.value
    }, 560)
    return () => clearTimeout(timeoutId)
  }, [search.value])

  const { data, isLoading } = useGetUsers({
    limit: limit.value,
    page: page,
    search: debounced.value,
  })

  return (
    <>
      <div className="container mx-auto py-8">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <div className="w-full flex flex-row justify-center items-center">
          <Searchbar
            search={search.value}
            setSearch={(e) => (search.value = e.target.value)}
            placeholder={"Search for users"}
            className="my-6 gap-1 w-full flex flex-row justify-center items-center md:justify-end  md:w-[60%]"
          />
          </div>
        </div>

        {isLoading && <Loader className="my-18" />}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data as UsersData | undefined)?.users.map((user) => (
            <div key={user._id}>
              <UsersCard user={user} menuId={menuId}/>
            </div>
          ))}
        </div>
      </div>
      {!isLoading && (
        <Pagination
          currentPage={Number(data?.cursor)}
          totalPages={Number(data?.numOfPages)}
        />
      )}
    </>
  )
}

export default GetUsers
