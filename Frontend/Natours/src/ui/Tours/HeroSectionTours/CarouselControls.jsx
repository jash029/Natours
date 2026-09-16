import {
  Controls,
  Navigation,
  NavButton,
  Counter,
} from "./CarouselControls.styles";

import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

function CarouselControls({ activeIndex, totalSlides, onNext, onPrevious }) {
  return (
    <Controls>
      <Navigation>
        <NavButton onClick={onPrevious}>
          <LuArrowLeft />
        </NavButton>

        <NavButton onClick={onNext}>
          <LuArrowRight />
        </NavButton>
      </Navigation>

      <Counter>
        <span>{String(activeIndex + 1).padStart(2, "0")}</span>

        <small>/ {String(totalSlides).padStart(2, "0")}</small>
      </Counter>
    </Controls>
  );
}

export default CarouselControls;
