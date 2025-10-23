interface Agent {
  _id: string;
  profilePic: string;
  username: string;
  isTierOne?: boolean;
  isTierTwo?:boolean;
}

type Listing = {
  _id?: string;
  address: string;
  location: string;
  image?: string;
  price?: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  toilets?: number;
  agent: Agent;
  mainImage: string;
  gallery?: string[];
  reportedBy: string[];
  createdAt?: string;
  status?: string;
  school?:string;
  weeklyViews?: number;
  totalViews?: number;
  isFeatured?:boolean;
}

type School = {
  _id?: string;
  shortname?: string;
  fullname?: string;
  schoolAreas?: string[];
}

interface Request {
  _id?: Types.ObjectId;
  requester: Types.ObjectId | IUser;
  listing: Types.ObjectId | IListing;
  requestType: "roomate" | "co-rent";
  budget?: number;
  description: string;
  status?: "pending" | "accepted";
  views?: number;
  createdAt?: Date;
  updatedAt?: Date;
  preferredGender?: "male" | "female";
}