// useMyBookingQueries.js

import { useQuery } from "@tanstack/react-query";
import { getMyBookingQueries } from "../../../Services/assitanceService/assitanceService.js";

export default function useMyBookingQueries() {
  const {
    data: queries,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["my-booking-queries"],
    queryFn: getMyBookingQueries,
  });

  return {
    queries,
    isPending,
    isError,
    error,
  };
}
