"use client";
import Searchbar from '@components/Searchbar'
import { useSignal, useSignals } from '@preact/signals-react/runtime';
import { CldImage } from 'next-cloudinary';
import {useGetUsers} from '@lib/customApi'
import Pagination from '@components/Pagination';
import {Loader} from '@utils/loaders'
import {useEffect} from 'react'
import { useRouter, useSearchParams } from 'next/navigation';

  interface User {
          _id: string;
          username: string;
          email: string;
          profilePic: string;
          role: "admin" | "agent" | "user" | string;
        }

        interface UsersData {
          users: User[];
          cursor: number | string;
          numOfPages: number | string;
        }

const GetUsers = () => {
  useSignals()
const limit = useSignal(10)
const page = useSearchParams().get('page') || '1'
const search = useSignal("")
const debounced = useSignal('')
const params = useSearchParams()
const searchParams = new URLSearchParams(params.toString())
const router = useRouter()

useEffect(() => {
    const timeoutId= setTimeout(() => {
       searchParams.set('page', '1')
       router.push(`?${searchParams.toString()}`)
      debounced.value = search.value
    }, 560)
    return () => clearTimeout(timeoutId)
  }, [search.value])

const {data,isLoading} = useGetUsers({
  limit: limit.value,
  page: page,
  search: debounced.value,
})



  return (
    <>
    <div className="container mx-auto py-8">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
      <Searchbar
      search={search.value}
      setSearch={(e) => search.value = e.target.value}
      placeholder={"Search for users"}
      className='my-6 gap-1 w-full flex flex-row justify-center items-center md:justify-end  md:w-[60%]'
      />    
        </div>
    
    {isLoading && <Loader className='my-18'/>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      

        {(data as UsersData | undefined)?.users.map((user: User) => (
          <div
            key={user._id}
            className="user-card bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex items-center gap-4"
          >
            <CldImage
              src={user.profilePic}
              alt={`${user.username}'s profile picture`}
              width={60}
              height={60}
              className="rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold dark:text-white">
                {user.username}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {user.email}
              </p>
              <p className="text-sm">
                <span
                  className={`capitalize inline-block px-2 py-0.5 rounded-sm w-20 text-center text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-red-300 text-red-800"
                      : user.role === "agent"
                      ? "bg-blue-300 text-blue-800"
                      : "bg-green-300 text-green-800"
                  }`}
                >
                  {user.role}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
       
    </div>
     {!isLoading && <Pagination
   currentPage={Number(data?.cursor)}
   totalPages={Number(data?.numOfPages)}/>}
    </>
  );
};

export default GetUsers