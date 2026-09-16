// ReviewGrid.styles.js

import styled from "styled-components";

export const Grid = styled.section`
  width: min(145rem, 90%);
  margin: 2rem auto;

  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(9, 4.5rem);

  gap: 0.9rem;
`;

const Item = styled.div`
  width: 100%;
  height: 100%;

  border-radius: 2rem;
  overflow: hidden;

  background: #fff;
`;

/* -------------------- TOP -------------------- */

export const Hero = styled(Item)`
  grid-column: 1 / 4;
  grid-row: 1 / 4;
`;

export const Card2 = styled(Item)`
  grid-column: 4 / 7;
  grid-row: 1 / 4;
`;

export const Card3 = styled(Item)`
  grid-column: 7 / 10;
  grid-row: 1 / 4;
`;

export const Card4 = styled(Item)`
  grid-column: 10 / 13;
  grid-row: 1 / 4;
`;

/* ------------------- MIDDLE ------------------- */

export const Card5 = styled(Item)`
  grid-column: 1 / 4;
  grid-row: 4 / 7;
`;

export const VideoCard = styled(Item)`
  grid-column: 4 / 10;
  grid-row: 4 / 7;
`;

export const Card7 = styled(Item)`
  grid-column: 10 / 13;
  grid-row: 4 / 7;
`;

/* ------------------- BOTTOM ------------------- */

export const Card8 = styled(Item)`
  grid-column: 1 / 4;
  grid-row: 7 / 10;
`;

export const Card9 = styled(Item)`
  grid-column: 4 / 7;
  grid-row: 7 / 10;
`;

export const Card10 = styled(Item)`
  grid-column: 7 / 10;
  grid-row: 7 / 10;
`;

export const Card11 = styled(Item)`
  grid-column: 10 / 13;
  grid-row: 7 / 10;
`;
