import type { QueryParams } from "../slices/interfaces/user";
import { useGetReviewsByConsultantQuery } from "../slices/redux-slices/review";

export function useReviews(consultantId: string, params?: QueryParams) {
  const { data, isLoading, error } =
    useGetReviewsByConsultantQuery({
      consultantId,
      ...params,
    });

  return {
    reviews: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
  };
}