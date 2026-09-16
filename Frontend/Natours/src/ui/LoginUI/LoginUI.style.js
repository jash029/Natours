import styled from "styled-components";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const Layout = styled.main`
  width: 100%;
  min-height: 100vh;

  display: flex;
  background: #000;
  overflow: hidden;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

export const ImageWrapper = styled.div`
  flex: 1.5;

  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 992px) {
    min-height: 45vh;
  }
`;

export const Background = styled(motion.img)`
  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: center;

  display: block;

  user-select: none;
  pointer-events: none;

  will-change: transform, opacity, filter;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: center;

  display: block;

  user-select: none;
  pointer-events: none;
`;

export const FormWrapper = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;

  padding: clamp(2rem, 5vw, 6rem);

  border-left: 1px solid rgba(255, 255, 255, 0.12);

  position: relative;
  z-index: 2;

  @media (max-width: 992px) {
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    padding: 2rem;
  }
`;

export const DiscoveryFeed = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const HeroContent = styled.div`
  position: absolute;
  inset: 0;

  z-index: 2;
  display: flex;
  flex-direction: row;
  margin-top: 35px;
  justify-content: space-between;
  align-items: start;

  padding: clamp(2.5rem, 5vw, 5rem);

  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.05) 0%,
    rgba(0, 0, 0, 0.18) 35%,
    rgba(0, 0, 0, 0.55) 70%,
    rgba(0, 0, 0, 0.8) 100%
  );

  color: white;
`;

export const HeroBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;

  padding: 0.65rem 1.1rem;

  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);

  margin-bottom: 1.75rem;

  font-size: 0.8rem;
  font-weight: 600;

  letter-spacing: 0.18em;
  text-transform: uppercase;
`;



export const HeroSubtitle = styled(motion.p)`
  margin: 2rem 0 2.8rem;

  max-width: 520px;

  color: rgba(255, 255, 255, 0.88);

  font-size: clamp(1rem, 1.15vw, 1.2rem);

  line-height: 1.8;
`;

export const HeroButton = styled(motion(Link))`
  position: absolute;
  text-decoration: none;
  left: 38%;
  bottom: 3.5rem;

  transform: translateX(-50%);

  padding: 1rem 2.5rem;

  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 2px;

  background: rgba(0, 0, 0, 0.607);
  backdrop-filter: blur(16px);

  color: white;

  font-size: 1.2rem;
  font-weight: 300;

  cursor: pointer;

  z-index: 2;

  transition: 0.3s;

  &:hover {
    background: white;
    color: black;
  }
`;

export const HeroTitle = styled(motion.h1)`
  position: absolute;

  top: 7rem;
  left: 6rem;
  right: 4rem;

  margin: 0;

  font-size: clamp(4rem, 7vw, 7rem);
  line-height: 0.9;
  font-weight: 900;
  letter-spacing: -0.05em;

  color: white;

  text-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);

  z-index: 2;
`;