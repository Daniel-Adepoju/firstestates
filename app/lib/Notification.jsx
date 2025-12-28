'use client';
import { useEffect, useState ,createContext,useContext} from 'react'
import Image from 'next/image';

export const NotificationContext = createContext()
export const useNotification = () => useContext(NotificationContext)
const Notification = ({children}) => {
  const [progress, setProgress] = useState(100);
  const [isActive, setIsActive] = useState(false)
const [message, setMessage] = useState('message')
const [type,setType]  = useState('success') 
const [duration, setDuration] = useState(2000)
  useEffect(() => { 
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percentage = 100 - (elapsed / duration) * 100;
      setProgress(Math.max(percentage, 0));
    }, 30);
 
    const timer = setTimeout(() => {
      setIsActive(false)
      clearInterval(interval);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [duration, isActive]);

   const closeNotification = (e) => {
     setIsActive(false)
   }
  
  return (
    <>
    <NotificationContext.Provider value={{setMessage,setIsActive,setType,setDuration}}>
<div onClick={closeNotification} className={`notification ${type} ${isActive && 'active'}`}>
      <div className="notification__conten capitalize text-[14.4px] font-medium font-list">
        {message}
        </div>
      <div
        className="notification__progress"
        style={{ width: `${progress}%` }}
      ></div>
      <Image 
      className='clickable'
      src={'/icons/white_cancel.svg'}
      width={30}
      height={30}
      alt='cancel btn'
      />
    </div>
    {children}
    </NotificationContext.Provider>
    </>
  
  );
};

export default Notification;
