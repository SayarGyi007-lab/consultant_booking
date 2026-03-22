import { apiSlice } from "./api";
import type { ConsultantResponse, CreateConsultantInputs, UpdateConsultantInputs } from "../interfaces/consultant";
import type { QueryParams } from "../interfaces/user";

export const consultantApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // CREATE CONSULTANT
    createConsultant: builder.mutation({
      query: (data: CreateConsultantInputs) => ({
        url: "consultants/register",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Consultants"]
    }),

    // GET CONSULTANTS
    getConsultants: builder.query<ConsultantResponse, QueryParams | void>({
      query: (params) => ({
        url: "consultants",
        method: "GET",
        params: params ?? undefined
      }),
      providesTags: ["Consultants"]
    }),

    // GET CONSULTANT BY ID
    getConsultantById: builder.query({
      query: (id: string) => ({
        url: `consultants/${id}`,
        method: "GET"
      }),
      providesTags: (_result, _error, id) => [
        { type: "Consultants", id }
      ]
    }),

    // UPDATE CONSULTANT
    updateConsultant: builder.mutation({
      query: ({ id, ...data }: { id: string } & UpdateConsultantInputs) => ({
        url: `consultants/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Consultants", id },
        "Consultants"
      ]
    }),

    // DELETE CONSULTANT
    archiveConsultant: builder.mutation({
            query: (id: string) => ({
                url: `consultants/${id}/archive`,
                method: "PATCH"
            }),
            invalidatesTags: ["Consultants"]
        }),

        restoreConsultant: builder.mutation({
            query: (id: string) => ({
                url: `consultants/${id}/restore`,
                method: "PATCH"
            }),
            invalidatesTags: ["Consultants"]
        }),

        permanentDeleteConsultant: builder.mutation({
            query: (id: string) => ({
                url: `consultants/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Consultants"]
        }),

  })
});

export const {
  useCreateConsultantMutation,
  useGetConsultantsQuery,
  useGetConsultantByIdQuery,
  useUpdateConsultantMutation,
  useArchiveConsultantMutation,
  useRestoreConsultantMutation,
  usePermanentDeleteConsultantMutation
} = consultantApiSlice;