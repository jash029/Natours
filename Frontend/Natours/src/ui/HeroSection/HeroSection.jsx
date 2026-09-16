import { LuSearch } from "react-icons/lu";

import {
  HeroWrapper,
  HeroSection,
  Background,
  Overlay,
  Content,
  Specil,
  Button,
  Buttons,
  ButtonSec,
  SearchButton,
} from "./HeroSection.style";

function Hero() {
  return (
    <HeroWrapper>
      <HeroSection>
        <Background src="hero.jpg" alt="Travel Hero" />

        <Overlay />

        <SearchButton to="/search">
          <LuSearch />  Search
        </SearchButton>

        <Content>
          <Specil>
            EXPERIENCE
            <br />
            BEYOND BOUNDARIES
          </Specil>

          <Buttons>
            <Button to="/tours">Explore Tours</Button>
            <ButtonSec to="/about">Learn More</ButtonSec>
          </Buttons>
        </Content>
      </HeroSection>
    </HeroWrapper>
  );
}

export default Hero;
