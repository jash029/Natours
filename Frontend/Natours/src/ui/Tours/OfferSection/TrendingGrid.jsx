import { motion } from "framer-motion";

import TrendingCard from "./TrendingCard";
import { Grid } from "./TrendingGrid.styles";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function TrendingGrid({ tours = [], category }) {
  return (
    <Grid
      as={motion.div}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{
        once: true,
        amount: 0.15,
      }}
    >
      {tours.map((tour, index) => (
        <TrendingCard
          key={tour._id}
          tour={tour}
          index={index}
          category={category}
        />
      ))}
    </Grid>
  );
}
