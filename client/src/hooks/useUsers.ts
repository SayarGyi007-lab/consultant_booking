import type { QueryParams, User } from "../slices/interfaces/user";
import { useGetmeQuery, useGetUsersQuery } from "../slices/redux-slices/user-api";

export function useUsers(params?: QueryParams){
    const { data, isLoading, error } = useGetUsersQuery(params)

    return {
    users: data?.data ?? [],
    usersPagination: data?.pagination,
    isLoading,
    error
  }
}

export function useCurrentUser(){
    const { data, isLoading, error } = useGetmeQuery()

    return {
    user: data?.data as User | undefined,
    isLoading,
    error
  }
}
