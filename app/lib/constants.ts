'use client'
// import 

export const sidebarItems = [
  {
    name: "Dashboard",
    link: "/admin",
     icon: "/icons/dashboard.svg",
  },

  {
    name: "Users",
    link: "/admin/users",
    icon: "/icons/users.svg",
  },
  {
    name: "Listings",
    link: "/admin/listings",
    icon: "/icons/listings.svg",
  },
    {
    name: "Schoools",
    link: "/admin/schools",
    icon: "/icons/campus.svg",
  },
  {
    name: "Messages",
    link: "/admin/messages",
    icon: "/icons/notification.svg",
  },
   {
    name:'Chats',
    link:'/admin/inbox',
    icon: '/icons/chat.svg'
  },
  {
    name: "Settings",
    link: "/admin/settings",
    icon: "/icons/settings.svg",
  },
];


export const agentSidebarItems = [
  {
    name: "Home",
    link: "/agent",
    icon: "/icons/home.svg",
  },
  
  {
    name: "Listings",
    link: "/agent/listings",
    icon: "/icons/listings.svg",
  },
    {
    name:'Appointments',
    link:'/agent/appointments',
    icon: '/icons/calendar.svg'
  },
  {
    name:'Chats',
    link:'/agent/inbox',
    icon: '/icons/chat.svg'
  },
  {
    name: "Messages",
    link: "/agent/messages",
    icon: "/icons/notification.svg",
  },
  {
    name: "Settings",
    link: "/agent/settings",
    icon: "/icons/settings.svg",
  },

];


export const footerItems = [
  { name: "Contact Us",
    link: "/contact",
  },
  { name: "About",
    link: "/about",
  },
  { name: "Terms and conditions",
    link: "/terms",
  },
  { name: "Privacy Policy",
    link: "/privacy",
  },
]