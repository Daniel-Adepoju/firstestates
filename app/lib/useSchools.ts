'use client'
import { useEffect, useState } from 'react'
import { axiosdata } from '@utils/axiosUrl'

export const useSchools = () => {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await axiosdata.value.get('/api/schools')
        setSchools(res.data.schools)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSchools()
  }, [])

  return { schools, loading, error }
}
