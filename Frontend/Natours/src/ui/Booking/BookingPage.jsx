import { Outlet } from "react-router-dom";

import {
  BookingWrapper,
  BookingContainer,
  ProgressWrapper,
  ProgressTrack,
  Step,
  StepDot,
  StepLine,
  StepLabel,
  Content,
} from "./BookingPage.styles";
import { useLocation } from "react-router-dom";


const Booking = () => {
  const location = useLocation();

  let currentStep = 0;

  if (location.pathname.includes("personal-info")) {
    currentStep = 1;
  } else if (location.pathname.includes("review")) {
    currentStep = 2;
  } else if (location.pathname.includes("terms")) {
    currentStep = 3;
  } else if (location.pathname.includes("payment")) {
    currentStep = 4;
  }

  const steps = [
    "Tour Infromation",
    "Personal Information",
    "Tour Review",
    "Terms & Policy",
    "Payment",
  ];

  return (
    <BookingWrapper>
      <BookingContainer>
        <ProgressWrapper>
          <ProgressTrack>
            {steps.map((step, index) => {
              const completed = index < currentStep;
              const active = index === currentStep;

              return (
                <Step key={step}>
                  <StepDot $active={active} $completed={completed} />

                  {index < steps.length - 1 && (
                    <StepLine $completed={completed} />
                  )}

                  <StepLabel $active={active}>{step}</StepLabel>
                </Step>
              );
            })}
          </ProgressTrack>
        </ProgressWrapper>

        <Content>
          <Outlet />
        </Content>
      </BookingContainer>
    </BookingWrapper>
  );
};

export default Booking;
