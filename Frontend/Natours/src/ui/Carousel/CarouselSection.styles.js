import { css } from "styled-components";
import styled,{keyframes} from "styled-components";

export const Section = styled.section`
  width: 100%;
  padding: 8rem 0 8rem;
  overflow: hidden;
  background: #0b0b0b;
`;

export const Header = styled.div`
  max-width: 760px;
  margin: 0 auto 5rem;
  text-align: center;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0.6rem 1.4rem;

  border-radius: 999px;

   background: linear-gradient(
      135deg,
      #60a5fa 0%,
      #2563eb 40%,
      #1d4ed8 75%,
      #0f172a 100%
    );  
  border: 1px solid rgba(5, 17, 32, 1);

  color: #210909;

  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const Title = styled.h2`
  margin-top: 2rem;

  font-size: clamp(3.8rem, 6vw, 6.4rem);
  line-height: 1.1;
  font-weight: 700;

  color: #ffffff;

  span {
    color: #649fed;
  }
`;

export const Subtitle = styled.p`
  margin-top: 2rem;

  font-size: 1.6rem;
  line-height: 1.8;

  color: #ccd0d7;
`;

const aurora = keyframes`
  0% {
    background-position: 0% 50%;
  }

  25% {
    background-position: 100% 25%;
  }

  50% {
    background-position: 50% 100%;
  }

  75% {
    background-position: 0% 75%;
  }

  100% {
    background-position: 0% 50%;
  }
`;

export const auroraText = css`
  background: linear-gradient(
    90deg,
    #38bdf8,
    #2563eb,
    #7c3aed,
    #fefefe,
    #65929a,
    #01090d
  );

  background-size: 400% 400%;

  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;

  animation: ${aurora} 8s linear infinite;
`;

export const AuroraTexted = styled.span`
  display: inline-block;
  ${auroraText}
`;

