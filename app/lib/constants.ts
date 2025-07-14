

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
    name: "Dashboard",
    link: "/agent/dashboard",
    icon: "/icons/dashboard.svg",
  },
  {
    name: "Listings",
    link: "/agent/listings",
    icon: "/icons/listings.svg",
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



export const schoolArea = {
  "North West": ["Another Town", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe"],
  "North East": ["Benue", "Borno", "Gombe", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Ogun", "Ondo", "Osun", "Oyo"],
  "Lasu":[
    "Some Town",
    "First Gate",
    "Iyana School",
    "Ipaye",
    "Post Office"],
}
export const schools = Object.keys(schoolArea)
