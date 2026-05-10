import type { Pagination } from "./user";

export interface Review {
  id: string;
  consultantId: string;
  userId: string;
  bookingId: string;

  rating: number;
  comment?: string | null;

  createdAt: string;
  updatedAt: string

  user?: {
    firstName: string;
    lastName: string;
  };
}

export interface ReviewsResponse {
    success: boolean;
  data: Review[];
  pagination: Pagination
}

export interface CreateReviewInputs {
  consultantId: string;
  bookingId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewInputs {
  bookingId: string;
  rating?: number;
  comment?: string;
}