import { useMutation } from "@tanstack/react-query";
import { createMyBooking } from "../../../Services/bookingService/bookingService";

function useMyBooking() {
  const {
    mutate: createBooking,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: createMyBooking,
  });

  return {
    createBooking,
    isPending,
    isSuccess,
    isError,
    error,
  };
}

export default useMyBooking;
