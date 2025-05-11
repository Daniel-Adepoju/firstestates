    
import '@styles'
import '../globals.css'
import Sidebar from "@components/agent/Sidebar";
import User from '@utils/user'
import Provider from '@utils/sessionProvider'
import ReactQueryProvider from '@utils/ReactQueryProvider';
import Notification from '@lib/Notification'
import {auth} from '@auth'
import Header from "@components/admin/Header";
export const metadata = {

 title: "First Estates | Agent",
  description: "Agent Dashboard",
  icons: {
    icon: "/icons/edit.svg",
  }
}
export default async function AdminLayout({children}){ 
    const session = await auth()
  //   if(!session) {
  //       return <div className='unauthorized'>
  // <span> This Page Is Only Available To A Verified Agent</span>
  //       </div>
  //   }

    return (
    <Provider>
      <User>
        <Notification>
   <div className= 'admin-container'>
 <Sidebar session={session}/>
 <div className="admin-content-container">
  <Header session={session}/>
  <div className="agentDashboardContainer">
   {children}  
  </div>

  {/* {agent}
  {listings} */}
 </div>
 </div>
 </Notification>
      </User>
    </Provider>
  );
}


