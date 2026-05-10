import { apiSlice } from "./api";
import type { CreateTimeSlotInputs, TimeSlot, TimeSlotsResponse, UpdateTimeSlotInputs } from "../interfaces/time-slot";
import type { QueryParams } from "../interfaces/user";


export const timeSlotApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    createTimeSlot: builder.mutation({
      query: (data: CreateTimeSlotInputs) => ({
        url: "time-slots",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["TimeSlots"]
    }),

    getTimeSlots: builder.query<TimeSlotsResponse, QueryParams | void>({
      query: (params) => ({
        url: "time-slots",
        method: "GET",
        params: params ?? undefined
      }),
      providesTags: ["TimeSlots","Consultants",'Bookings']
    }),

    // // GET TIMESLOT BY ID
    // getTimeSlotById: builder.query<{data: TimeSlot[]}, string>({
    //   query: (id: string) => ({
    //     url: `time-slots/${id}`,
    //     method: "GET"
    //   }),
    //   providesTags: (_result, _error, id) => [
    //     { type: "TimeSlots", id }
    //   ]
    // }),

    // // GET CONSULTANT SLOTS
    // getSlotsByConsultant: builder.query<{data: TimeSlot[]},string>({
    //   query: (consultantId: string) => ({
    //     url: `time-slots/consultant/${consultantId}`,
    //     method: "GET"
    //   }),
    //   providesTags: ["TimeSlots"]
    // }),

    getAvailableSlotsByConsultant: builder.query<{data: TimeSlot[]},string>({
      query: (consultantId: string) => ({
        url: `time-slots/consultant/${consultantId}/available`,
        method: "GET"
      }),
      providesTags: ["TimeSlots", "Consultants",'Bookings']
    }),

    updateTimeSlot: builder.mutation({
      query: ({ id, ...data }: { id: string } & UpdateTimeSlotInputs) => ({
        url: `time-slots/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "TimeSlots", id },
        "TimeSlots",'Consultants'
      ]
    }),

    deleteTimeSlot: builder.mutation({
      query: (id: string) => ({
        url: `time-slots/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["TimeSlots","Consultants"]
    })

  })
});

export const {
  useCreateTimeSlotMutation,
  useGetTimeSlotsQuery,
  // useGetTimeSlotByIdQuery,
  // useGetSlotsByConsultantQuery,
  useGetAvailableSlotsByConsultantQuery,
  useUpdateTimeSlotMutation,
  useDeleteTimeSlotMutation
} = timeSlotApiSlice;