import "@styles";
import Nav from '@components/Nav';
import Footer from '@components/Footer';
import User from '@utils/user'
import Provider from '@utils/sessionProvider'
import ReactQueryProvider from '@utils/ReactQueryProvider';
import Notification from '@lib/Notification'
import Backdrop from '@lib/Backdrop'
import { after } from "next/server";
import { auth } from "@auth";
import { connectToDB } from "@utils/database";
import  UserModel from "@models/user";
import {DarkModeProvider} from '@lib/DarkModeProvider'
import Main from "@components/Main";

export const metadata = {
  title: "FirstEstates",
   description: "Find Your Perfect Student Home",
};



export default async function RootLayout({children}) {

  const session = await auth()

   after( async() => {
// await test()
    if(!session?.user.id) return 
   await connectToDB()
   const user = await UserModel.findById(session?.user.id)
   if(user.lastActivityDate === new Date().toLocaleDateString("en-GB")) return
  await user.updateOne(
  {lastActivityDate:new Date().toLocaleDateString("en-GB")},
  {new:true, runValidators:true})
  })

  return (
       <>
       <DarkModeProvider>
         <ReactQueryProvider>
          <Provider>
          <User>
           <Backdrop>
             <Nav />
         <Notification>
            <Main>
            {children}
             <Footer /> 
            </Main>
           
             </Notification> 
          </Backdrop>
           
          </User>
          </Provider> 
          
        </ReactQueryProvider>
       </DarkModeProvider>
       
    </> 
 
  );
}
