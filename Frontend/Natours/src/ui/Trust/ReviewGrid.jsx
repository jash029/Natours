// ReviewGrid.jsx

import { motion } from "framer-motion";

import {
  Grid,
  Hero,
  Card2,
  Card3,
  Card4,
  Card5,
  VideoCard,
  Card7,
  Card8,
  Card9,
  Card10,
  Card11,
} from "./ReviewGrid.styles";

import { reviews } from "./data";
import ReviewCard from "./Review/ReviewCard";
import ImageCard from "./Review/ImageCard";

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 70,
    scale: 0.96,
    filter: "blur(12px)",
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",

    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.05,
    },
  },
};

function ReviewGrid() {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.25,
      }}
    >
      <Grid>
        <Hero>
          <ReviewCard review={reviews[0]} />
        </Hero>

        <Card2>
          <ReviewCard review={reviews[1]} />
        </Card2>

        <Card3>
          <ReviewCard review={reviews[2]} />
        </Card3>

        <Card4>
          <ReviewCard review={reviews[3]} />
        </Card4>

        <Card5>
          <ReviewCard review={reviews[4]} />
        </Card5>

        <VideoCard>
          <ImageCard />
        </VideoCard>

        <Card7>
          <ReviewCard review={reviews[5]} />
        </Card7>

        <Card8>
          <ReviewCard review={reviews[6]} />
        </Card8>

        <Card9>
          <ReviewCard review={reviews[7]} />
        </Card9>

        <Card10>
          <ReviewCard review={reviews[8]} />
        </Card10>

        <Card11>
          <ReviewCard review={reviews[9]} />
        </Card11>
      </Grid>
    </motion.section>
  );
}

export default ReviewGrid;
