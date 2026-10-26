"use client"
import {
  Bell,
  Building2,
  CalendarDays,
  CheckSquare,
  Home,
  LayoutDashboard,
  List,
  MessageCircle,
  School,
  Settings,
  Users,
} from "lucide-react"

export const sidebarItems = [
  {
    name: "Dashboard",
    link: "/admin",
    iconLucide: LayoutDashboard,
  },

  {
    name: "Users",
    link: "/admin/users",
    iconLucide: Users,
  },
  {
    name: "Listings",
    link: "/admin/listings",
    iconLucide: Building2,
  },
  {
    name: "Schoools",
    link: "/admin/schools",
    iconLucide: School,
  },
  {
    name: "Messages",
    link: "/admin/messages",
    iconLucide: Bell,
  },
  {
    name: "Chats",
    link: "/admin/inbox",
    iconLucide: MessageCircle,
  },
  {
    name: "Settings",
    link: "/admin/settings",
    iconLucide: Settings,
  },
]

export const agentSidebarItems = [
  {
    name: "Home",
    link: "/agent",
    iconLucide: Home,
  },

  {
    name: "Listings",
    link: "/agent/listings",
    iconLucide: List,
  },
  {
    name: "Chats",
    link: "/agent/inbox",
    iconLucide: MessageCircle,
  },
  {
    name: "Messages",
    link: "/agent/messages",
    iconLucide: Bell,
  },
  {
    name: "Manage Requests",
    link: "/agent/requests",
    iconLucide: CheckSquare,
  },
  {
    name: "Appointments",
    link: "/agent/appointments",
    iconLucide: CalendarDays,
  },
  {
    name: "Settings",
    link: "/agent/settings",
    iconLucide: Settings,
  },
]

export const footerItems = [
  { name: "Contact Us", link: "/info/contact-us" },
  { name: "About", link: "/info/about-us" },
  { name: "Terms and conditions", link: "/info/terms" },
  { name: "Privacy Policy", link: "/info//privacy" },
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
    key: "standard",
    type: "Standard",
    amount: 4000,
    durationDays: 31,
    price: "₦4000/month",
    color: "text-sky-500",
    border: "border-sky-500",
    benefits: ["Basic listing visibility", "Add up to 3 images"],
    link: "/agent/listings/add?type=standard",
    maxImages: 3,
    rank: 1,
  },
  {
    key: "gold",
    type: "Gold",
    amount: 8000,
    durationDays: 55,
    price: "₦8000/55 days",
    color: "text-goldPrimary",
    border: "border-goldPrimary",
    benefits: [
      "Ability to feature listings",
      "Greater visibility than standard listing",
      "Add up to 5 images",
    ],
    link: "/agent/listings/add?type=gold",
    maxImages: 5,
    rank: 2,
  },
  {
    key: "first",
    type: "First",
    amount: 12000,
    durationDays: 70,
    price: "₦12000/70 days",
    color: "text-[#b647ff]",
    border: "border-[#b647ff]",
    benefits: [
      "Best listing visibility",
      "Priority display in search results",
      "Add up to 8 images and a video tour",
      "Automatic featured listing",
    ],
    link: "/agent/listings/add?type=first",
    maxImages: 8,
    maxVideo: 1,
    rank: 3,
  },
]

export const getListingTier = (tier?: string) => {
  return (
    listingTierItems.find((t) => t.key === tier) || listingTierItems[0] // fallback to standard
  )
}

export const listingTypes = [
  "Apartment",
  "Hostel",
  "Self Contained",
  "Shared Room",
  "Single Room",
  "Studio Apartment",
  "Flat",
  "Mini Flat",
  "Shared House",
]

export const tagsSuggestion = [
  // Occupancy
  "Male Only",
  "Female Only",
  // Rent Duration

  // Others
  "Walking Distance",
  "Near Campus",
]
