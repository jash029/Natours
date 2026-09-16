// useCreateBookingQuery.js

import { useMutation } from "@tanstack/react-query";
import { createBookingQuery } from "../../../Services/assitanceService/assitanceService.js";

export default function useCreateBookingQuery() {
  const {
    mutate: raiseBookingQuery,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: createBookingQuery,
  });

  return {
    raiseBookingQuery,
    isPending,
    isError,
    error,
  };
}
