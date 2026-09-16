import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyEmail as verifyEmailApi } from "../../../Services/userAuthentication/userAuthentication";

function useVerifyEmail({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient();

  const {
    mutate: verifyEmail,
    isPending,
    isError,
  } = useMutation({
    mutationFn: verifyEmailApi,

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: ["user"],
      });

      onSuccess?.(response);
    },

    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    verifyEmail,
    isPending,
    isError,
  };
}

export default useVerifyEmail;
