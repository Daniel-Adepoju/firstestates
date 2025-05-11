
import '@styles'
import Sidebar from "@components/admin/Sidebar";
import User from '@utils/user'
import Provider from '@utils/sessionProvider'
import ReactQueryProvider from '@utils/ReactQueryProvider';
import Notification from '@lib/Notification'
import {auth} from '@auth'
import Header from "@components/admin/Header";
export const metadata = {
  title: "Firstestate | Admin",
  description: "Admin dashboard",
};

export default async function AdminLayout({children}){ 
    const session = await auth()
    if(!session) {
        return <div className='unauthorized'>
  <span> This Page Is Only Available To A Verified Admin</span>
        </div>
    }

    return (
    <Provider>
      <User>
   <div className= 'admin-container'>
 <Sidebar session={session}/>
 <div className="admin-content-container">
  <Header session={session}/>
   {children}
 </div>
 </div>
      </User>
    </Provider>
  );
}