import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import {
  BottomContent,
  BottomWrapper,
} from "./Trust.styles";

import {
  Section,
  Header,
  Title,
  Subtitle,
  AuroraText,
  Badge,
} from "../Grid/GridComponent.styles";
import ReviewGrid from "./ReviewGrid";





function Review() {
  const sectionRef = useRef(null);

  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.15,
  });

  return (
    <Section ref={sectionRef}>
      <BottomContent>
        <Header
          as={motion.div}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Badge>Trust of Millions</Badge>
          <Title>
            Thousands of
            <br />
            <AuroraText>Great Reviews</AuroraText>
          </Title>
          <Subtitle>
            Real stories from travelers who trusted us to plan their journey and
            returned home with unforgettable memories.
          </Subtitle>
        </Header>
      </BottomContent>

     <BottomWrapper>
        <ReviewGrid />
      </BottomWrapper>
    </Section>
  );
}

export default Review;
