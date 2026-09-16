import { logout as logoutFn } from "../../../Services/userAuthentication/userAuthentication";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogout({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient();

  const {
    mutate: logout,
    isPending,
    isError,
  } = useMutation({
    mutationFn: logoutFn,

    onSuccess: (data) => {
      queryClient.setQueryData(["user"], null);

      onSuccess?.(data);
    },

    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    logout,
    isPending,
    isError,
  };
}
