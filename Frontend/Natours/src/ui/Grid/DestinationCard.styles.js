import styled from "styled-components";

import { radius, transition } from "../card/CardToken";



import { imageZoom, imageBrightness } from "../card/imageEffects";

import { Overlay, bottomGradient } from "../card/overlays";

import { absoluteContent } from "../card/layout";

import { heading, paragraph } from "../card/typography";

export const Card = styled.article`
  position: relative;

  width: 16rem;
  height: 20rem;

  flex-shrink: 0;

  overflow: hidden;

  border-radius: ${radius.xl};

  cursor: pointer;

  background: rgba(19, 18, 18, 1);

  &:hover {
    border: 2px solid rgba(19, 18, 18, 1);
  }
`;

export const ImageWrapper = styled.div`
  position: absolute;
  inset: 0;

  overflow: hidden;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;

  ${imageZoom(Card, {
    scale: 1.12,
  })}

  ${imageBrightness(Card, {
    brightness: 0.8,
  })}
`;

export const Gradient = styled(Overlay)`
  ${bottomGradient({
    start: "rgba(0,0,0,.92)",
    middle: "rgba(0,0,0,.45)",
    end: "transparent",
  })}

  opacity: .75;

  transition: opacity ${transition.normal};

  ${Card}:hover & {
    opacity: 1;
  }
`;

export const Content = styled.div`
  ${absoluteContent({
    left: "2rem",
    right: "2rem",
    bottom: "2rem",
  })}

  transition: transform ${transition.normal};

  ${Card}:hover & {
    transform: translateY(-1rem);
  
  }
`;

export const Destination = styled.h3`
  ${heading({
    size: "2.1rem",
  })}

  transition:
    transform ${transition.normal},
    opacity ${transition.normal};

  ${Card}:hover & {
    transform: translateY(-0.6rem);
    opacity: 0.9;
  }
`;

export const HoverContent = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 0.8rem;

  opacity: 0;

  transform: translateY(1.4rem);

  transition:
    opacity ${transition.normal},
    transform ${transition.normal};

  ${Card}:hover & {
    opacity: 1;
    transform: translateY(0);
   
  }
`;

export const Location = styled.p`
  ${paragraph({
    size: "1.35rem",
    color: "rgba(255, 255, 255, 0.92)",
    lineHeight: 1.5,
  })}
`;

export const ExploreButton = styled.button`
  margin-top: 1.4rem;

  width: fit-content;

  padding: 0.9rem 1.6rem;

  border: none;
  border-radius: ${radius.sm};

  background: white;
  color: black;

  font-size: 1.35rem;
  font-weight: 600;

  cursor: pointer;

  transition:
    transform ${transition.fast},
    background ${transition.fast},
    color ${transition.fast};

  &:hover {
    transform: translateX(4px);
  }
`;
