import { useQuery } from "@tanstack/react-query";
import { getMyAllBookings } from "../../../Services/bookingService/bookingService";

export default function useAllMyBookings() {
  const {
    data: bookings = [],
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: getMyAllBookings,
  });

  return {
    bookings,
    isLoading,
    error,
    isError,
    refetch,
  };
}
