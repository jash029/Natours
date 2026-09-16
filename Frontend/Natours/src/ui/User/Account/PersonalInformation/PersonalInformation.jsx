import { useEffect,useRef ,useState} from "react";
import { useForm } from "react-hook-form";

import useUser from "../../../../features/hooks/UserHooks/useUser";
import useUpdateMe from "../../../../features/hooks/UserHooks/useUpdateMe";
import toast from "react-hot-toast";
import {
  Card,
  Header,
  Title,
  Description,
  AvatarSection,
  Avatar,
  UploadButton,
  Form,
  Row,
  FormGroup,
  Label,
  Input,
  Select,
  TextArea,
  SaveButton,
  EmailWrapper,
  VerifiedBadge,
} from "./PersonalInformation.styles";

function PersonalInformation() {
  const { user, isLoading } = useUser();

  const [photo, setPhoto] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fileInputRef = useRef(null);

  const today = new Date();
  const maxDobDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  const maxDob = `${maxDobDate.getFullYear()}-${String(
    maxDobDate.getMonth() + 1
  ).padStart(2, "0")}-${String(maxDobDate.getDate()).padStart(2, "0")}`;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: "",
      dateOfBirth: "",
      gender: "prefer-not-to-say",
      bio: "",
    },
  });

  const { updateMe, isPending } = useUpdateMe({
    onSuccess: () => {
      toast.success("Profile updated successfully.");

      setPhoto(null);
      setPreviewImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Unable to update profile.");
    },
  });

  useEffect(() => {
    if (!user) return;

    reset({
      name: user.name || "",
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
      gender: user.gender || "prefer-not-to-say",
      bio: user.bio || "",
    });
  }, [user, reset]);

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and WEBP images are allowed.");
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error("Image must be smaller than 1 MB.");
      return;
    }

    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    setPhoto(file);

    setPreviewImage(URL.createObjectURL(file));
  }

  function onSubmit(data) {
    const formData = new FormData();

    if (photo) {
      formData.append("photo", photo);
    }

    if (data.name !== user.name) {
      formData.append("name", data.name);
    }

    if (data.bio !== (user.bio || "")) {
      formData.append("bio", data.bio);
    }

    if (!user.dateOfBirth && data.dateOfBirth) {
      formData.append("dateOfBirth", data.dateOfBirth);
    }

    if (
      user.gender === "prefer-not-to-say" &&
      data.gender !== "prefer-not-to-say"
    ) {
      formData.append("gender", data.gender);
    }

    if ([...formData.keys()].length === 0) {
      toast("Nothing to update.");
      return;
    }

    updateMe(formData);
  }

  if (isLoading) return <p>Loading...</p>;

  return (
    <Card>
      <Header>
        <Title>Personal Information</Title>

        <Description>
          Keep your profile up to date. This information will be used across
          your Natours account.
        </Description>
      </Header>

      <AvatarSection>
        <Avatar
          src={previewImage || user.photo?.url || "/user.svg"}
          alt={user.name}
        />

        <input
          ref={fileInputRef}
          id="profile-photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          disabled={isPending}
          onChange={handlePhotoChange}
        />

        <label htmlFor="profile-photo">
          <UploadButton
            as="span"
            style={{
              pointerEvents: isPending ? "none" : "auto",
              opacity: isPending ? 0.7 : 1,
            }}
          >
            Change Photo
          </UploadButton>
        </label>
      </AvatarSection>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <FormGroup>
            <Label>Full Name</Label>

            <Input
              disabled={isPending}
              {...register("name", {
                required: "Full name is required.",
                minLength: {
                  value: 3,
                  message: "Name must contain at least 3 characters.",
                },
                maxLength: {
                  value: 50,
                  message: "Name cannot exceed 50 characters.",
                },
                setValueAs: (value) => value.trim(),
              })}
            />

            {errors.name && <span>{errors.name.message}</span>}
          </FormGroup>

          <FormGroup>
            <Label>Email Address</Label>

            <EmailWrapper>
              <Input value={user.email} readOnly disabled />

              <VerifiedBadge>Verified</VerifiedBadge>
            </EmailWrapper>
          </FormGroup>
        </Row>

        <Row>
          <FormGroup>
            <Label>Date of Birth</Label>

            <Input
              type="date"
              max={maxDob}
              disabled={!!user.dateOfBirth || isPending}
              {...register("dateOfBirth", {
                validate: (value) => {
                  if (!value) return true;
                  if (value > maxDob) {
                    return "You must be at least 18 years old.";
                  }
                  return true;
                },
              })}
            />

            {errors.dateOfBirth && <span>{errors.dateOfBirth.message}</span>}

            {user.dateOfBirth && (
              <small>Date of birth can only be updated once.</small>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Gender</Label>

            <Select
              disabled={user.gender !== "prefer-not-to-say" || isPending}
              {...register("gender")}
            >
              <option value="prefer-not-to-say">Prefer not to say</option>

              <option value="male">Male</option>

              <option value="female">Female</option>

              <option value="other">Other</option>
            </Select>

            {user.gender !== "prefer-not-to-say" && (
              <small>Gender can only be selected once.</small>
            )}
          </FormGroup>
        </Row>

        <FormGroup>
          <Label>Bio</Label>

          <TextArea
            rows={5}
            maxLength={300}
            disabled={isPending}
            placeholder="Tell travelers something about yourself..."
            {...register("bio", {
              maxLength: {
                value: 300,
                message: "Bio cannot exceed 300 characters.",
              },
            })}
          />

          {errors.bio && <span>{errors.bio.message}</span>}
        </FormGroup>

        <SaveButton type="submit" disabled={(!isDirty && !photo) || isPending}>
          {isPending ? "Saving Changes..." : "Save Changes"}
        </SaveButton>
      </Form>
    </Card>
  );
}

export default PersonalInformation;