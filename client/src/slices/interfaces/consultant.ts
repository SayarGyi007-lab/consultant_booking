import type { Pagination } from "./user"

export interface CreateConsultantInputs {
  firstName: string
  lastName: string
  email: string
  phone: string
  expertise: string
  price: number
  bio: string
  skills: string[]
  experience: number
}

export interface UpdateConsultantInputs {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  expertise?: string
  price?: number
  bio?: string
  skills?: string[]
  experience?: number
}

export interface Consultant {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  expertise: string
  price: number
  bio: string
  skills: string[]
  experience: number

  rating: number | null
  reviewCount: number | null

  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export interface ConsultantResponse{
  success: boolean
  data: Consultant[]
  pagination: Pagination
}