import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyPassword } from "../../../Services/userAuthentication/userAuthentication";

export default function useChangePassword({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient();

  const {
    mutate: changePassword,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: updateMyPassword,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });

      onSuccess?.(data);
    },

    onError: (err) => {
      onError?.(err);
    },
  });

  return {
    changePassword,
    isPending,
    isError,
    error,
  };
}
