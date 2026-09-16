import { motion } from "framer-motion";

import Carousel from "../../components/Carousel";

import {
  Section,
  Header,
  Badge,
  Title,
  Subtitle,
} from "./CarouselSection.styles";
import { AuroraText } from "../Grid/GridComponent.styles";

const ease = [0.16, 1, 0.3, 1];

export default function CarouselSection() {
  return (
    <Section>
      <Header
        as={motion.div}
        initial={{
          opacity: 0,
          y: 16,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.15,
        }}
        transition={{
          duration: 1,
          ease,
        }}
      >
        <Badge> Explore Destinations</Badge>

        <Title>
          Discover Your Next <AuroraText>Adventure</AuroraText>
        </Title>

        <Subtitle>
          Explore breathtaking landscapes, vibrant cities, and unforgettable
          journeys carefully curated for every kind of traveler.
        </Subtitle>
      </Header>

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.985,
          y: 12,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.11,
        }}
        transition={{
          delay: 0.18,
          duration: 1.2,
          ease,
        }}
      >
        <Carousel />
      </motion.div>
    </Section>
  );
}
