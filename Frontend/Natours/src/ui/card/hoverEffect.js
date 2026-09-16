import { css } from "styled-components";
import { shadow, transition } from "./CardToken";

/**
 * Generic lift effect
 */
export const hoverLift = ({
  distance = "-12px",
  shadowLevel = shadow.lg,
} = {}) => css`
  will-change: transform, box-shadow;
  transform: translateZ(0);
  transition:
    transform ${transition.normal},
    box-shadow ${transition.normal};

  &:hover {
    transform: translateY(${distance}) translateZ(0);
    box-shadow: ${shadowLevel};
  }
`;

/**
 * Generic scale effect
 */
export const hoverScale = ({ scale = 1.03 } = {}) => css`
  transition: transform ${transition.normal};

  &:hover {
    transform: scale(${scale});
  }
`;

/**
 * Generic brightness effect
 */
export const hoverBrightness = ({ amount = 1.08 } = {}) => css`
  transition: filter ${transition.normal};

  &:hover {
    filter: brightness(${amount});
  }
`;

/**
 * Generic opacity effect
 */
export const hoverOpacity = ({ opacity = 0.9 } = {}) => css`
  transition: opacity ${transition.normal};

  &:hover {
    opacity: ${opacity};
  }
`;
