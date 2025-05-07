import "@styles";

export const metadata = {
  title: "FirstEstates",
  description: "",
  icons: {
    icon: "/icons/edit.svg",
  },
};

export default function RootLayout({children}) {
  return (
       <html lang="en">
          <head>
          {/* <link rel="icon" href="/icons/goUp.svg" /> */}
          </head>
      <body>
            {children}
      </body>
    </html> 
 
  );
}
