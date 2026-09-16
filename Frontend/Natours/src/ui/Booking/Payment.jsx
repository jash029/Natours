import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {

  LuShieldCheck,
  LuCreditCard,
  LuWallet,
  LuLock,
  LuCircleCheckBig,
} from "react-icons/lu";

import useBooking from "../../features/contexts/useBooking";

import {
  Wrapper,
  Container,
  Header,
  Title,
  Subtitle,
  Grid,
  SummaryCard,
  CardTitle,
  SummaryRow,
  Divider,
  TotalRow,
  PaymentCard,
  MethodGroup,
  MethodButton,
  Form,
  Label,
  Input,
  Row,
  Half,
  CheckboxRow,
  Checkbox,
  SecureBox,
  PayButton,
  ProcessingOverlay,
  Spinner,
  SuccessIcon,
} from "./Payment.styles";
import useCurrencyDecoder from '../../Services/useCurrencyDetector'
import useTourDetail from "../../features/hooks/TourHooks/useTourDetail";
import useMyBooking from "../../features/hooks/BookingHooks/useMyBooking";
import toast from 'react-hot-toast';


function Payment() {
  const navigate = useNavigate();
  const { tour } = useTourDetail();
  const { createBooking} = useMyBooking();
  const { bookingData,setBookingData,bookingFiles } = useBooking();
  const { formatCurrency } = useCurrencyDecoder();
  const [method, setMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const packagePrice = bookingData?.totalAmount || 0;

  const amountToBePaid =
    (bookingData.totalAmount - bookingData.remainingAmount);
  
  const amountToBePaidOffline = bookingData?.remainingAmount;
  const total = bookingData?.totalAmount;

function onSubmit() {
  setProcessing(true);

  const payment = {
    provider: method === "card" ? "card" : "upi",
    status: "advancePaid",
    paidAt: new Date(),
  };

  const updatedBooking = {
    ...bookingData,
    payment,
  };

  // Update context
  setBookingData(updatedBooking);

  // Build multipart request
  const formData = new FormData();

  formData.append("bookingData", JSON.stringify(updatedBooking));

  Object.entries(bookingFiles).forEach(([field, file]) => {
    if (file) {
      formData.append(field, file);
    }
  });

  createBooking(
    {
      slug: tour.slug,
      formData,
    },
    {
      onSuccess: (data) => {
        console.log(data);

        setProcessing(false);
        setSuccess(true);

        setTimeout(() => {
          navigate(`/user/my-bookings/`);
        }, 2500);
      },

      onError: (err) => {
        console.error(err);

        setProcessing(false);
         toast.error('Unable to Make Payment Please Try Again...')
      },
    },
  );
}
  function formatCardNumber(value) {
    return value
      .replace(/\D/g, "") // remove non-digits
      .slice(0, 16) // max 16 digits
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  return (
    <Wrapper>
      {(processing || success) && (
        <ProcessingOverlay>
          {!success ? (
            <>
              <Spinner />

              <h2>Processing Payment...</h2>

              <p>Please do not refresh or close this window.</p>
            </>
          ) : (
            <>
              <SuccessIcon>
                <LuCircleCheckBig />
              </SuccessIcon>

              <h2>Payment Successful</h2>

              <p>Redirecting...</p>
            </>
          )}
        </ProcessingOverlay>
      )}

      <Container>
        <Header>
          <Title>Secure Payment</Title>

          <Subtitle>
            Your payment is protected using industry standard encryption.
          </Subtitle>
        </Header>

        <Grid>
          {/* ================= Summary ================= */}

          <SummaryCard>
            <CardTitle>Booking Summary</CardTitle>

            <SummaryRow>
              <span>Tour</span>
              <strong>{tour?.name.split(" ")[0] || "European Escape"}</strong>
            </SummaryRow>

            <SummaryRow>
              <span>Package</span>
              <strong>{bookingData.packageName || "Premium"}</strong>
            </SummaryRow>

            <SummaryRow>
              <span>Travelers</span>
              <strong>{bookingData?.travelers?.length || 2}</strong>
            </SummaryRow>

            <Divider />

            <SummaryRow>
              <span>Package</span>
              <strong> {formatCurrency(packagePrice)}</strong>
            </SummaryRow>

            <SummaryRow>
              <span>Amount need To Pay Offline</span>
              <strong> {formatCurrency(amountToBePaidOffline)}</strong>
            </SummaryRow>

            <SummaryRow>
              <span>Amount need To Pay Online</span>
              <strong> {formatCurrency(amountToBePaid)}</strong>
            </SummaryRow>

            <Divider />

            <TotalRow>
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </TotalRow>
          </SummaryCard>

          {/* ================= Payment ================= */}

          <PaymentCard>
            <CardTitle>Payment Method</CardTitle>

            <MethodGroup>
              <MethodButton
                active={method === "card"}
                onClick={() => setMethod("card")}
                type="button"
              >
                <LuCreditCard />
                Card
              </MethodButton>

              <MethodButton
                active={method === "upi"}
                onClick={() => setMethod("upi")}
                type="button"
              >
                <LuWallet />
                UPI
              </MethodButton>
            </MethodGroup>

            <Form onSubmit={handleSubmit(onSubmit)}>
              {method === "card" && (
                <>
                  <Label>Card Number</Label>

                  <Input
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    {...register("cardNumber", {
                      required: "Card number required",
                      pattern: {
                        value: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
                        message: "Enter a valid 16-digit card number",
                      },
                      onChange: (e) => {
                        const formatted = formatCardNumber(e.target.value);

                        setValue("cardNumber", formatted, {
                          shouldValidate: true,
                        });
                      },
                    })}
                  />

                  {errors.cardNumber && <p>{errors.cardNumber.message}</p>}

                  <Label>Card Holder</Label>

                  <Input
                    placeholder="JOHN DOE"
                    {...register("holder", {
                      required: "Card holder name is required",
                      pattern: {
                        value: /^[A-Za-z ]+$/,
                        message: "Only letters and spaces are allowed",
                      },
                    })}
                  />

                  {errors.holder && <p>{errors.holder.message}</p>}
                  <Row>
                    <Half>
                      <Label>Expiry</Label>

                      <Input
                        placeholder="MM/YY"
                        maxLength={5}
                        {...register("expiry", {
                          required: "Expiry date is required",
                          validate: (value) => {
                            const match = value.match(
                              /^(0[1-9]|1[0-2])\/(\d{2})$/,
                            );

                            if (!match) {
                              return "Enter expiry as MM/YY";
                            }

                            const month = Number(match[1]);
                            const year = 2000 + Number(match[2]);

                            const expiryDate = new Date(
                              year,
                              month,
                              0,
                              23,
                              59,
                              59,
                            );

                            return expiryDate > new Date()
                              ? true
                              : "Card has expired";
                          },
                        })}
                      />

                      {errors.expiry && <p>{errors.expiry.message}</p>}
                    </Half>

                    <Half>
                      <Label>CVV</Label>

                      <Input
                        type="password"
                        placeholder="123"
                        maxLength={3}
                        {...register("cvv", {
                          required: "CVV is required",
                          pattern: {
                            value: /^\d{3}$/,
                            message: "CVV must be exactly 3 digits",
                          },
                        })}
                      />

                      {errors.cvv && <p>{errors.cvv.message}</p>}
                    </Half>
                  </Row>
                </>
              )}

              {method === "upi" && (
                <>
                  <Label>UPI ID</Label>

                  <Input
                    placeholder="example@upi"
                    {...register("upi", {
                      required: "UPI ID is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/,
                        message: "Enter a valid UPI ID",
                      },
                    })}
                  />

                  {errors.upi && <p>{errors.upi.message}</p>}
                </>
              )}

              <CheckboxRow>
                <Checkbox type="checkbox" defaultChecked required/>
                Save payment details securely
              </CheckboxRow>

              <SecureBox>
                <LuShieldCheck />

                <div>
                  <strong>256-bit SSL Encryption</strong>

                  <p>
                    Your payment information is securely encrypted and never
                    stored on our servers.
                  </p>
                </div>
              </SecureBox>

              <PayButton type="submit">
                <LuLock />
                Pay {formatCurrency(amountToBePaid)}
              </PayButton>
            </Form>
          </PaymentCard>
        </Grid>
      </Container>
    </Wrapper>
  );
}

export default Payment;
