import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMe as updateMeFn } from "../../../Services/userAuthentication/userAuthentication";

export default function useUpdateMe({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient();

  const {
    mutate: updateMe,
    isPending,
    isError,
  } = useMutation({
    mutationFn: updateMeFn,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });

      onSuccess?.(response);
    },

    onError: (err) => {
      onError?.(err);
    },
  });

  return {
    updateMe,
    isPending,
    isError,
  };
}
