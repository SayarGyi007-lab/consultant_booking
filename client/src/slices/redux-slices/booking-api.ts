import type { BookingsResponse, CreateBookingInputs } from "../interfaces/booking";
import type { QueryParams } from "../interfaces/user";
import { apiSlice } from "./api";

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    createBooking: builder.mutation({
      query: (data: CreateBookingInputs) => ({
        url: "bookings",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Bookings", "TimeSlots", "Consultants"]
    }),

    getMyBookings: builder.query<BookingsResponse, QueryParams | void>({
      query: (params) => ({
        url: "bookings/my-bookings",
        method: "GET",
        params: params ?? undefined
      }),
      providesTags: ["Bookings"]
    }),

    getAllBookings: builder.query<BookingsResponse, QueryParams | void>({
      query: (params) => ({
        url: "bookings",
        method: "GET",
        params: params ?? undefined
      }),
      providesTags: ["Bookings",'TimeSlots', 'TimeSlots']
    }),

    cancelBooking: builder.mutation({
      query: (id: string) => ({
        url: `bookings/${id}/cancel`,
        method: "PATCH"
      }),
      invalidatesTags: ["Bookings", "TimeSlots", "Consultants"]
    }),

    completeBooking: builder.mutation({
      query: (id: string) => ({
        url: `bookings/${id}/complete`,
        method: "PATCH"
      }),
      invalidatesTags: ["Bookings", "TimeSlots", "Consultants"]
    })

  })
});
export const {useCreateBookingMutation, useGetAllBookingsQuery, useGetMyBookingsQuery, useCancelBookingMutation, useCompleteBookingMutation} = bookingApiSlice