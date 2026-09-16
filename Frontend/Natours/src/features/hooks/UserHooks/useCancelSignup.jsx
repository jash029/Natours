import { useMutation } from "@tanstack/react-query";

import { cancelSignup as cancelSignupFn } from "../../../Services/userAuthentication/userAuthentication";

export default function useCancelSignup({ onSuccess, onError } = {}) {
  const {
    mutate: cancelSignup,
    isPending,
    isError,
  } = useMutation({
    mutationFn: cancelSignupFn,

    onSuccess: (data) => {
      onSuccess?.(data);
    },

    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    cancelSignup,
    isPending,
    isError,
  };
}
