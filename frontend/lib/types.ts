export interface Location {
  lat: number
  lng: number
  address: string
}

export interface User {
  _id: string
  email: string
  name: string
  role: 'farmer' | 'buyer' | 'admin'
  phone?: string
  location?: Location
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  unit: string
  category: string
  /*
   * The `image` and `imageUrl` helpers are used throughout the UI as shortcuts
   * to the primary image of a product. They are optional and derived from the
   * `images` array on the backend, so they may not always be present. We mark
   * them optional here so TypeScript recognises them wherever they are used.
   */
  image?: string
  imageUrl?: string
  images: string[]
  farmerId: string
  farmerName: string
  location: {
    lat: number
    lng: number
    address: string
  }
  isOrganic: boolean
  rating: number
  reviewCount: number
  inStock: boolean
  harvestDate: string
}

export interface RentalItem {
  id: string
  name: string
  description: string
  pricePerDay: number
  category: string
  images: string[]
  ownerId: string
  ownerName: string
  location: {
    lat: number
    lng: number
    address: string
  }
  rating: number
  reviewCount: number
  available: boolean
  availableDates: string[]
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  unit: string
  image: string
  farmerId: string
}

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  message: string
  timestamp: Date
  read: boolean
}

export interface CropDiagnosis {
  id: string
  userId: string
  image: string
  disease: string
  confidence: number
  treatment: string[]
  prevention: string[]
  timestamp: Date
}
