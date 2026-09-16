import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../../Services/userAuthentication/userAuthentication";
const useResetPassword = function ({ onSuccess, onError } = {}) {
  const { isPending, isError, mutate } = useMutation({
    mutationFn: (data) => resetPassword(data),
    onSuccess,
    onError,
  });

  return { isPending, isError, mutate };
};

export default useResetPassword;
