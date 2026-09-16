import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeBookmark } from "../../../Services/tourService/tourService";

const useRemoveBookmark = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  const {
    mutate: removeBookmarkTour,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: removeBookmark,

    onSuccess: (data) => {
      // Refetch bookmarks after removing one
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
    removeBookmarkTour,
    isPending,
    isError,
    error,
  };
};

export default useRemoveBookmark;
