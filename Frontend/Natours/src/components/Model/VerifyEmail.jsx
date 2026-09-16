import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { LuX } from "react-icons/lu";
import useVerifyEmail from "../../features/hooks/UserHooks/useVerifyEmail";
import useCancelSignup from "../../features/hooks/UserHooks/useCancelSignup";
import {
  Card,
  Title,
  Description,
  Email,
  OTPContainer,
  OTPInput,
  Form,
  VerifyButton,
  ErrorMessage,
  Overlay,
  Modal,
  CloseButton,
} from "./VerifyEmail.styles";

function VerifyEmail({ email, onClose }) {
  const navigate = useNavigate();

  const {
    register,
    setValue,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otp: "",
    },
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputRefs = useRef([]);

  const { verifyEmail, isPending } = useVerifyEmail({
    onSuccess: () => {
      toast.success("Account created successfully! Welcome to Natours.");

      navigate("/", {
        replace: true,
      });
    },

    onError: (error) => {
      setError("otp", {
        type: "manual",
        message:
          error.response?.data?.message ||
          "Invalid or expired verification code.",
      });

      setOtp(["", "", "", "", "", ""]);

      setValue("otp", "");

      inputRefs.current[0]?.focus();
    },
  });

  const updateOTP = (values) => {
    setOtp(values);

    setValue("otp", values.join(""), {
      shouldValidate: true,
    });

    if (errors.otp) clearErrors("otp");
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const values = [...otp];
    values[index] = value;

    updateOTP(values);

    if (value && index < values.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    switch (e.key) {
      case "Backspace": {
        if (otp[index]) {
          const values = [...otp];
          values[index] = "";

          updateOTP(values);
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }

        break;
      }

      case "ArrowLeft":
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
        break;

      case "ArrowRight":
        if (index < otp.length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
        break;

      default:
        break;
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedOTP = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedOTP) return;

    const values = ["", "", "", "", "", ""];

    pastedOTP.split("").forEach((digit, index) => {
      values[index] = digit;
    });

    updateOTP(values);

    inputRefs.current[Math.min(pastedOTP.length - 1, 5)]?.focus();
  };

  const { cancelSignup} = useCancelSignup({
    onSuccess: () => {
       toast.error("Unable to create Account");
        onClose();
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Internal Server Error");
      onClose();
    },
  });

  function onSubmit(data) {
    console.log(email);
    verifyEmail({
      email,
      otp: data.otp,
    });
  }

  async function handleClose() {
    cancelSignup(email);
  }

 return (
   <Overlay>
     <Modal>
       <Card>
         <CloseButton
           type="button"
           onClick={handleClose}
           aria-label="Close verification modal"
         >
           <LuX />
         </CloseButton>

         <Title>Verify Your Email</Title>

         <Description>We've sent a 6-digit verification code to</Description>

         <Email>{email}</Email>

         <Form onSubmit={handleSubmit(onSubmit)}>
           <input
             type="hidden"
             {...register("otp", {
               required: "Please enter the verification code.",
               minLength: {
                 value: 6,
                 message: "OTP must contain exactly 6 digits.",
               },
               maxLength: {
                 value: 6,
                 message: "OTP must contain exactly 6 digits.",
               },
             })}
           />

           <OTPContainer onPaste={handlePaste}>
             {otp.map((digit, index) => (
               <OTPInput
                 key={index}
                 ref={(el) => (inputRefs.current[index] = el)}
                 type="text"
                 inputMode="numeric"
                 autoComplete="one-time-code"
                 maxLength={1}
                 value={digit}
                 disabled={isPending}
                 onChange={(e) => handleChange(e.target.value, index)}
                 onKeyDown={(e) => handleKeyDown(e, index)}
               />
             ))}
           </OTPContainer>

           {errors.otp && <ErrorMessage>{errors.otp.message}</ErrorMessage>}

           <VerifyButton type="submit" disabled={isPending}>
             {isPending ? "Verifying..." : "Verify Email"}
           </VerifyButton>
         </Form>
       </Card>
     </Modal>
   </Overlay>
 );
}

export default VerifyEmail;
