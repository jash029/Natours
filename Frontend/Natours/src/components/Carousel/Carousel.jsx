import { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

import { CARDS } from "./carouselData";
import { CarouselContainer, CarouselTrack } from "./Carousel.styles";
import TourCard from "./TourCard";


export default function Carousel() {
  const [activeIndex, setActiveIndex] = useState(2);
  const dragX = useMotionValue(0);

  const totalCards = CARDS.length;

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % totalCards);
  };

  const previousCard = () => {
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  const getOffset = (index) => {
    let offset = index - activeIndex;

    if (offset > totalCards / 2) {
      offset -= totalCards;
    }
    if (offset < -totalCards / 2) {
      offset += totalCards;
    }

    return offset;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextCard();
      if (e.key === "ArrowLeft") previousCard();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextCard,previousCard]);

  return (
    <CarouselContainer>
      <motion.div
        // 1. Replace drag="x" with onPan
        onPan={(e, info) => {
          // Update the motion value for the card micro-interactions
          dragX.set(info.offset.x);
        }}
        onPanEnd={(e, info) => {
          const threshold = 50; // Lowered slightly for a smoother swipe trigger

          // Trigger card change based on swipe distance
          if (info.offset.x < -threshold) {
            nextCard();
          } else if (info.offset.x > threshold) {
            previousCard();
          }

          // Animate the micro-interactions back to resting state
          animate(dragX, 0, {
            type: "spring",
            stiffness: 110,
            damping: 20,
          });
        }}
        style={{
          // 2. Remove `x: dragX` from here so the container stays locked in place
          position: "relative",
          width: "100%",
          height: "100%",
          cursor: "grab",
          touchAction: "pan-y", // 3. Prevents horizontal page scrolling on mobile while allowing vertical scroll
        }}
        whileTap={{
          cursor: "grabbing",
        }}
      >
        <CarouselTrack>
          {CARDS.map((card, index) => {
            const offset = getOffset(index);

            return (
              
                <TourCard
                  key={card.id}
                  card={card}
                  offset={offset}
                  dragX={dragX}
                  isActive={offset === 0}
                  onClick={() => setActiveIndex(index)}
                />
             
            );
          })}
        </CarouselTrack>
      </motion.div>
    </CarouselContainer>
  );
}
