import { useState, useEffect } from "react"
import { useBackdrop } from "@lib/Backdrop"
import Searchbar from "@components/Searchbar"
import { Loader2, PlusCircleIcon, Trash, UserSearch, X } from "lucide-react"
import Button from "@lib/Button"
import { WhiteLoader } from "@utils/loaders"
import { useGetUsers } from "@lib/customApi"
import { CldImage } from "next-cloudinary"
import { Skeleton } from "@components/ui/skeleton"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosdata } from "@utils/axiosUrl"
import { useToast } from "@utils/Toast"

const AddResident = ({ listingId }: { listingId?: string }) => {
  const queryClient = useQueryClient()
  const { setBackdrop } = useBackdrop()
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedUserId, setSelectedUserId] = useState("")
  const { setToastValues } = useToast()

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => clearTimeout(timeout)
  }, [search])

  const { data: usersdata, isLoading: usersLoading } = useGetUsers({
    search: debouncedSearch,
    limit: 10,
  })

  const addResident = async (val: any) => {
    try {
      const res = await axiosdata.value.post("/api/listings/inhabitants", val)
      if (res.status === 201) {
        setToastValues({
          isActive: true,
          message: "Resident added successfully",
          status: "success",
          duration: 2000,
        })
        setSearch("")
        setSelectedUserId("")
        setBackdrop({ isOptionsOpen: false })
      } else {
        setToastValues({
          isActive: true,
          message: "Failed to add resident",
          status: "danger",
          duration: 2000,
        })
      }
      return res.data
    } catch (err) {
      console.log(err)
    }
  }

  const addResidentMutation = useMutation({
    mutationFn: addResident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inhabitants"] })
      setBackdrop({ isOptionsOpen: false })
    },
  })

  const handleAddResident = (userId: string) => {
    setSelectedUserId(userId)
    addResidentMutation.mutate({
      val: {
        listing: listingId,
        user: userId,
      },
    })
  }

  const mappedUsers = usersdata?.users.map((user: any) => (
    <div
      key={user._id}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-gray-100 dark:bg-darkGray"
    >
      <CldImage
        src={user?.profilePic}
        alt={user?.username}
        width={40}
        height={40}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex flex-col gap-1">
        <p className="text-md font-bold capitalize text-gray-700 dark:text-gray-100">
          {user?.username}
        </p>
        <p className="text-sm font-bold opacity-80">{user?.email}</p>
      </div>

      {/* add user */}
      {!addResidentMutation.isPending ? (
        <PlusCircleIcon
          onClick={() => {
            handleAddResident(user._id)
          }}
          className="ml-auto smallScale cursor-pointer"
        />
      ) : (
        selectedUserId === user._id && <Loader2 className="ml-auto animate-spin" />
      )}
    </div>
  ))

  return (
    <div
      className="mt-30 w-[90%] lg:w-[60%] min-h-[50vh]
    flex flex-col
     p-3 shadow-md rounded-md bg-white dark:bg-gray-700 fixed -top-[3%] left-[5%] lg:left-[20%] z-220"
    >
      {/* header */}
      <div className="flex justify-between items-center">
        <h2 className="otherHead text-lg font-bold">Add Resident to This Property</h2>
        <X
          onClick={() => setBackdrop({ isOptionsOpen: false })}
          className="text-red-700 text-lg font-bold cursor-pointer"
        />
      </div>
      {/* form */}
      {/* search for user to add*/}
      <Searchbar
        search={search}
        setSearch={(e) => setSearch(e.target.value)}
        placeholder="Search for users by email"
        className="w-full flex items-center justify-center gap-2 mt-5 mx-auto"
      />
      {/* show users */}
      <div className="w-full h-60 mb-3 scrollable-4 scrollable-color overflow-y-auto scrollbar flex flex-col items-center gap-2 px-3 mt-5">
        {/* users */}
        {!search ? (
          <div className="text-lg font-head mt-18 mx-auto text-center flex items-center gap-1.5">
            <UserSearch />
            Search for users to add
          </div>
        ) : (
          <>
            {usersLoading ? (
              <div className="w-full flex flex-col gap-2 items-center justify-center">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="w-full h-14 px-3 py-2 rounded-md bg-gray-100 dark:bg-darkGray"
                  />
                ))}
              </div>
            ) : (
              mappedUsers
            )}
            {/* no user found */}
            {usersdata?.users.length < 1 && (
              <div className="text-lg font-head mt-18 mx-auto text-center flex flex-col items-center gap-1.5">
                <UserSearch className="text-red-600" />
                No user matches your search for{" "}
                <span className="text-red-600">"{debouncedSearch}"</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* <Button
        className="w-60 mt-auto  mb-4 flex gap-2 mx-auto darkblueBtn directional clickable py-6"
      >
        Add Resident
        <WhiteLoader />
      </Button> */}
    </div>
  )
}

export default AddResident

export const DeleteResident = ({
  inhabitantId,
  className,
  trash,
}: {
  inhabitantId: string
  className?: string
  trash?: boolean
}) => {
  const { setToastValues } = useToast()
  const queryClient = useQueryClient()

  const deleteFn = async () => {
    const res = await axiosdata.value.delete(`/api/listings/inhabitants/${inhabitantId}`)
    if (res.status === 200) {
      setToastValues({
        isActive: true,
        message: "Resident removed successfully",
        status: "success",
        duration: 2000,
      })
    } else {
      setToastValues({
        isActive: true,
        message: "Resident deletion failed",
        status: "danger",
        duration: 2000,
      })
    }
  }

  const DeleteResidentMutation = useMutation({
    mutationFn: deleteFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inhabitants"] })
    },
  })

  return (
    <div className={`${className} bg-red-700 rounded-full p-0.5 cursor-pointer`}>
      {!DeleteResidentMutation.isPending ? (
        !trash ? (
          <X
            onClick={() => DeleteResidentMutation.mutate()}
            size={16}
            color="white"
          />
        ) : (
          <Trash
            onClick={() => DeleteResidentMutation.mutate()}
            className="text-red-600 cursor-pointer"
          />
        )
      ) : (
        <Loader2
          size={16}
          color={trash ? "red" : "white"}
          className="animate-spin"
        />
      )}
    </div>
  )
}
