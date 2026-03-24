import { apiSlice } from "./api";
import type { loginInputs, registerInputs, QueryParams, updateUserInputs, UsersResponse } from "../interfaces/user";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //auth
        login: builder.mutation({
            query: (data: loginInputs) => ({
                url: "auth/login",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Users"]
        }),
        register: builder.mutation({
            query: (data: registerInputs) => ({
                url: "auth/register",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Users"]
        }),
        logout: builder.mutation({
            query: () => ({
                url: "auth/logout",
                method: "POST"
            }),
            invalidatesTags: ["Users"]
        }),

        //others
        getme: builder.query<UsersResponse,void>({
            query: () => ({
                url: "users/me",
                method: "GET"
            }),
            providesTags: ["Users"]
        }),

        // UPDATE USER
        updateUser: builder.mutation({
            query: ({ id, ...data }: { id: string } & updateUserInputs) => ({
                url: `users/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Users", id },
                "Users"
            ]
        }),

        // CHANGE PASSWORD
        changePassword: builder.mutation({
            query: (data: { currentPassword: string; newPassword: string }) => ({
                url: "users/change-password",
                method: "PATCH",
                body: data
            })
        }),


        //Admin
        //GET USERS
        getUsers: builder.query<UsersResponse, QueryParams | void>({
            query: (params) => ({
                url: "users",
                method: "GET",
                params: params ?? undefined
            }),
            providesTags: ["Users"]
        }),

        //GET USER BY ID
        getUserById: builder.query({
            query: (id: string) => ({
                url: `users/${id}`,
                method: "GET"
            }),
            providesTags: (_result, _error, id) => [
                { type: "Users", id }
            ]
        }),

        // DELETE USER
        archiveUser: builder.mutation({
            query: (id: string) => ({
                url: `users/${id}/archive`,
                method: "PATCH"
            }),
            invalidatesTags: ["Users"]
        }),

        restoreUser: builder.mutation({
            query: (id: string) => ({
                url: `users/${id}/restore`,
                method: "PATCH"
            }),
            invalidatesTags: ["Users"]
        }),

        permanentDeleteUser: builder.mutation({
            query: (id: string) => ({
                url: `users/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Users"]
        }),

    })
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetmeQuery,
    useGetUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useChangePasswordMutation,
    useArchiveUserMutation,
    useRestoreUserMutation,
    usePermanentDeleteUserMutation
} = userApiSlice