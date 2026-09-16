import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { consultantBooking } from "../../Services/userAuthentication/userAuthentication";

import {
  BottomContent,
  FeaturesGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureText,
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
} from "./Trust.styles";

import {
  Badge,
  Section,
  Header,
  Title,
  Subtitle,
  AuroraText,
} from "../Grid/GridComponent.styles";

import {
  LuHeadphones,
  LuShieldCheck,
  LuCalendarCheck,
  LuClock3,
} from "react-icons/lu";

const features = [
  {
    icon: <LuHeadphones />,
    title: "24×7 Support",
    text: "We're available before, during and after your trip.",
  },
  {
    icon: <LuShieldCheck />,
    title: "Trusted Services",
    text: "Verified hotels, transport and local travel partners.",
  },
  {
    icon: <LuCalendarCheck />,
    title: "Flexible Planning",
    text: "Need changes? We'll help you adjust your itinerary.",
  },
  {
    icon: <LuClock3 />,
    title: "Save Time",
    text: "No endless searching or comparing. Just book and travel.",
  },
];

function Consultant() {
  const sectionRef = useRef(null);

  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.15,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      date: "",
      time: "",
      mode: "",
      message: "",
    },
  });

  async function onSubmit(data) {
    try {


      const response = await consultantBooking(data);

      toast.success(response.message);

      reset();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to book consultation.",
      );
    }
  }

  return (
    <Section ref={sectionRef}>
      <BottomContent>
        <Header
          as={motion.div}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Badge>Your Comfort Is Our Priority</Badge>

          <Title>
            Still Have Queries
            <br />
            <AuroraText>No Worries</AuroraText>
          </Title>

          <Subtitle>
            Whether it's support, accommodation, transportation, or local
            guidance, we've got every part of your journey covered.
          </Subtitle>
        </Header>

        <BottomWrapper>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                as={motion.div}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>

                <FeatureTitle>{feature.title}</FeatureTitle>

                <FeatureText>{feature.text}</FeatureText>
              </FeatureCard>
            ))}
          </FeaturesGrid>

          <ConsultationCard
            as={motion.div}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.1 }}
          >
            <ConsultationContent>
              <ConsultationHeading>
                Book a Free 1-on-1 Travel Consultation
              </ConsultationHeading>

              <ConsultationDescription>
                Have questions before booking? Speak directly with one of our
                travel experts and get personalized recommendations.
              </ConsultationDescription>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <InputGroup>
                  <Input
                    placeholder="Full Name"
                    {...register("name", {
                      required: "Full name is required.",
                    })}
                    disabled={isSubmitting}
                  />

                  <Input
                    type="email"
                    placeholder="Email Address"
                    {...register("email", {
                      required: "Email is required.",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email.",
                      },
                    })}
                    disabled={isSubmitting}
                  />
                </InputGroup>

                <InputGroup>
                  <Input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    {...register("date", {
                      required: "Please select a date.",
                    })}
                    disabled={isSubmitting}
                  />

                  <Input
                    type="time"
                    min="09:00"
                    max="18:00"
                    {...register("time", {
                      required: "Please select a time.",
                    })}
                    disabled={isSubmitting}
                  />
                </InputGroup>

                <InputGroup>
                  <Select
                    defaultValue=""
                    {...register("mode", {
                      required: "Please select a meeting mode.",
                    })}
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>
                      Select Meeting Mode
                    </option>

                    <option value="offline">Visit Offline</option>

                    <option value="online">Video Meeting</option>
                  </Select>
                </InputGroup>

                <TextArea
                  rows={5}
                  maxLength={500}
                  placeholder="Anything you'd like us to know?"
                  {...register("message", {
                    maxLength: {
                      value: 500,
                      message: "Message cannot exceed 500 characters.",
                    },
                  })}
                  disabled={isSubmitting}
                />

                <SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Scheduling..." : "Schedule Consultation"}
                </SubmitButton>
              </Form>
            </ConsultationContent>
          </ConsultationCard>
        </BottomWrapper>
      </BottomContent>
    </Section>
  );
}

export default Consultant;
