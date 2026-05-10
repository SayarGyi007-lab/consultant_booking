import { apiSlice } from "./api";
import type {
  ReviewsResponse,
  CreateReviewInputs,
  UpdateReviewInputs
} from "../interfaces/review";
import type { QueryParams } from "../interfaces/user";

export const reviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    createReview: builder.mutation({
      query: (data: CreateReviewInputs) => ({
        url: "reviews",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Reviews", "Consultants", "Bookings"]
    }),

    updateReview: builder.mutation({
      query: ({ bookingId, ...data }: UpdateReviewInputs) => ({
        url: "reviews",
        method: "PUT",
        body: { bookingId, ...data }
      }),
      invalidatesTags: ["Reviews", "Consultants"]
    }),

    deleteReview: builder.mutation({
      query: (bookingId: string) => ({
        url: `reviews/${bookingId}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Reviews", "Consultants"]
    }),

    getReviewsByConsultant: builder.query<ReviewsResponse, {consultantId:string} & QueryParams>({
      query: ({consultantId, ...params}) => ({
        url: `reviews/${consultantId}`,
        method: "GET",
        params
      }),
      providesTags: ["Reviews"]
    })

  })
});

export const {
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetReviewsByConsultantQuery
} = reviewApiSlice;