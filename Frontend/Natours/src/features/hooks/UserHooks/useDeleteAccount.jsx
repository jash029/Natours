import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAccount as deleteAccountFn } from "../../../Services/userAuthentication/userAuthentication";

export default function useDeleteAccount({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient();

  const {
    mutate: deleteAccount,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: deleteAccountFn,

    onSuccess: (data) => {
      queryClient.clear();

      onSuccess?.(data);
    },

    onError: (err) => {
      onError?.(err);
    },
  });

  return {
    deleteAccount,
    isPending,
    isError,
    error,
  };
}
