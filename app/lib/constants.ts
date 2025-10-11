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
export let dummyListing = {
  _id: "lst_001",
  address: "12 Palm Grove Avenue, Lekki Phase 1, Lagos",
  location: "Lagos, Nigeria",
  image: "igy0tozve5oyjrsfmq3o",
  price: "₦450,000 / year",
  description: "Spacious modern hostel room located near the university with easy access to transport and shops.",
  bedrooms: 1,
  bathrooms: 1,
  toilets: 1,
  agent: {
    _id: "agt_101",
    name: "Chinedu Okafor",
    phone: "+2348100000000",
    email: "chinedu@firstestates.com",
    avatar: "/agents/chinedu.jpg",
  },
  mainImage: "igy0tozve5oyjrsfmq3o",
  gallery: [
    "igy0tozve5oyjrsfmq3o",
    "x83hf8b2d1hjf02lx7b9",
    "k2mdp39dlq9wqf7ujw4a",
  ],
  reportedBy: [],
  createdAt: new Date().toISOString(),
  status: "available",
  school: "Unilag",
  weeklyViews: 42,
  totalViews: 385,
  isFeatured: true,
}