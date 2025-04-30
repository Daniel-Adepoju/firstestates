import { useSignals } from '@preact/signals-react/runtime'
import axios from 'axios'
import { signal } from '@preact/signals-react'

export const axiosdata = signal(axios.create({
    baseURL: process.env.BASE_URL
  }))

const AxiosUrl = () => {
    useSignals()
  return (
    <></>
  )
}

export default AxiosUrl