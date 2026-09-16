import { useQuery } from "@tanstack/react-query";
import { getTrendingTours } from "../../../Services/tourService/tourService";
import { getOptimizedImageUrl } from "../../../utils/imageUtils";

const adaptToursWithLatestPhotos = (tours) => {
  if (!Array.isArray(tours)) return [];
  return tours.map((tour) => ({
    ...tour,
    imageCover: getOptimizedImageUrl(tour.imageCover),
    images: Array.isArray(tour.images)
      ? tour.images.map((img) => getOptimizedImageUrl(img))
      : tour.images,
  }));
};

function useTrendingCard({ onSuccess, onError } = {}) {
  const { data = [], isPending, error } = useQuery({
    queryKey: ["trending-tours"],
    queryFn: getTrendingTours,
    select: adaptToursWithLatestPhotos,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess,
    onError,
  });

  return {
    data,
    isPending,
    error,
  };
}

export default useTrendingCard;

