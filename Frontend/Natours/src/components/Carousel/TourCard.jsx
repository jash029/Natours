import { motion, useTransform } from "framer-motion";

import {
  CardWrapper,
  CardImage,
  ShadowOverlay,
  TextGradient,
  Badge,
  ContentBox,
  Title,
  Description,
  ExploreLink,
} from "./TourCard.styles";

const springTransition = {
  type: "spring",
  stiffness: 110,
  damping: 20,
  mass: 0.9,
};

function getCardLayout(offset) {
  const abs = Math.abs(offset);

  if (abs > 2) return null;

  if (abs === 0) {
    return {
      x: 0,
      y: -25,
      scale: 1,
      rotateY: 0,
      rotateZ: 0,
      opacity: 1,
      zIndex: 50,
    };
  }

  if (abs === 1) {
    const isLeft = offset < 0;

    return {
      x: isLeft ? -180 : 180,
      y: 15,
      scale: 0.88,
      rotateY: isLeft ? 28 : -28,
      rotateZ: isLeft ? -6 : 6,
      opacity: 0.9,
      zIndex: 40,
    };
  }

  const isLeft = offset < 0;

  return {
    x: isLeft ? -320 : 320,
    y: 60,
    scale: 0.76,
    rotateY: isLeft ? 42 : -42,
    rotateZ: isLeft ? -10 : 10,
    opacity: 0.65,
    zIndex: 30,
  };
}

function getTheme(theme) {
  let result = "";
  for (let i = 0; i < theme.length; i++){
    if (i === 0) {
      result += theme[0].toUpperCase();
      continue;
    }
     
    result += theme[i];
  }
  return result;
}

export default function TourCard({ card, offset, dragX, isActive, onClick }) {
  const dragRotateZ = useTransform(dragX, [-250, 0, 250], [-5, 0, 5]);

  const dragScale = useTransform(dragX, [-250, 0, 250], [0.95, 1, 0.95]);

  const layout = getCardLayout(offset);

  if (!layout) return null;

  const overlayOpacity = isActive ? 0 : Math.abs(offset) === 1 ? 0.25 : 0.45;

  const THEME = getTheme(card.theme);
  return (
    <CardWrapper onTap={onClick} animate={layout} transition={springTransition}>
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          rotateZ: dragRotateZ,
          scale: dragScale,
        }}
      >
        <CardImage src={card.image} alt={card.title} draggable={false} />

        <ShadowOverlay animate={{ opacity: overlayOpacity }} />

        <TextGradient />

        <Badge>{card.badge}</Badge>

        <ContentBox>
          <Title>{card.title}</Title>

          <Description>{card.description}</Description>

          <ExploreLink to={`/search?theme=${THEME}`}>Explore More</ExploreLink>
        </ContentBox>
      </motion.div>
    </CardWrapper>
  );
}
