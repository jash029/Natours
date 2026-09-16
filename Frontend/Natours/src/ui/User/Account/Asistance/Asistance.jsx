
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";



import {
  BottomContent,
  ConsultationCard,
  ConsultationContent,
  ConsultationHeading,
  ConsultationDescription,
  Form,
  InputGroup,
  Input,
  Select,
  TextArea,
  SubmitButton,
  BottomWrapper,
} from "../../../Trust/Trust.styles";

import {
  Badge,
  Section,
  Header,
  Title,
  Subtitle,
  AuroraText,
} from "../../../Grid/GridComponent.styles";

import useUser from "../../../../features/hooks/UserHooks/useUser";
import useCreateBookingQuery from "../../../../features/hooks/AsistanceHooks/useCreateQuery";
import { Link } from "react-router-dom";


function Asistance() {


    const { raiseBookingQuery, isPending } = useCreateBookingQuery();
    const { user } = useUser();

const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm({
  defaultValues: {
    bookingId: "",
    category: "",
    subject: "",
    message: "",
  },
});

  function onSubmit(data) {
     
        
     raiseBookingQuery(
       { ...data, email: user?.email },
       {
         onSuccess: (response) => {
           toast.success(response?.message || "Support request submitted.");
           reset();
         },

         onError: (err) => {
           toast.error(
             err.response?.data?.message ||
               "Unable to submit your support request.",
           );
         },
       },
     );
        
    }

  return (
    <Section>
      <BottomContent>
        <Header>
          <Badge>Already Booked?</Badge>

          <Title>
            Need Help With
            <br />
            <AuroraText>Your Booking?</AuroraText>
          </Title>

          <Subtitle>
            Whether you need to cancel your booking, request a refund, resolve a
            payment issue, or verify your travel documents, our support team is
            here to help.
            <p style={{ color: "white", textDecoration: "underline" }}>
              <Link to="/user/all-queries" style={{ color: "white" }}>
                View All Queries
              </Link>
            </p>
          </Subtitle>
        </Header>

        <BottomWrapper>
          <ConsultationCard style={{ width: "100%", height: "700px" }}>
            <ConsultationContent>
              <ConsultationHeading>Raise a Support Request</ConsultationHeading>

              <ConsultationDescription>
                Submit your booking details and describe the issue you're
                facing. Our travel specialists will review your request and get
                back to you as soon as possible.
              </ConsultationDescription>

              <Form
                onSubmit={handleSubmit(onSubmit, (errors) => {
                  console.log("Validation Errors:", errors);
                })}
              >
                <InputGroup>
                  <Input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    disabled
                  />

                  <Input
                    placeholder="Booking ID"
                    {...register("bookingId", {
                      required: "Booking ID is required.",
                    })}
                    disabled={isPending}
                  />
                  {errors.bookingId?.message && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      {errors.bookingId?.message}
                    </p>
                  )}
                </InputGroup>

                <InputGroup>
                  <Select
                    defaultValue=""
                    {...register("category", {
                      required: "Please select an issue type.",
                    })}
                    disabled={isPending}
                  >
                    <option value="" disabled>
                      Select Issue Type
                    </option>
                    <option value="Booking Issue">Booking Issue</option>
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="Cancellation & Refund">Refund Issue</option>
                    <option value="Reschedule Trip">Reschedule Trip</option>
                    <option value="Travel Documents">Travel Documents</option>
                    <option value="Hotel Issue">Hotel Issue</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Tour Guide">Tour Guide</option>
                    <option value="Special Assistance">
                      Special Assistance
                    </option>
                    <option value="Technical Problem">Technical Problem</option>
                    <option value="Other">Other</option>
                  </Select>

                  {errors.category?.message && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      {errors.category?.message}
                    </p>
                  )}
                </InputGroup>

                <InputGroup>
                  <Input
                    placeholder="Subject"
                    {...register("subject", {
                      required: "Subject is required.",
                      minLength: {
                        value: 5,
                        message: "Subject should be at least 5 characters.",
                      },
                    })}
                    disabled={isPending}
                  />
                  {errors.subject?.message && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      {errors.subject?.message}
                    </p>
                  )}
                </InputGroup>

                <TextArea
                  rows={6}
                  maxLength={1000}
                  placeholder="Please describe your issue in detail. Include any important information that will help us resolve your request quickly."
                  {...register("message", {
                    required: "Please describe your issue.",
                    minLength: {
                      value: 20,
                      message: "Please provide at least 20 characters.",
                    },
                    maxLength: {
                      value: 1000,
                      message: "Message cannot exceed 1000 characters.",
                    },
                  })}
                  disabled={isPending}
                />
                {errors.message && (
                  <p
                    style={{ color: "red", fontSize: "12px", marginTop: "5px" }}
                  >
                    {errors.message.message}
                  </p>
                )}

                <SubmitButton type="submit" disabled={isPending}>
                  {isPending ? "Submitting..." : "Submit Support Request"}
                </SubmitButton>
              </Form>
            </ConsultationContent>
          </ConsultationCard>
        </BottomWrapper>
      </BottomContent>
    </Section>
  );
}

export default Asistance;
