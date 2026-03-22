import type { QueryParams } from "../slices/interfaces/user";
import { useGetAllBookingsQuery, useGetMyBookingsQuery } from "../slices/redux-slices/booking-api";

export function useBookings(params?: QueryParams){
    const { data, isLoading, error } = useGetAllBookingsQuery(params)

    return {
    bookings: data?.data ?? [],
    bookingsPagination: data?.pagination,
    isLoading,
    error
  }
}

export function useMyBookings(params?: QueryParams){
    const { data, isLoading, error } = useGetMyBookingsQuery(params)

    return {
    bookings: data?.data ?? [],
    bookingsPagination: data?.pagination,
    isLoading,
    error
  }
}
