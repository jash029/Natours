import { useQuery } from "@tanstack/react-query";
import { getHomePageMarquee } from "../../../Services/tourService/tourService";
import { getOptimizedImageUrl } from "../../../utils/imageUtils";

const adaptHomePageTours = (data) => {
  if (!data) return data;

  const adaptList = (list) =>
    Array.isArray(list)
      ? list.map((tour) => ({
          ...tour,
          imageCover: getOptimizedImageUrl(tour.imageCover),
          images: Array.isArray(tour.images)
            ? tour.images.map((img) => getOptimizedImageUrl(img))
            : tour.images,
        }))
      : [];

  return {
    ...data,
    trendingTours: adaptList(data.trendingTours),
    discountTours: adaptList(data.discountTours),
  };
};

function useGetHomePageTours({ onSuccess, onError } = {}) {
  const { data, isPending, error } = useQuery({
    queryKey: ["home-page-tours"],
    queryFn: getHomePageMarquee,
    select: adaptHomePageTours,
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

export default useGetHomePageTours;
