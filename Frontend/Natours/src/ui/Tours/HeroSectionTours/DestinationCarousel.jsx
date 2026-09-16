import { useMemo, useState } from "react";
import useCountryTopTours from "../../../features/hooks/TourHooks/useCountryTopTours";

import {
  CarouselWrapper,
  BackgroundImage,
  Overlay,
  Content,
  LeftContent,
  RightContent,
  CarouselSection,
  CardTrack,
} from "./DestinationCarousel.styles";

import DestinationCard from "./DestinationCard";
import CarouselControls from "./CarouselControls";
import Timeline from "./Timeline";

function DestinationCarousel() {
  const { data: countries = [], isPending, error } = useCountryTopTours();
  const [activeCountry, setActiveCountry] = useState(0);

  const country = countries[activeCountry];

  const cards = useMemo(() => {
    if (!country?.destinations?.length) return [];
    return [
      ...country.destinations,
      ...country.destinations,
      ...country.destinations,
      country.destinations[0],
    ];
  }, [country]);

  if (isPending) {
    return <CarouselSection>Loading...</CarouselSection>;
  }

  if (error || !countries.length || !country) {
    return null;
  }

  const handleNext = () => {
    setActiveCountry((prev) => (prev + 1) % countries.length);
  };

  const handlePrevious = () => {
    setActiveCountry((prev) => (prev === 0 ? countries.length - 1 : prev - 1));
  };

  const CARD_WIDTH = 220;
  const GAP = 24;
  const VIEWPORT_WIDTH = 520;

  const dragLimit = cards.length * (CARD_WIDTH + GAP) - VIEWPORT_WIDTH;

  return (
    <CarouselSection>
      <CarouselWrapper>
        <BackgroundImage image={country.background}>
          <Overlay />

          <Content>
            <Timeline
              totalSlides={countries.length}
              activeIndex={activeCountry}
              onSelect={setActiveCountry}
            />

            <LeftContent>
              <span>{country.country.toUpperCase()}</span>

              <h1>{country.title}</h1>

              <p>{country.description}</p>
            </LeftContent>

            <RightContent>
              <CardTrack
                drag="x"
                dragConstraints={{
                  left: -dragLimit,
                  right: 0,
                }}
                dragElastic={0.08}
                dragMomentum
                whileTap={{ cursor: "grabbing" }}
              >
                {cards.map((destination, index) => (
                  <DestinationCard
                    key={`${destination.id}-${index}`}
                    destination={destination}
                  />
                ))}
              </CardTrack>
            </RightContent>
          </Content>

          <CarouselControls
            activeIndex={activeCountry}
            totalSlides={countries.length}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </BackgroundImage>
      </CarouselWrapper>
    </CarouselSection>
  );
}

export default DestinationCarousel;
