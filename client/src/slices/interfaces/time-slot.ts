import type { Pagination } from "./user"

export interface TimeSlot {
  id: string
  consultantId: string
  startTime: string
  endTime: string
  status: "AVAILABLE" | "BOOKED"
  createdAt: string

  consultant?: {
    id: string
    firstName: string
    lastName: string
    email: string
    expertise: string
    phone: string
    createdAt: string
  }

  booking?: {
    id: string
    slotId: string
    userId: string
    customerName: string
    customerEmail: string
    createdAt: string
  } | null
}

export interface CreateTimeSlotInputs {
  consultantId: string
  startTime: string
  endTime: string
}

export interface UpdateTimeSlotInputs {
  consultantId?: string;
  startTime?: string
  endTime?: string
  status?: "AVAILABLE" | "BOOKED"
}

export interface TimeSlotsResponse {
  success: boolean
  data: TimeSlot[]
  pagination: Pagination
}