import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import useUser from "../../../../features/hooks/UserHooks/useUser";
import useDeleteAccount from "../../../../features/hooks/UserHooks/useDeleteAccount";

import {
  Card,
  Header,
  Title,
  Description,
  Form,
  FormGroup,
  Label,
  Input,
  SaveButton,
  EmailWrapper,
  VerifiedBadge,
} from "./PersonalInformation.styles";

function DeleteAccount() {
  const navigate = useNavigate();

  const { user } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      password: "",
    },
  });

  const { deleteAccount, isPending } = useDeleteAccount({
    onSuccess: () => {
      toast.success("Your account has been deleted successfully.");

      reset();  

      navigate("/user/login", {
        replace: true,
      });
    },

      onError: (err) => {
      toast.error(
        err.response?.data?.message || "Unable to delete your account.",
      );
    },
  });

  function onSubmit(data) {
    deleteAccount(data.password);
  }

  return (
    <Card>
      <Header>
        <Title>Delete Account</Title>

        <Description>
          Permanently delete your Natours account. This action cannot be undone.
          All your personal information, profile and account data will be
          permanently removed.
        </Description>
      </Header>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label>Email Address</Label>

          <EmailWrapper>
            <Input value={user.email} readOnly disabled />

            <VerifiedBadge>Verified</VerifiedBadge>
          </EmailWrapper>
        </FormGroup>

        <FormGroup>
          <Label>Password</Label>

          <Input
            type="password"
            placeholder="Enter your password"
            disabled={isPending}
            {...register("password", {
              required: "Password is required.",
            })}
          />

          {errors.password && (
            <small style={{ color: "#ef4444" }}>
              {errors.password.message}
            </small>
          )}
        </FormGroup>

        <SaveButton type="submit" disabled={!isDirty || isPending}>
          {isPending ? "Deleting..." : "Delete Account"}
        </SaveButton>
      </Form>
    </Card>
  );
}

export default DeleteAccount;
