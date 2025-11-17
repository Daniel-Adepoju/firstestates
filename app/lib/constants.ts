"use client"
import { CheckSquare } from "lucide-react"

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
    name: "Chats",
    link: "/admin/inbox",
    icon: "/icons/chat.svg",
  },
  {
    name: "Settings",
    link: "/admin/settings",
    icon: "/icons/settings.svg",
  },
]

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
    name: "Chats",
    link: "/agent/inbox",
    icon: "/icons/chat.svg",
  },
  {
    name: "Messages",
    link: "/agent/messages",
    icon: "/icons/notification.svg",
  },
  {
    name: "Manage Requests",
    link: "/agent/requests",
    iconLuicide: CheckSquare,
  },
  {
    name: "Appointments",
    link: "/agent/appointments",
    icon: "/icons/calendar.svg",
  },
  {
    name: "Settings",
    link: "/agent/settings",
    icon: "/icons/settings.svg",
  },
]

export const footerItems = [
  { name: "Contact Us", link: "/contact" },
  { name: "About", link: "/about" },
  { name: "Terms and conditions", link: "/terms" },
  { name: "Privacy Policy", link: "/privacy" },
]

export let dummyListing = {
  _id: "lst_001",
  address: "12 Palm Grove Avenue, Lekki Phase 1, Lagos",
  location: "Lagos, Nigeria",
  image: "igy0tozve5oyjrsfmq3o",
  price: "₦450,000 / year",
  description:
    "Spacious modern hostel room located near the university with easy access to transport and shops.",
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
  gallery: ["igy0tozve5oyjrsfmq3o", "x83hf8b2d1hjf02lx7b9", "k2mdp39dlq9wqf7ujw4a"],
  reportedBy: [],
  createdAt: new Date().toISOString(),
  status: "available",
  school: "Unilag",
  weeklyViews: 42,
  totalViews: 385,
  isFeatured: true,
}

 export const listingTierItems = [
    {
      type: "Standard",
      price: "₦1000/month",
      border: "border-sky-500",
      benefits: [
        "Basic listing visibility",
        "Add up to 3 images",
      ],
      link: "/agent/listings/add?type=standard",
      rank:1,
    },
    {
      type: "Gold",
      price: "₦2500/50 days",
      border: "border-goldPrimary", // assuming `gold-primary` maps to yellow-500
      benefits: [
        "Ability to feature listings",
        "Greater visibility than standard listing",
        "Add up to 5 images",
      ],
      link: "/agent/listings/add?type=gold",
      rank:2,
    },
    {
      type: "First",
      price: "₦5000/75 days",
      border: "border-[#b647ff]",
      benefits: [
        "Enhanced listing visibility",
        "Priority display in search results",
        "Add up to 10 images",
        "Automatic featured listing",
      ],
      link: "/agent/listings/add?type=first",
      bonusClass:"md:col-span-2 md:mx-auto lg:col-span-1 lg:mx-0",
      rank:3,
    },
  ]