import { css } from "styled-components";
import { transition } from "./CardToken";

export const imageZoom = (parent, { scale = 1.08 } = {}) => css`
  will-change: transform;
  transform: translateZ(0);
  transition: transform ${transition.image};

  transform-origin: center center;

  ${parent}:hover & {
    transform: scale(${scale}) translateZ(0);
  }
`;

export const imageBrightness = (parent, { brightness = 0.5 } = {}) => css`
  transition: filter ${transition.normal};

  ${parent}:hover & {
    filter: brightness(${brightness});
  }
`;
