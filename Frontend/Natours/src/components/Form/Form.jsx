import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect, useRef ,useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";
import VerifyEmail from "../Model/VerifyEmail";
import {
  Container,
  StyledForm,
  Title,
  Subtitle,
  FormGroup,
  Label,
  Input,
  Error,
  FormOptions,
  StyledLink,
  LoginButton,
  BottomText,
} from "./Form.style";

import useLogin from "../../features/hooks/UserHooks/useLogin";
import useSignup from "../../features/hooks/UserHooks/useSign";
import useForgetPassword from "../../features/hooks/UserHooks/useForgetPassword";
import useResetPassword from "../../features/hooks/UserHooks/useResetPassword";

function Form({ type })
{
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [verifyEmailAddress, setVerifyEmailAddress] = useState("");
   const navigate = useNavigate();
   const focus = useRef();
   const { token } = useParams();
   const {
     register,
     handleSubmit,
     watch,
     setFocus,
     setError,
     clearErrors,
     formState: { errors },
   } = useForm();

   const password = watch("password");

   const {
     signup,
     isPending: isSigningUp,
     isError: isSignError,
   } = useSignup({
     onSuccess: (response) => {
       toast.success("OTP Sended successfully , for Email Verification");
         setVerifyEmailAddress(response.data.email);

         setShowVerifyEmail(true);
       
     },
     onError: (err) => {
       setError("root.serverError", {
         type: "server",
         message: err?.response?.data?.message || "Unable to create account",
       });
     },
   });

   const {
     login,
     isPending: isLoggingIn,
     isError: isLoginError,
   } = useLogin({
     onSuccess: () => {
       toast.success("Login Successful");
       navigate("/");
     },

     onError: (err) => {
       setError("root.serverError", {
         type: "server",
         message: err?.response?.data?.message || "Invalid email or password",
       });
     },
   });

   const { forgetPassword, isVerified, isverificationError } =
     useForgetPassword({
       onSuccess: () => {
         toast.success("Email Send SuccessFully");
       },
       onError: (err) => {
         setError("root.serverError", {
           type: "server",
           message:
             err?.response?.data?.message ||
             "Email Verification Failed , Please Try Again After Some Time",
         });
       },
     });

   const {
     isPending: isResetPending,
     mutate: resetPassword,
     isError: isResetError,
   } = useResetPassword({
     onSuccess: () => {
       toast.success(
         "Password Changed successfully , Please Login with new Password",
       );
       navigate("/user/login");
     },
     onError: (err) => {
       setError("root.serverError", {
         type: "server",
         message:
           err?.response?.data?.message ||
           "Oops ! Something Went Wrong Please Try again Later!",
       });
     },
   });

   const isPending =
     type === "login"
       ? isLoggingIn
       : type === "signup"
         ? isSigningUp
         : type === "forgetPassword"
           ? isVerified
           : isResetPending;

   const isError =
     type === "login"
       ? isLoginError
       : type === "signup"
         ? isSignError
         : type === "forgetPassword"
           ? isverificationError
           : isResetError;

  console.log(isError);
   useEffect(() => {
     if (type === "login" || type === "forgetPassword") {
       setFocus("email");
     }

     if (type === "signup") {
       setFocus("name");
     }

     if (type === "resetPassword") {
       setFocus("password");
     }
   }, [type, setFocus]);

   const onSubmit = (data) => {
     console.log("Onsubmit is running..");
     console.log("type =", type);
     clearErrors("root.serverError");

     if (type === "login") {
       console.log(data);
       login(data);
       return;
     }

     if (type === "signup") {
       signup(data);
       return;
     }

     if (type === "forgetPassword") {
       // console.log('we Called the forgetPassword');
       forgetPassword(data);
       return;
     }

     if (type === "resetPassword") {
       resetPassword({
         data,
         token,
       });
       return;
     }
   };

 if (showVerifyEmail) {
   return (
     <VerifyEmail
       email={verifyEmailAddress}
       onClose={() => setShowVerifyEmail(false)}
     />
   );
 }
   return (
     <Container>
       <StyledForm onSubmit={handleSubmit(onSubmit)} type={type}>
         <Title>
           {type === "login"
             ? "Welcome Back"
             : type === "signup"
               ? "Create Account"
               : type === "forgetPassword"
                 ? "Forget Password"
                 : "Reset Password"}
         </Title>

         <Subtitle>
           {type === "login"
             ? "Login to continue your journey."
             : type === "signup"
               ? "Join us and start your journey today."
               : type === "forgetPassword"
                 ? "Please Provide Your Email For verification"
                 : "Change Your Password"}
         </Subtitle>

         {type === "signup" && (
           <FormGroup>
             <Label htmlFor="name">Full Name</Label>

             <Input
               id="name"
               type="text"
               placeholder="John Doe"
               autoComplete="name"
               {...register("name", {
                 required: "Name is required",
                 minLength: {
                   value: 3,
                   message: "Name must be at least 3 characters",
                 },
                 maxLength: {
                   value: 50,
                   message: "Name cannot exceed 50 characters",
                 },
               })}
             />

             {errors.name && <Error>{errors.name.message}</Error>}
           </FormGroup>
         )}

         {(type === "signup" ||
           type === "login" ||
           type === "forgetPassword") && (
           <FormGroup>
             <Label htmlFor="email">Email</Label>

             <Input
               id="email"
               type="email"
               placeholder="user@example.com"
               autoComplete="email"
               ref={focus}
               {...register("email", {
                 required: "Email is required",
                 pattern: {
                   value: /^\S+@\S+\.\S+$/,
                   message: "Please enter a valid email address",
                 },
               })}
             />

             {errors.email && <Error>{errors.email.message}</Error>}
           </FormGroup>
         )}

         {(type === "login" ||
           type === "signup" ||
           type === "resetPassword") && (
           <>
             <FormGroup>
               <Label htmlFor="password">
                 {type === "resetPassword" ? "New Password" : "Password"}
               </Label>

               <Input
                 id="password"
                 type="password"
                 placeholder="Enter your password"
                 autoComplete={
                   type === "login" ? "current-password" : "new-password"
                 }
                 {...register("password", {
                   required: "Password is required",
                   minLength: {
                     value: 8,
                     message: "Password must be at least 8 characters",
                   },
                 })}
               />

               {errors.password && <Error>{errors.password.message}</Error>}
             </FormGroup>

             {(type === "signup" || type === "resetPassword") && (
               <FormGroup>
                 <Label htmlFor="passwordConfirm">Confirm Password</Label>

                 <Input
                   id="passwordConfirm"
                   type="password"
                   placeholder="Confirm your password"
                   autoComplete="new-password"
                   {...register("passwordConfirm", {
                     required: "Please confirm your password",
                     validate: (value) =>
                       value === password || "Passwords do not match",
                   })}
                 />

                 {errors.passwordConfirm && (
                   <Error>{errors.passwordConfirm.message}</Error>
                 )}
               </FormGroup>
             )}

             {type === "login" && (
               <FormOptions>
                 <StyledLink to="/user/forgot-password">
                   Forgot Password?
                 </StyledLink>
               </FormOptions>
             )}
           </>
         )}

         {errors.root?.serverError && (
           <Error>{errors.root.serverError.message}</Error>
         )}

         <LoginButton type="submit" disabled={isPending}>
           {isPending
             ? type === "login"
               ? "Logging in..."
               : type === "signup"
                 ? "Creating account..."
                 : "Verification..."
             : type === "login"
               ? "Login"
               : type === "signup"
                 ? "Create Account"
                 : type === "forgetPassword"
                   ? "Verify Email"
                   : "Change password"}
         </LoginButton>

         <BottomText>
           {type === "login" ? (
             <>
               Don't have an account?{" "}
               <StyledLink to="/user/signup">Sign Up</StyledLink>
             </>
           ) : type === "signup" ? (
             <>
               Already have an account?{" "}
               <StyledLink to="/user/login">Login</StyledLink>
             </>
           ) : (
             <>
               <StyledLink to="/user/login">
                 <FaArrowLeft />
                 Back To Login
               </StyledLink>
             </>
           )}
         </BottomText>
       </StyledForm>
     </Container>
   );
 }

export default Form;
