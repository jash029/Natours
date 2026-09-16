import styled from "styled-components";
import {motion} from 'framer-motion';
export const CarouselSection = styled.section`
  width: 100%;
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  /* padding: 10rem 0; */

`;

export const CarouselWrapper = styled.section`
  width: min(1500px, 100%);
  height: 100vh;

  position: relative;
  overflow: hidden;

  border-radius: 10px;

  background: rgba(12, 1, 1, 0.929);

 
  box-shadow:
    0 30px 90px rgba(0, 0, 0, 0.55),
    0 10px 30px rgba(0, 0, 0, 0.25);
`;

export const BackgroundImage = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  background-image: ${({ image }) => `
    linear-gradient(
      90deg,
      rgba(2,10,24,.92) 0%,
      rgba(3,12,32,.72) 35%,
      rgba(2,10,22,.45) 60%,
      rgba(0,0,0,.60) 100%
    ),
    url(${image})
  `};

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  transition: all 1.6s ease;
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;

  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.297) 0%,
    rgba(0, 0, 0, 0) 25%,
    rgba(0, 0, 0, 0.35) 55%,
    rgba(0, 0, 0, 0.75) 80%,
    rgba(0, 0, 0, 0.192) 100%
  );

  z-index: 1;
`;

export const Content = styled.div`
  position: relative;
  z-index: 2;

  width: 100%;
  height: 100%;

  padding: 0 5rem;

  display: grid;
  grid-template-columns: 90px 1fr 520px;

  column-gap: 4rem;

  align-items: center;
`;

export const LeftContent = styled.div`
  color: white;

  display: flex;
  flex-direction: column;
  justify-content: center;

  max-width: 600px;

  span {
    font-size: 2.9rem;
    letter-spacing: 2px;
    color: #f3f1ff;
    text-transform: uppercase;
    font-weight: 400;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: clamp(3rem, 5vw, 5rem);
    line-height: 1.05;
    margin-bottom: 1.5rem;
  }

  p {
    font-size: 1.25rem;
    line-height: 1.8;

    color: rgba(237, 222, 222, 0.75);

    max-width: 520px;
  }
`;

export const RightContent = styled.div`
  width: 100%;
  height: 380px;

  overflow: hidden;

  display: flex;
  align-items: center;
`;

export const CardTrack = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 2.5rem;

  height: 100%;
  width: max-content;
  scroll-behavior: smooth;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;