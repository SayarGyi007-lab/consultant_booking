import type { Pagination } from "./user"

export interface CreateBookingInputs {
  slotId: string
  userId?: string
  customerName: string
  customerEmail: string
}

export interface UpdateBookingInputs {
  status?: "CONFIRMED" | "CANCELLED" | "COMPLETED";
}

export interface Booking {
  id: string
  slotId: string
  userId: string
  customerName: string
  customerEmail: string
  createdAt: string
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED"

  review?: {  
    id: string
    rating: number
    comment?: string | null
    createdAt: string
  }

  slot?: {
    id: string
    consultantId: string
    startTime: string
    endTime: string
    status: string

    consultant?: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    expertise: string
  }
  }

  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
}

export interface BookingsResponse {
  success: boolean
  data: Booking[]
  pagination: Pagination
}