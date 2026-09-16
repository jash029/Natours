import { getBookmarks } from "../../../Services/tourService/tourService";
import { useMutation } from "@tanstack/react-query";

const useGetBookmark = function ({ onSuccess, onError } = {}) {
  const {
    mutate: getBookmarkTour,
    isError,
    isPending,
    data
  } = useMutation({
    mutationFn: getBookmarks,

    onSuccess: (data) => {
      onSuccess?.(data);
    },

    onError: (err) => {
      onError?.(err);
    },
  });

  return {getBookmarkTour,data, isError, isPending};
};

export default useGetBookmark;
