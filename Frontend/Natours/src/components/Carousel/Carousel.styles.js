import styled from "styled-components";

export const CarouselContainer = styled.section`
  position: relative;

  width: 100%;
  height: 600px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  perspective: 2000px;
  transform-style: preserve-3d;

  user-select: none;

  background: transparent;

  isolation: isolate;

  padding: 40px 0;

  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  @media (max-width: 1200px) {
    height: 620px;
  }

  @media (max-width: 992px) {
    height: 560px;
    perspective: 1700px;
  }

  @media (max-width: 768px) {
    height: 500px;
    perspective: 1400px;
  }

  @media (max-width: 576px) {
    height: 430px;
    perspective: 1000px;
  }
`;

export const CarouselTrack = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  transform-style: preserve-3d;

  /* Allow cards and links to receive mouse events */
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
`;

export const DragArea = styled.div`
  position: absolute;
  inset: 0;

  z-index: 0;

  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;
