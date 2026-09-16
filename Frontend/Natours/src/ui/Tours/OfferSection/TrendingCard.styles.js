import styled from "styled-components";

import { radius, shadow, transition } from "../../card/CardToken";

import { hoverLift } from "../../card/hoverEffect";

import { imageZoom } from "../../card/imageEffects";

// import { absoluteContent } from "../../ui/card/layout";

export const Card = styled.article`
  flex: 0 0 280px;
  width: 280px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  scroll-snap-align: start;

  background: ${({ $category }) => {
    if (
      $category === "Adventure" ||
      $category === "Mountains" ||
      $category === "Oceans"
    )
      return `linear-gradient(
    155deg,
    #ffffffff 0%,
    #ffffffff 60%,
    #3c8dea 100%
  )`;

    if (
      $category === "Couple" ||
      $category === "Cities" ||
      $category === "Cuture"
    )
      return `linear-gradient(
    155deg,
    #FFFFFF 0%,
    #ffffffff 60%,
    #6e6ecdff 100%
  )`;

    if ($category === "Trending" || $category === "Forest")
      return `linear-gradient(
    155deg,
    #FFFFFF 0%,
    #FFFFFF 60%,
    #424ac1 100%
  )`;

    return "#FAFAF8";
  }};
  border-radius: ${radius.xl};

  z-index: 1000;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  ${hoverLift({
    distance: "-6px",
    shadowLevel: shadow.sm,
  })}
`;

export const ImageWrapper = styled.div`
  position: relative;

  overflow: hidden;

  width: 100%;
  height: 170px;

  border-radius: 1.4rem;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;

  ${imageZoom(Card, {
    scale: 1.06,
  })}
`;

export const Badge = styled.span`
  position: absolute;

  top: 18px;
  left: 18px;

  padding: 0.45rem 0.9rem;

  border-radius: ${radius.sm};

  background: rgba(255, 255, 255, 0.92);
  color: #111827;

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  border: 1px solid rgba(255, 255, 255, 0.18);

  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.18),
    0 1px 2px rgba(0, 0, 0, 0.08);

  font-size: 1rem;
  font-weight: 700;

  letter-spacing: 0.09em;

  backdrop-filter: blur(12px);
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;

  padding: 1rem;

  gap: 0.55rem;

  flex: 1;
`;

export const TopRow = styled.div`
  display: flex;

  justify-content: space-between;
  align-items: center;
`;

export const Rating = styled.div`
  display: flex;
  align-items: center;

  gap: 0.3rem;

  font-size: 1.25rem;

  font-weight: 600;

  color: #111827;
`;

export const Title = styled.h3`
  margin-top: 1rem;

  font-size: 1.55rem;

  font-weight: 700;

  line-height: 1.2;

  color: #111827;
`;

export const Meta = styled.p`
  margin: 0;

  font-size: 1rem;

  color: #2a2b2bff;
`;

export const PriceSection = styled.div`
  display: flex;
  flex-direction: column;

  gap: 0.4rem;

  margin-top: auto;
`;

export const CurrentPrice = styled.div`
  font-size: 1.55rem;

  font-weight: 800;

  color: #111827;
`;

export const Footer = styled.div`
  display: flex;

  justify-content: space-between;
  align-items: center;
`;

export const OriginalPrice = styled.span`
  font-size: 1rem;

  color: #030f23;

  text-decoration: line-through;
`;

export const Discount = styled.span`
  padding: 0.35rem 0.7rem;

  border-radius: ${radius.sm};

  background: #010812;

  color: #fcfcfc;

  font-size: 0.85rem;

  font-weight: 700;
`;

export const ViewDetails = styled.button`
  margin-top: 1rem;
  margin-left: 1rem;
  width: fit-content;

  padding: 1rem 1.5rem;

  border: none;

  border-radius: ${radius.sm};

  background: #0d141eff;

  color: white;

  font-size: 1.22rem;

  font-weight: 500;

  cursor: pointer;

  transition:
    background ${transition.fast},
    transform ${transition.fast};

  &:hover {
    transform: translateX(4px);

    background: #ffffff;
    color: #020202ff;
  }
`;

export const BookmarkButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;

  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 50%;

  background: rgba(0, 0, 0, 0.92);

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.18),
    0 1px 2px rgba(0, 0, 0, 0.08);

  cursor: pointer;
  transition: all 0.2s ease;

  color: #ef4444;

  &:hover:not(:disabled) {
    background: #0d0d0dff;
    border: 1px solid white;
    
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  svg {
    width: 22px;
    height: 22px;
  }
`;