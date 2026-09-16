import styled, { keyframes } from "styled-components";

const moveLeft = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

export const GridMotionCard = styled.div`
  background: #111111ce;
  overflow: hidden;
  position: relative;
  transform: skewY(-2deg);
  padding-top: 2.8rem;
  padding-bottom: 2.8rem;
  margin-top: 6.8rem;
  margin-bottom: 6.8rem;
  border-top: 1.4px solid rgba(255, 255, 255, 0.15);
  border-bottom: 1.4px solid rgba(255, 255, 255, 0.15);
`;

export const GridViewport = styled.div`
  position: relative;
  width: 100%;
  height: 270px;
  overflow: hidden;
  border-radius: 18px;

  /* Gradient edge fade mask matching Natours card background */
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 90px;
    z-index: 10;
    pointer-events: none;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, transparent 0%, transparent 100%);
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, transparent 0%, transparent 100%);
  }
`;

export const ParallaxContainer = styled.div`
  display: flex;
  align-items: center;
  width: 130%;
  left: -15%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: transform 0.15s ease-out;
  will-change: transform;
`;

export const GridRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2.2rem;
  width: max-content;
  will-change: transform;

  &.row-left {
    animation: ${moveLeft} ${(props) => props.$duration || 32}s linear infinite;
  }

  &:hover {
    animation-play-state: paused;
  }
`;

export const GridTile = styled.div`
  width: 320px;
  height: 220px;
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  transform: skewX(-10deg);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: skewX(-10deg) translateY(-6px) scale(1.03);
    z-index: 30;
    border-color: rgba(247, 247, 247, 1);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 1);
  }

  img {
    width: 130%;
    height: 100%;
    object-fit: cover;
    filter: brightness(1.20);
    transform: skewX(12deg) scale(1.18);
    transition: transform 0.4s ease;
  }

 
`;
