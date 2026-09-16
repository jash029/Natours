import  { css } from "styled-components";

/* ---------------------------------------- */
/* Font Weights */
/* ---------------------------------------- */

export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

/* ---------------------------------------- */
/* Letter Spacing */
/* ---------------------------------------- */

export const letterSpacing = {
  tight: "-0.04em",
  normal: "0",
  wide: "0.08em",
  wider: "0.16em",
  widest: "0.24em",
};

/* ---------------------------------------- */
/* Reusable Typography Mixins */
/* ---------------------------------------- */

export const heading = ({
  size = "2rem",
  weight = fontWeight.bold,
  color = "#fff",
  spacing = letterSpacing.tight,
  lineHeight = 1.1,
} = {}) => css`
  margin: 0;

  color: ${color};

  font-size: ${size};
  font-weight: ${weight};

  line-height: ${lineHeight};

  letter-spacing: ${spacing};
`;

export const paragraph = ({
  size = "1rem",
  color = "rgba(255,255,255,.85)",
  lineHeight = 1.6,
  weight = fontWeight.regular,
} = {}) => css`
  margin: 0;

  color: ${color};

  font-size: ${size};

  font-weight: ${weight};

  line-height: ${lineHeight};
`;

export const badgeText = ({ size = ".72rem", color = "#fff" } = {}) => css`
  font-size: ${size};

  color: ${color};

  font-weight: ${fontWeight.bold};

  text-transform: uppercase;

  letter-spacing: ${letterSpacing.wider};
`;

export const metaText = ({
  size = ".8rem",
  color = "rgba(255,255,255,.7)",
} = {}) => css`
  font-size: ${size};

  color: ${color};

  font-weight: ${fontWeight.medium};

  letter-spacing: ${letterSpacing.wide};
`;
