import { useMutation } from "@tanstack/react-query";
import { sign as signupApi } from "../../../Services/userAuthentication/userAuthentication";

function useSignup({ onSuccess, onError } = {}) {
  const {
    mutate: signup,
    isPending,
    isError,
  } = useMutation({
    mutationFn: signupApi,

    onSuccess: (response) => {
      onSuccess?.(response);
    },

    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    signup,
    isPending,
    isError,
  };
}

export default useSignup;
