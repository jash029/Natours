import { useQuery } from "@tanstack/react-query";
import { getMyBookingDetails } from "../../../Services/bookingService/bookingService";

export default function useMyBookingDetails(bookingNumber) {
  const {
    data: booking,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["my-booking-details", bookingNumber],
    queryFn: () => getMyBookingDetails(bookingNumber),
    enabled: !!bookingNumber,
  });

  return {
    booking,
    isLoading,
    isError,
    error,
    refetch,
  };
}
