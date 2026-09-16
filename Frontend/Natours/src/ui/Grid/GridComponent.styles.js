import styled, { css, keyframes } from "styled-components";

/* ======================================================
   Aurora Gradient
====================================================== */

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
    #72d6ff 0%,
    #3cb8ff 20%,
    #0078ff 45%,
    #1755ac 70%,
    #0a34dc 100%  
  );

  background-size: 400% 400%;

  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  animation: ${aurora} 8s linear infinite;
`;

export const AuroraText = styled.span`
  ${auroraText}
`;

/* ======================================================
   Layout
====================================================== */

export const Section = styled.section`
  padding: 1rem 0 10rem;
  background: #0b0b0b;
  overflow: hidden;
  border-top: 1px solid #dbdbd4;
`;

export const Container = styled.div`
  width: min(150rem, calc(100% - 6rem));
  margin: 0 auto;
`;

export const Header = styled.div`
  max-width: 82rem;
  margin: 0 auto 9rem;
  text-align: center;
`;

/* ======================================================
   Badge
====================================================== */

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0.8rem 1.6rem;

  border-radius: 999px;

  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;

  color: rgba(255, 255, 255, 0.65);

  transition: 0.3s;

  &:hover {
    ${auroraText}
  }
`;

/* ======================================================
   Typography
====================================================== */

export const Title = styled.h2`
  margin-top: 2rem;

  font-size: clamp(3.6rem, 5vw, 7rem);
  line-height: 1.05;
  font-weight: 700;

  color: white;
`;

export const Subtitle = styled.p`
  max-width: 100rem;

  margin: 2.2rem auto 0;

  font-size: 1.6rem;
  line-height: 1.8;

  color: rgba(255, 255, 255, 0.72);
`;

/* ======================================================
   Discovery Feed
====================================================== */

export const DiscoveryFeed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;

  width: 100%;
  /* margin: 0 auto; */
`;
