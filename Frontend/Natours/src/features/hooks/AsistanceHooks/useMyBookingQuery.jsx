// useMyBookingQuery.js

import { useQuery } from "@tanstack/react-query";
import { getMyBookingQuery } from "../../../Services/assitanceService/assitanceService.js";

export default function useMyBookingQuery(id) {
  const {
    data: query,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["my-booking-query", id],
    queryFn: () => getMyBookingQuery(id),
    enabled: !!id,
  });

  return {
    query,
    isPending,
    isError,
    error,
  };
}
