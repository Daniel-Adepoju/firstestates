import "@styles";
import Nav from '@components/Nav';
import Footer from '@components/Footer';
import User from '@utils/user'
import Provider from '@utils/sessionProvider'
import ReactQueryProvider from '@utils/ReactQueryProvider';
import Notification from '@lib/Notification'
import Backdrop from '@lib/Backdrop'

export const metadata = {
  title: "FirstEstates",
  description: "",
};

export default function RootLayout({children}) {
  return (
       <>
        <ReactQueryProvider>
          <Provider>
          <User>
           <Backdrop>
             <Nav />
         <Notification>
            {children}
            <Footer /> 
             </Notification> 
          </Backdrop>
           
          </User>
          </Provider> 
          
        </ReactQueryProvider>
    </> 
 
  );
}
