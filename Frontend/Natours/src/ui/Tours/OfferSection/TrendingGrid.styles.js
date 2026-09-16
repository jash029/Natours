import styled from "styled-components";
import { motion } from "framer-motion";


export const Grid = styled(motion.div)`
  display: flex;
  gap: 2rem;
  justify-content: flex-start;
  align-items: stretch;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;

  padding: 1rem 1.5rem 2rem;

  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

