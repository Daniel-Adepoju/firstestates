import "@styles";

import Nav from '@components/Nav';
import Footer from '@components/Footer';
import User from '@utils/user'
import Provider from '@utils/sessionProvider'
import ReactQueryProvider from '@utils/ReactQueryProvider';
import Notification from '@lib/Notification'
import {Suspense} from 'react'
export const metadata = {
  title: "FirstEstates",
  description: "",
};

export default function RootLayout({children}) {
  return (
       <html lang="en">
      <body>
        <Suspense>
               <ReactQueryProvider>
          <Provider>
          <User>
         <Notification>
                {children} 
            </Notification>
          <Footer />   
          </User>
          </Provider>
        </ReactQueryProvider>
        </Suspense>
   
    
      </body>
    </html> 
 
  );
}
