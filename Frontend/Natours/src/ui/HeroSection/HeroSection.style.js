import styled from "styled-components";
import { Link } from "react-router-dom";

export const HeroWrapper = styled.section`
  width: 100%;
  background: #000;
  padding: 6rem 0;
`;

export const HeroSection = styled.section`
  position: relative;
  width: 87%;
  margin: 0 auto;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 28px;
  background: black;
  top: 3rem;
`;

export const Background = styled.img`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 90%;

  object-fit: cover;
  object-position: center;

  will-change: transform, filter, opacity;

  z-index: 1;
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;

  background:
    linear-gradient(rgba(55, 10, 233, 0.13), rgba(15, 15, 15, 0.45)),
    linear-gradient(
      to top,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.8) 18%,
      rgba(0, 0, 0, 0.45) 35%,
      transparent 55%
    );

  z-index: 2;
`;

export const Content = styled.div`
  position: absolute;

  inset: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;

  padding: 3rem;

  z-index: 5;
`;

export const Specil = styled.h1`
  position: absolute;
  top: 3rem; /* Distance from the top */
  left: 50%;
  transform: translateX(-50%);

  /* color: rgba(0, 0, 0, 0.678); */
  color: #020202ea;
  font-size: clamp(3rem, 7vw, 6.5rem);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  text-align: center;

  /* text-shadow: 0 12px 30px rgba(0, 0, 0, 0.35); */

  z-index: 10000;
  width: 100%;
  padding: 0 1rem;
`;

export const Buttons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: space-around;
  left: 44%;
  bottom: 5.5rem;
  position: absolute;
`;

export const Button = styled(Link)`
  text-decoration: none;

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

export const ButtonSec = styled(Link)`
  text-decoration: none;

  transform: translateX(-50%);

  padding: 1rem 2.5rem;

  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 2px;

  background: rgba(217, 217, 218, 1);
  backdrop-filter: blur(16px);

  color: black;

  font-size: 1.2rem;
  font-weight: 300;

  cursor: pointer;

  z-index: 2;

  transition: 0.3s;

  &:hover {
    background: black;
    color: white;
  }
`;



export const SearchButton = styled(Link)`
  position: absolute;
  top: 2rem;
  right: 2rem;

  width: 10rem;
  height: 3rem;

  display: flex;
  align-items: center;
  justify-content: space-evenly;

  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);

  background: rgba(0, 0, 0, 0.71);
  backdrop-filter: blur(18px);

  color: #fff;
  text-decoration: none;

  z-index: 20;

  transition: all 0.3s ease;

  svg {
    font-size: 2.2rem;
  }

  &:hover {
    background: #fff;
    color: #000;
    border-color: #fff;
  }

  &:active {
    transform: scale(0.95);
  }
`;