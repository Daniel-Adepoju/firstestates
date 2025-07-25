import { CldImage } from 'next-cloudinary';

import { useDarkMode } from '@lib/DarkModeProvider';  
import { useState, useEffect} from 'react';
import { useSignals,useSignal} from '@preact/signals-react/runtime';
import { Signal } from '@preact/signals-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosdata } from '@utils/axiosUrl';
import { useNotification } from '@lib/Notification';
import { updateUser, banUser} from '@lib/server/auth';
import {Loader2, Settings} from 'lucide-react';
import { SendEmailParams } from '@(auth)/forgot-password/page';
import  BannedSticker from '@components/admin/Banned'

export interface User {
          _id: string;
          username: string;
          email: string;
          profilePic: string;
          banStatus?: boolean;
          phone?: string;
          role: "admin" | "agent" | "user" | string;
        }

   interface UsersCardProps {
        user: User,
        menuId?: Signal<string>
        }

const UsersCard = ({user, menuId}:UsersCardProps) => {
useSignals()
const {darkMode} = useDarkMode()
const [showMenu, setShowMenu] = useState(false);
const [updating, setUpdating] = useState(false)
const notification = useNotification()
const queryClient = useQueryClient()
const currentMenuId = menuId || useSignal("");
 console.log(user)
useEffect(() => {
   if (currentMenuId.value !== user._id) {
    setShowMenu(false)
   }
},[currentMenuId.value])


const makeAdmin = async () => {
 setShowMenu(false)
 setUpdating(true)
 try {
 const res = await updateUser({id: user._id , role:"admin"})
   notification.setIsActive(true)
        notification.setMessage(res.message)
        notification.setType(res.status)
        setUpdating(false)
} catch (err) {
  setUpdating(false)
 console.log(err)
}

}

const unmakeAdmin = async () => {
  setShowMenu(false);
  setUpdating(true);
  try {
    let newRole
    if (user?.phone) {
      newRole = "agent"
    } else {
      newRole = "client"
    }

    const res = await updateUser({ id: user._id, role: newRole })

    notification.setIsActive(true)
    notification.setMessage(res.message)
    notification.setType(res.status)
    setUpdating(false)
  } catch (err) {
    setUpdating(false)
    console.log(err)
  }
};


const banAccount = async (val:SendEmailParams) => {
  setShowMenu(false)
  setUpdating(true);
  try {
    const res = await banUser(user._id)
    const sendEmail = await axiosdata.value.post('/api/send_emails',val)
    notification.setIsActive(true)
    notification.setMessage(res.message)
    notification.setType(res.status)
    setUpdating(false)
  } catch (err) {
    setUpdating(false)
    console.log(err)
  }
}

   const makeAdminMutation = useMutation({
    mutationFn: makeAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users']})
    },
  })

   const unmakeAdminMutation = useMutation({
    mutationFn: unmakeAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users']})
    },
  })

     const banMutation = useMutation({
    mutationFn: banAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users']})
      queryClient.invalidateQueries({ queryKey: ['user', user._id]})
    },
  })

  const handleBan = () => {
 banMutation.mutate(user?.banStatus ?
   {    to: user?.email,
    subject: 'Account Restored',
    message: `<p>Your account has been restored. You can now log in again.</p>`
      } 
  : {
    to: user?.email,
    subject: 'Account Banned',
    message: `<p>Your account has been banned due to violation of our terms of service.</p>
       <p>If you believe this is a mistake, please contact support.</p>`
 }
)}

  const pendingConditions = makeAdminMutation.isPending || banMutation.isPending || unmakeAdminMutation.isPending || updating

  return (
       <div
            key={user._id}
            className="user-card relative bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex items-center gap-4"
          >
          {user?.banStatus &&  <div className="w-20 absolute right-5 top-4">
              <BannedSticker />
            </div>}
            <CldImage
              src={user?.profilePic}
              alt={`${user?.username}'s profile picture`}
              width={60}
              height={60}
              crop='auto'
              className="rounded-full"
            />
            <div className='w-full'>
              <h2 className="text-lg font-semibold dark:text-white">
                {user?.username}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {user?.email}
              </p>
              <div className="w-full relative text-sm flex flex-row items-center justify-between">
                <span
                  className={`capitalize inline-block px-2  rounded-sm w-20 text-center text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-red-300 text-red-800"
                      : user.role === "agent"
                      ? "bg-blue-300 text-blue-800"
                      : "bg-green-300 text-green-800"
                  }`}
                >
                  {user.role}
                </span>
            {pendingConditions ?  
            <Loader2 size={40} className='animate-spin' /> 
            :   <Settings
                onClick={() => {
                    setShowMenu(prev => !prev)
                    currentMenuId.value = user._id
                }}
                className='cursor-pointer smallScale'
                color={darkMode ? "white" : '#0874c7'}
                size={40} />
              }
                  {showMenu && currentMenuId.value === user._id  && (
              <div className="absolute right--10 mt-2 w-40 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50">
              {user.role !=='admin' ?  <button
                  onClick={() => makeAdminMutation.mutate()}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Make Admin
                </button> : 
                 <button
                  onClick={() => unmakeAdminMutation.mutate()}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Remove as Admin
                </button>
                }
                <button
                  onClick={handleBan}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:opacity-90 hover:dark:bg-red-800 hover:dark:text-white"
                >
                 {user?.banStatus ? 'Revoke Ban' : 'Ban Account'}
                </button>
              </div> )}
              </div>
            </div>
          </div>
  )
}

export default UsersCard