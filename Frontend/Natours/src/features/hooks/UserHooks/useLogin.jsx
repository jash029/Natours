import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../../Services/userAuthentication/userAuthentication";

function useLogin({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient();

  const {
    mutate: login,
    isPending,
    isError,
  } = useMutation({
    mutationFn: loginApi,

    onSuccess: (response) => {
      const user = response.data.data.user;

      // Update the authenticated user in the React Query cache
      queryClient.setQueryData(["user"], user);

      onSuccess?.(response);
    },

    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    login,
    isPending,
    isError,
  };
}

export default useLogin;
