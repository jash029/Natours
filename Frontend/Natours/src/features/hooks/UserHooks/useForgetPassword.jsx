import { useMutation } from "@tanstack/react-query";
import { forgetPassword as forgetPasswordFunc } from "../../../Services/userAuthentication/userAuthentication";
const useForgetPassword = function ({ onSuccess, onError } = {}) {
  const {
    isPending: isVerified,
    isError: isverificationError,
    mutate: forgetPassword,
  } = useMutation({
    mutationFn: forgetPasswordFunc,
    onSuccess,
    onError,
  });

  return { isVerified, isverificationError, forgetPassword };
};

export default useForgetPassword;
