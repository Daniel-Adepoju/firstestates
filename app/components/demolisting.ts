export const demoListings = Array.from({ length: 10 }, (_, i) => ({
  _id: `listing-${i + 1}`,
  address: `123${i + 1} Mockingbird Lane`,
  location: `City ${i + 1}`,
  image: `https://example.com/image-${i + 1}.jpg`,
  price: `${100000 + i * 5000}`,
  description: `Spacious and modern listing number ${i + 1}`,
  bedrooms: 2 + (i % 3),
  bathrooms: 1 + (i % 2),
  toilets: 2 + (i % 2),
  agent: {
    id: `agent-${i + 1}`,
    name: `Agent ${i + 1}`,
    email: `agent${i + 1}@realestate.com`,
    phone: `123-456-789${i % 10}`,
  },
  mainImage: `https://placehold.co/600x400?text=Listing+${i + 1}`,
  gallery: [
    `https://placehold.co/400x300?text=Gallery+${i + 1}-1`,
    `https://placehold.co/400x300?text=Gallery+${i + 1}-2`,
    `https://placehold.co/400x300?text=Gallery+${i + 1}-3`,
  ],
  createdAt: new Date(Date.now() - i * 86400000).toISOString(), // Created 'i' days ago
  status: i % 2 === 0 ? "available" : "sold",
}))