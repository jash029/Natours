import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import useChangePassword from "../../../../features/hooks/UserHooks/useChangePassword";

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
} from "./PersonalInformation.styles";

function ChangePassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      passwordCurrent: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const { changePassword, isPending } = useChangePassword({
    onSuccess: () => {
      toast.success("Password updated successfully.");

      reset();
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Unable to update password.");
    },
  });

  function onSubmit(data) {
    changePassword(data);
  }

  return (
    <Card>
      <Header>
        <Title>Change Password</Title>

        <Description>
          Update your account password to keep your account secure.
        </Description>
      </Header>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label>Current Password</Label>

          <Input
            type="password"
            disabled={isPending}
            placeholder="Enter your current password"
            {...register("passwordCurrent", {
              required: "Current password is required.",
            })}
          />

          {errors.passwordCurrent && (
            <small>{errors.passwordCurrent.message}</small>
          )}
        </FormGroup>

        <FormGroup>
          <Label>New Password</Label>

          <Input
            type="password"
            disabled={isPending}
            placeholder="Enter a new password"
            {...register("password", {
              required: "New password is required.",
              minLength: {
                value: 8,
                message: "Password must contain at least 8 characters.",
              },
            })}
          />

          {errors.password && <small>{errors.password.message}</small>}
        </FormGroup>

        <FormGroup>
          <Label>Confirm New Password</Label>

          <Input
            type="password"
            disabled={isPending}
            placeholder="Confirm your new password"
            {...register("passwordConfirm", {
              required: "Please confirm your new password.",
              validate: (value, formValues) =>
                value === formValues.password || "Passwords do not match.",
            })}
          />

          {errors.passwordConfirm && (
            <small>{errors.passwordConfirm.message}</small>
          )}
        </FormGroup>

        <SaveButton type="submit" disabled={!isDirty || isPending}>
          {isPending ? "Updating..." : "Update Password"}
        </SaveButton>
      </Form>
    </Card>
  );
}

export default ChangePassword;
