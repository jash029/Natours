import styled from "styled-components";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  radius,
  shadow,
  transition,
  blur,
  zIndex,
} from "../../ui/card/CardToken";

import { absoluteContent } from "../../ui/card/layout";

import { overlay, bottomGradient, Overlay } from "../../ui/card/overlays";

import { heading, paragraph, badgeText } from "../../ui/card/typography";

export const CardWrapper = styled(motion.div)`
  position: absolute;

  left: 50%;
  top: 50%;

  margin-left: -135px;
  margin-top: -195px;

  width: 270px;
  height: 390px;

  overflow: hidden;

  border-radius: ${radius.xl};

  cursor: grab;

  transform-style: preserve-3d;
  transform-origin: center center;
  backface-visibility: hidden;

  will-change: transform;

  box-shadow: ${shadow.md};

  transition:
    box-shadow ${transition.normal},
    filter ${transition.normal};

  &:active {
    cursor: grabbing;
  }

  &:has(a:hover) {
    cursor: pointer;
    filter: brightness(1.08);
  }
`;

export const CardImage = styled.img`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;

  pointer-events: none;
  user-select: none;
`;

export const ShadowOverlay = styled(motion(Overlay))`
  ${overlay({
    opacity: 0.28,
  })};

  z-index: ${zIndex.overlay};
`;

export const TextGradient = styled(Overlay)`
  ${bottomGradient({
    start: "rgba(0,0,0,.9)",
    middle: "rgba(0,0,0,.6)",
    end: "rgba(0,0,0,0)",
  })};

  z-index: ${zIndex.overlay + 1};
`;

export const Badge = styled.div`
  position: absolute;

  top: 18px;
  right: 18px;

  padding: 6px 14px;

  border-radius: ${radius.xs};

  background: rgba(255, 255, 255, 0.95);

  color: #222;

  ${badgeText({
    size: "11px",
    color: "#222",
  })};

  z-index: ${zIndex.badge};

  backdrop-filter: blur(${blur.md});

  box-shadow: ${shadow.sm};
`;

export const ContentBox = styled.div`
  ${absoluteContent({
    left: "24px",
    right: "24px",
    bottom: "24px",
  })};
`;

export const Title = styled.h2`
  ${heading({
    size: "2rem",
    weight: 800,
  })};

  text-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
`;

export const Description = styled.p`
  ${paragraph({
    size: "1.05rem",
    color: "rgba(255,255,255,.9)",
    lineHeight: 1.5,
  })};

  margin-top: 10px;

  max-width: 210px;

  font-style: italic;

  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
`;

export const ExploreLink = styled(Link)`
  display: inline-flex;
  align-items: center;

  margin-top: 5px;

  width: fit-content;

  color: white;

  text-decoration: none;

  font-weight: 400;

  position: relative;

  z-index: 10;

  &:hover {
    text-decoration: underline;
  }
`;
