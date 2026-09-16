import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getTourDetails } from "../../../Services/tourService/tourService";
import { getOptimizedImageUrl } from "../../../utils/imageUtils";

const adaptTourDetail = (data) => {
  if (!data || !data.tour) return data;

  const tour = data.tour;
  return {
    ...data,
    tour: {
      ...tour,
      imageCover: getOptimizedImageUrl(tour.imageCover, 1920),
      images: Array.isArray(tour.images)
        ? tour.images.map((img) => getOptimizedImageUrl(img, 1200))
        : tour.images,
    },
  };
};

function useTourDetail(slugParam) {
  const { slug: urlSlug } = useParams();
  const slug = slugParam || urlSlug;

  const { data, isPending, error } = useQuery({
    queryKey: ["tour", slug],
    queryFn: () => getTourDetails(slug),
    select: adaptTourDetail,
    enabled: Boolean(slug) && slug !== "undefined",
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    tour: data?.tour,
    isPending,
    error,
  };
}

export default useTourDetail;
