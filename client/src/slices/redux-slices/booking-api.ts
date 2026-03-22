import type { Booking, BookingsResponse, CreateBookingInputs } from "../interfaces/booking";
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
            invalidatesTags: ["Bookings", "TimeSlots"]
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
            providesTags: ["Bookings"]
        }),

        getBookingById: builder.query<{ data: Booking[] }, string>({
            query: (id) => ({
                url: `bookings/${id}`,
                method: "GET"
            }),
            providesTags: (_result, _error, id) =>
            [{ type: "Bookings", id }]
        }),

        deleteBooking: builder.mutation({
            query: (id) => ({
                url: `bookings/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Bookings", "TimeSlots"]
        })

    })
});

export const {useCreateBookingMutation, useGetBookingByIdQuery, useGetAllBookingsQuery, useGetMyBookingsQuery, useDeleteBookingMutation} = bookingApiSlice