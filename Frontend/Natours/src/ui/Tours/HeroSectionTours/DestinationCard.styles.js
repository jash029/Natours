import styled from "styled-components";

import { radius, shadow, zIndex } from "../../card/CardToken";

import { hoverLift } from "../../card/hoverEffect";

import { imageZoom } from "../../card/imageEffects";

import { Overlay, bottomGradient } from "../../card/overlays";

import { absoluteContent } from "../../card/layout";

import { heading, badgeText } from "../../card/typography";

export const Card = styled.div`
  position: relative;

  width: 220px;
  height: 300px;

  flex-shrink: 0;

  overflow: hidden;

  cursor: pointer;

  background: #111;

  border-radius: ${radius.lg};

  box-shadow: ${shadow.lg};

  ${hoverLift({
    distance: "-12px",
    shadowLevel: shadow.xl,
  })}
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;

  ${imageZoom(Card, {
    scale: 1.08,
  })}
`;

export const CardOverlay = styled(Overlay)`
  ${bottomGradient({
    start: "rgba(0,0,0,.85)",
    middle: "rgba(0,0,0,.12)",
    end: "rgba(0,0,0,.02)",
  })}
`;

export const CardContent = styled.div`
  ${absoluteContent({
    left: "22px",
    right: "22px",
    bottom: "22px",
    gap: "6px",
  })}

  z-index: ${zIndex.content};
`;

export const Country = styled.span`
  ${badgeText({
    size: "1.02rem",
    color: "rgba(255,255,255,.72)",
  })}

  font-weight: 600;

  letter-spacing: 3px;
`;

export const Title = styled.h3`
  ${heading({
    size: "1.8rem",
    weight: 700,
    lineHeight: 1.15,
  })}
`;
