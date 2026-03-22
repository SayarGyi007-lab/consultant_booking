import type { QueryParams } from "../slices/interfaces/user";
import { useGetConsultantsQuery } from "../slices/redux-slices/consultant-api";

export function useConsultants(params?: QueryParams){
    const { data, isLoading, error } = useGetConsultantsQuery(params)

    return {
    consultants: data?.data ?? [],
    consultantsPagination: data?.pagination,
    isLoading,
    error
  }
}
