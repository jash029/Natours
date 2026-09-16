import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBookmarkTour } from "../../../Services/tourService/tourService";

const useAddBookmark = function ({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient();

  const {
    mutate: bookmarkTour,
    isPending,
    isError,
  } = useMutation({
    mutationFn: addBookmarkTour,

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

  return [bookmarkTour, isPending, isError];
};

export default useAddBookmark;
