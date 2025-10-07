// types/ProductDetails.ts

export interface MentorDetails {
  name: string
  title: string
  imageUrl?: string
}


// Schema for a product (like a course, masterclass, etc.)
export interface ProductDetails {
  id: string
  productName: string
  productDescription: string
  mentors: MentorDetails[]
  price: number
  discountedPrice: number
  isActive: boolean
  imageUrl?: string
}

export interface ProductSalesInfo {
  saleEndDateEpoch?: string
  mainButtonTitle: string
  highlightText: string
  heading: string
  subheading: string
}