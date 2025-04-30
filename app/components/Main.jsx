'use client'
import CardList from './CardList'
import { useUser } from '@utils/user'

const Main = ({children}) => {
  const {session} = useUser()

 
  return (
<>
   <CardList/>
</>





  )
}

export default Main