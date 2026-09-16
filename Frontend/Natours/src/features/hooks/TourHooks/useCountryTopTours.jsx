import { useQuery } from "@tanstack/react-query";
import { getCountryTopTours } from "../../../Services/tourService/tourService";
import { getOptimizedImageUrl } from "../../../utils/imageUtils";

export function adaptCountryTopTours(data) {
  if (!data || typeof data !== "object") return [];

  return Object.entries(data).map(([countryName, tours]) => {
    const tourList = Array.isArray(tours) ? tours : [];
    const firstTour = tourList[0] || {};
    const lastTour = tourList[tourList.length - 1] || {};

    const description =
      firstTour.summary || firstTour.description || "";

    const background = getOptimizedImageUrl(lastTour.imageCover);

    const mappedDestinations = tourList.map((tour) => {
      const coverUrl = getOptimizedImageUrl(tour.imageCover);

      const destCountry =
        tour.destinations?.[0]?.country || countryName;

      return {
        ...tour,
        id: tour._id || tour.id,
        title: tour.name || tour.title || "",
        imageCover: coverUrl,
        images: Array.isArray(tour.images)
          ? tour.images.map((img) => getOptimizedImageUrl(img))
          : tour.images,
        country: destCountry,
      };
    });

    return {
      country: countryName,
      title: `Experience ${countryName}`,
      description,
      background,
      destinations: mappedDestinations,
    };
  });
}

function useCountryTopTours({ onSuccess, onError } = {}) {
  const { data = [], isPending, error } = useQuery({
    queryKey: ["country-top-tours"],
    queryFn: getCountryTopTours,
    select: adaptCountryTopTours,
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

export default useCountryTopTours;
