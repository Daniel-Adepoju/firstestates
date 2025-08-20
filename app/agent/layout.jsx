    
import '@styles'
import '../globals.css'
import Sidebar from "@components/agent/Sidebar";
import User from '@utils/user'
import UserModel from '@models/user'
import Provider from '@utils/sessionProvider'
import ReactQueryProvider from '@utils/ReactQueryProvider';
import Notification from '@lib/Notification'
import { after } from 'next/server';
import {auth} from '@auth'
import { connectToDB } from '@utils/database';
import Header from "@components/admin/Header";
import {DarkModeProvider} from '@lib/DarkModeProvider'
import Nav from '@components/Nav';

export const metadata = {

 title: "First Estates | Agent",
  description: "Agent Dashboard For First Estates",
  icons: {
    icon: "/icons/edit.svg",
  }
}
export default async function AdminLayout({children}){ 
    const session = await auth()

       after( async() => {
        if(!session?.user.id) return 
       await connectToDB()
       const user = await UserModel.findById(session?.user.id)
       if(user.lastActivityDate === new Date().toLocaleDateString("en-GB")) return
      await user.updateOne(
      {lastActivityDate:new Date().toLocaleDateString("en-GB")},
      {new:true, runValidators:true})
      })
    
  //   if(!session) {
  //       return <div className='unauthorized'>
  // <span> This Page Is Only Available To A Verified Agent</span>
  //       </div>
  //   }

    return (
      <>
 
      <DarkModeProvider>

       <ReactQueryProvider>
    <Provider>
      <User>
        <Nav />
        <Notification>
   <div className= 'admin-container nobar null'>
 <Sidebar session={session}/>
 <div className="admin-content-container nobar null">
  <Header session={session}/>
  <div className="agentDashboardContainer nobar null">
   {children}  
  </div>

  {/* {agent}
  {listings} */}
 </div>
 </div>
 </Notification>
      </User>
    </Provider>
    </ReactQueryProvider>

    </DarkModeProvider>  
      </>
     
      
  );
}


