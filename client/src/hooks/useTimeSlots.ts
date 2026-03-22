import type { QueryParams } from "../slices/interfaces/user";
import { useGetTimeSlotsQuery } from "../slices/redux-slices/time-slot-api";

export function useTimeSlots(params?: QueryParams){
    const { data, isLoading, error } = useGetTimeSlotsQuery(params)

    return {
    timeSlots: data?.data ?? [],
    timeslotsPagination: data?.pagination,
    isLoading,
    error
  }
}
