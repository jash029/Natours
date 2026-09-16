import  { css } from "styled-components";
import { spacing, zIndex } from "./CardToken";

/**
 * Absolute positioned content
 */
export const absoluteContent = ({
  left = spacing.lg,
  right = spacing.lg,
  bottom = spacing.lg,
  top = "auto",
  gap = spacing.sm,
  align = "flex-start",
} = {}) => css`
  position: absolute;

  left: ${left};
  right: ${right};
  top: ${top};
  bottom: ${bottom};

  display: flex;
  flex-direction: column;

  align-items: ${align};

  gap: ${gap};

  z-index: ${zIndex.content};
`;

/**
 * Fill Parent
 */
export const fillParent = css`
  position: absolute;
  inset: 0;
`;

/**
 * Center Content
 */
export const centerContent = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;
