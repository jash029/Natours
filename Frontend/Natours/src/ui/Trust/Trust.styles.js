/* ======================================================
   Comparison Section
====================================================== */
import styled, {css} from "styled-components";
export const ComparisonSection = styled.div`
  max-width: 80%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.5fr  0.5fr;
  gap: 2rem;
  align-items: center;

  margin-top: 8rem;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

export const ComparisonCard = styled.div`
  position: relative;

  padding: 1.6rem;

  border-radius: 2.4rem;

  background: ${({ $primary }) =>
    $primary
      ? "linear-gradient(90deg,#4157e5,#ffffffff 95%)"
      : "#111111"};

  border: 1px solid ${({ $primary }) => ($primary ? "#ffffff" : "#232323")};

  overflow: hidden;

  transition: 0.35s;

  &:hover {
    transform: translateY(-8px);
    border-color: ${({ $primary }) => ($primary ? "#000000" : "#3b3b3b")};
  }
`;

export const CardHeader = styled.div`
  margin-bottom: 1rem;
`;

export const CardTitle = styled.h3`
  font-size: 2.8rem;
  font-weight: 600;

  color: ${({ $black }) => ($black ? "#040404" : "#b3b0b0")};
`;

export const CardSubtitle = styled.p`
  margin-top: 1rem;

  font-size: 1.5rem;
  line-height: 1.7;

  color: rgba(255, 255, 255, 0.65);
  color: ${({ $black }) =>
    $black ? "#101010" : " rgba(255, 255, 255, 0.65)"};
`;

export const ComparisonList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  list-style: none;
`;

export const ComparisonItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1.4rem;

  padding: 1.4rem 0;

  font-size: 1.55rem;

  color: ${({ $black }) =>
    $black ? "rgba(0, 0, 0, 1)" : " rgba(255, 255, 255, 0.86)"};
  border-bottom: 1px solid
    ${({ $black }) =>
      $black ? "rgba(0, 0, 0, 0.637)" : " rgba(255, 255, 255, 0.281)"};

  &:last-child {
    border-bottom: none;
  }
`;

export const IconWrapper = styled.div`
  width: 3.8rem;
  height: 3.8rem;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 50%;

  font-size: 1.8rem;

  background: ${({ $danger }) =>
    $danger ? "rgba(255, 255, 255, 0.12)" : "rgba(24, 22, 22, 1)"};

  color: ${({ $danger }) => ($danger ? "#ffffff" : "#efeeee")};
`;



/* ======================================================
   Bottom Content
====================================================== */

export const BottomContent = styled.div`
  padding-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const FeaturesGrid = styled.div`
  width: 90%;
  margin: 0 auto;
  border: 1px solid #111111;
  padding: 2rem;
  border-radius: 14px;
  /* background-color: #1c1c1c; */
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const FeatureCard = styled.div`
  padding: 2rem;

  border-radius: 2rem;

  background: #111111ff;

  border: 1px solid #a5a5a5;

  transition: 0.35s;

  &:hover {
    transform: translateY(-8px);

    border-color: #f7f9ff;
  }
`;

export const FeatureIcon = styled.div`
  width: 2rem;
  height: 2rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  font-size: 2.4rem;

  color: #4db3ff;

  background: rgba(77, 179, 255, 0.12);
`;

export const FeatureTitle = styled.h4`
  margin-top: 2rem;

  font-size: 2rem;
  font-weight: 600;

  color: white;
`;

export const FeatureText = styled.p`
  margin-top: 1rem;

  font-size: 1.5rem;
  line-height: 1.8;

  color: rgba(255, 255, 255, 0.68);
`;

/* ======================================================
   Consultation
====================================================== */

export const ConsultationCard = styled.div`
  padding: 2rem;
  width: 70%;
  margin: 0 auto;
  border-radius: 3rem;

  background: linear-gradient(180deg, #335de7, #0c0c0c 90%);
 
  /* border-bottom: 1px solid #d80f0f; */
`;

export const ConsultationContent = styled.div`
  width: 100%;
  margin: 0 auto;
`;

export const ConsultationHeading = styled.h3`
  text-align: center;

  font-size: clamp(2rem, 3vw, 3.5rem);

  color: #ffffff;
  font-family: 600;
`;

export const ConsultationDescription = styled.p`
  max-width: 65rem;

  margin: 2rem auto 4rem;

  text-align: center;

  font-size: 1.5rem;
  line-height: 1.8;

  color: rgba(255, 255, 255, 0.808);
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const InputGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const inputStyles = css`
  width: 100%;

  padding: 1.4rem 2.4rem;

  border-radius: 1.4rem;

  border: 1px solid #2d2d2d;

  background: #ffffff;

  color: black;

  font-size: 1.5rem;

  outline: none;

  transition: 0.3s;

  &:focus {
    border-color: #ffffff;
  }

  &::placeholder {
    color: rgba(0, 0, 0, 0.868);
  }
`;

export const Input = styled.input`
  ${inputStyles}
`;

export const Select = styled.select`
  ${inputStyles}

  cursor:pointer;
`;

export const TextArea = styled.textarea`
  ${inputStyles}

  resize: vertical;

  min-height: 16rem;
`;

export const SubmitButton = styled.button`
  width: fit-content;

  margin: 1rem auto 0;

  padding: 1.7rem 4rem;

  border-radius: 14px;

  cursor: pointer;

  font-size: 1.55rem;
  font-weight: 400;

  color: black;

  background: white;
  border: 1px solid white;
  transition: 0.35s;

  &:hover {
    background-color: #141313;
    color: #ffffff;
    border: 1px solid white;
    
  }
`;


export const BottomWrapper = styled.div`
display: flex;
flex-direction: column;
gap: 10rem;
align-items: center;
justify-content: center;
`;
