import { useQuery } from "@tanstack/react-query";
import { getTourReviews } from "../../../Services/reviewService/reviewService";

export const useAllReviews = () => {
  const {
    data: reviews = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: getTourReviews,
  });

  return {
    reviews,
    isLoading,
    isError,
    error,
    refetch,
  };
};
