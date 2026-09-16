import {
  LuBadgeDollarSign,
  LuCircleX,
  LuCreditCard,
  LuShieldCheck,
  LuFileCheck,
  LuScale,
  LuUsers,
  LuBuilding2,
  LuHeartPulse,
  LuArrowRight,
  LuFileText,
} from "react-icons/lu";

import { useForm } from "react-hook-form";

import useBooking from "../../features/contexts/useBooking";

import {
  Container,
  Form,
  Section,
  SectionTitle,
  Description,
  PolicyList,
  PolicyItem,
  PolicyLeft,
  PolicyIcon,
  PolicyContent,
  PolicyTitle,
  PolicySubtitle,
  ViewLink,
  AgreementBox,
  AgreementRow,
  Checkbox,
  AgreementText,
  Error,
  BottomActions,
  PrimaryButton,
} from "./BookingTerms.styles";
import { useNavigate, useParams } from "react-router-dom";
import useTourDetail from "../../features/hooks/TourHooks/useTourDetail";


function BookingTerms() {
  const { bookingData, setBookingData } = useBooking();
  const navigate = useNavigate();
  const { tour } = useTourDetail();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: bookingData,
  });

 const { slug } = useParams();

const policies = [
  {
    icon: LuBadgeDollarSign,
    title: "Refund Policy",
    subtitle: "Understand how refunds are processed for cancelled bookings.",
    link: `/user/booking/${slug}/policy#refund`,
  },
  {
    icon: LuCircleX,
    title: "Cancellation Policy",
    subtitle:
      "Review cancellation timelines and applicable cancellation charges.",
    link: `/user/booking/${slug}/policy#cancellation`,
  },
  {
    icon: LuCreditCard,
    title: "Payment Policy",
    subtitle: "Know how successful and failed payments affect your booking.",
    link: `/user/booking/${slug}/policy#payment`,
  },
  {
    icon: LuShieldCheck,
    title: "Insurance Policy",
    subtitle: "Understand insurance coverage, exclusions and claim process.",
    link: `/user/booking/${slug}/policy#insurance`,
  },
  {
    icon: LuFileCheck,
    title: "Document Verification",
    subtitle:
      "Learn how passports, visas and identity documents are verified.",
    link: `/user/booking/${slug}/policy#documents`,
  },
  {
    icon: LuScale,
    title: "Criminal & Immigration",
    subtitle:
      "Traveler responsibilities regarding immigration and legal matters.",
    link: `/user/booking/${slug}/policy#criminal`,
  },
  {
    icon: LuUsers,
    title: "Traveler Information",
    subtitle: "Verify all traveler information before booking confirmation.",
    link: `/user/booking/${slug}/policy#traveler`,
  },
  {
    icon: LuBuilding2,
    title: "Third Party Services",
    subtitle:
      "Airlines, hotels and suppliers operate under their own policies.",
    link: `/user/booking/${slug}/policy#thirdparty`,
  },
  {
    icon: LuHeartPulse,
    title: "Health Declaration",
    subtitle: "Traveler fitness and medical responsibility declaration.",
    link: `/user/booking/${slug}/policy#health`,
  },
  {
    icon: LuFileText,
    title: "Terms & Conditions",
    subtitle: "Read the complete terms and conditions governing your booking.",
    link: `/user/booking/${slug}/policy#terms`,
  },
];



 function onSubmit(data) {
   const accepted = data.terms.accepted;

   setBookingData((prev) => ({
     ...prev,

     terms: {
       refundPolicy: accepted,
       cancellationPolicy: accepted,
       failedPaymentPolicy: accepted,
       insurancePolicy: accepted,
       documentVerificationPolicy: accepted,
       criminalAndImmigrationPolicy: accepted,
       travelerInformationPolicy: accepted,
       thirdPartyServicesPolicy: accepted,
       healthDeclarationPolicy: accepted,
       termsAndConditions: accepted,

       accepted,
       acceptedAt: new Date(),
       ipAddress: "", // Backend will populate this
       acceptedVersion: "v1.0",
     },
   }));

   navigate(`/user/booking/${tour?.slug}/payment`);
 }

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Section>
          <SectionTitle>Terms & Policies</SectionTitle>

          <Description>
            Please review the following policies before proceeding with your
            booking. These policies explain your rights, responsibilities and
            important travel information.
          </Description>

          <PolicyList>
            {policies.map((policy) => {
              const Icon = policy.icon;

              return (
                <PolicyItem key={policy.title}>
                  <PolicyLeft>
                    <PolicyIcon>
                      <Icon />
                    </PolicyIcon>

                    <PolicyContent>
                      <PolicyTitle>{policy.title}</PolicyTitle>

                      <PolicySubtitle>{policy.subtitle}</PolicySubtitle>
                    </PolicyContent>
                  </PolicyLeft>

                  <ViewLink to={policy.link}>
                    View
                    <LuArrowRight />
                  </ViewLink>
                </PolicyItem>
              );
            })}
          </PolicyList>
          <AgreementBox>
            <AgreementRow>
              <Checkbox
                type="checkbox"
                {...register("terms.accepted", {
                  required:
                    "You must accept the Terms & Policies before continuing.",
                })}
              />

              <AgreementText>
                <strong>I have read and agree to all Terms & Policies.</strong>
                <br />
                I confirm that I have carefully reviewed all policies listed
                above, including the Refund Policy, Cancellation Policy, Payment
                Policy, Insurance Policy, Document Verification Policy, Criminal
                & Immigration Policy, Traveler Information Policy, Third Party
                Services Policy and Health Declaration.
                <br />
                <br />
                I understand that my booking is subject to these policies and
                that my acceptance, booking information, acceptance timestamp,
                IP address and browser information may be securely stored for
                legal compliance, fraud prevention and security auditing.
                <br />
                <br />
                By selecting this checkbox, I voluntarily agree to all Terms &
                Policies and authorize the company to proceed with my booking.
              </AgreementText>
            </AgreementRow>

            {errors.terms?.accepted && (
              <Error>{errors.terms.accepted.message}</Error>
            )}
          </AgreementBox>
        </Section>

        <BottomActions>
       

          <PrimaryButton type="submit">Continue to Payment</PrimaryButton>
        </BottomActions>
      </Form>
    </Container>
  );
}

export default BookingTerms;