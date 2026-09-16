import styled, { css } from "styled-components";

/**
 * Generic solid overlay
 */
export const overlay = ({ color = "0,0,0", opacity = 0.25 } = {}) => css`
  background: rgba(${color}, ${opacity});
`;

/**
 * Bottom gradient
 */
export const bottomGradient = ({
  start = "rgba(0,0,0,0.95)",
  middle = "rgba(0,0,0,0.45)",
  end = "transparent",
} = {}) => css`
  background: linear-gradient(to top, ${start} 0%, ${middle} 45%, ${end} 100%);
`;

/**
 * Top gradient
 */
export const topGradient = ({
  start = "rgba(0,0,0,.8)",
  end = "transparent",
} = {}) => css`
  background: linear-gradient(to bottom, ${start}, ${end});
`;

/**
 * Left gradient
 */
export const leftGradient = ({
  start = "rgba(0,0,0,.9)",
  end = "transparent",
} = {}) => css`
  background: linear-gradient(to right, ${start}, ${end});
`;

/**
 * Right gradient
 */
export const rightGradient = ({
  start = "rgba(0,0,0,.9)",
  end = "transparent",
} = {}) => css`
  background: linear-gradient(to left, ${start}, ${end});
`;

/**
 * Base Overlay Component
 */
export const Overlay = styled.div`
  position: absolute;
  inset: 0;

  pointer-events: none;
`;
