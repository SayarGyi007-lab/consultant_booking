import type { Pagination } from "./user"

export interface CreateConsultantInputs {
  firstName: string
  lastName: string
  email: string
  phone: string
  expertise: string
}

export interface UpdateConsultantInputs {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  expertise?: string
}

export interface Consultant {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  expertise: string
  createdAt: string
  updatedAt: string
}

export interface ConsultantResponse{
  success: boolean
  data: Consultant[]
  pagination: Pagination
}