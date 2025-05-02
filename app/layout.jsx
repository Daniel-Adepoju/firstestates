import "@styles";

export const metadata = {
  title: "FirstEstates",
  description: "",
};

export default function RootLayout({children}) {
  return (
       <html lang="en">
      <body>
            {children}
      </body>
    </html> 
 
  );
}
