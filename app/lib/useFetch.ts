'use client'
import { useEffect, useState } from "react"
export const useFetch = <T>(fetchFn: () => Promise<T>, autoFetch=true) => {
  const [data, setData] = useState<T | undefined>(undefined)
  const fetchData = async() => {
    try {
      const result = await fetchFn()
      setData(result)
    } catch(err) {
      console.log(err)
    }
  }
useEffect(() => {
  if (autoFetch === true) {
    fetchData()
  }
},[])
  
  return {data}
}
