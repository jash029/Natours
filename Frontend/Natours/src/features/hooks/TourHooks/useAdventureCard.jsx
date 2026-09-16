import { useQuery } from "@tanstack/react-query";
import { getAdventureTours } from "../../../Services/tourService/tourService";
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

function useAdventureCard({ onSuccess, onError } = {}) {
  const { data = [], isPending, error } = useQuery({
    queryKey: ["adventure-tours"],
    queryFn: getAdventureTours,
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

export default useAdventureCard;
