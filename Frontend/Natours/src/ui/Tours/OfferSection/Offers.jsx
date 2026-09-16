import { motion } from "framer-motion";
import styled from "styled-components";

import TrendingGrid from "./TrendingGrid";

import {
  AuroraText,
  Header,
  Badge,
  Title,
  Subtitle,
  DiscoveryFeed,
} from "../../Grid/GridComponent.styles";

import { Explore, HeaderTrending, OfferBlock } from "./Offers.style";

import useTrendingCard from "../../../features/hooks/TourHooks/useTrendingCard";
import useAdventureCard from "../../../features/hooks/TourHooks/useAdventureCard";
import usePartnerCard from "../../../features/hooks/TourHooks/usePartnerCard";

const Section = styled.section`
  padding-top: 4rem;
  padding-bottom: 2rem;
  background: #0b0b0b;
  overflow: hidden;
  border-top: 1px solid #202018;
  position: relative;
  z-index: 10;
`;

const Container = styled.div`
  width: min(150rem, calc(100% - 4rem));
  margin: 0 auto;
`;

export default function Offer() {
  const {
    data: trendingTours,
    isPending: trendingLoading,
    error: trendingError,
  } = useTrendingCard();

  const {
    data: adventureTours,
    isPending: adventureLoading,
    error: adventureError,
  } = useAdventureCard();

  const {
    data: partnerTours,
    isPending: partnerLoading,
    error: partnerError,
  } = usePartnerCard();

  const isLoading = trendingLoading || adventureLoading || partnerLoading;
  const hasError = trendingError || adventureError || partnerError;

  if (isLoading) return <div>Loading...</div>;
  if (hasError) return <div>Unable to load tour offers.</div>;

  return (
    <Section>
      <Container>
        <Header
          as={motion.div}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8 }}
        >
          <Badge>EXCLUSIVE DEALS</Badge>

          <Title>
            Best Value
            <AuroraText> Journeys</AuroraText>
          </Title>

          <Subtitle>
            Discover carefully curated tours that combine unforgettable
            destinations, premium experiences, and exceptional value—all at
            prices you'll love.
          </Subtitle>
        </Header>

        <OfferBlock $color={"white"}>
          <HeaderTrending $variant="trending"> Trending Deals</HeaderTrending>

          <DiscoveryFeed>
            <TrendingGrid tours={trendingTours} category="Trending" />
          </DiscoveryFeed>

          <Explore to="/tours/trending">Explore More →</Explore>
        </OfferBlock>

        <OfferBlock $color={"black"}>
          <HeaderTrending $variant="adventure"> Adventure Deals</HeaderTrending>

          <DiscoveryFeed>
            <TrendingGrid tours={adventureTours} category="Adventure" />
          </DiscoveryFeed>

          <Explore to="/tours/adventure">Explore More →</Explore>
        </OfferBlock>

        <OfferBlock $color={"white"}>
          <HeaderTrending $variant="partner">Partner Specials</HeaderTrending>

          <DiscoveryFeed>
            <TrendingGrid tours={partnerTours} category="Couple" />
          </DiscoveryFeed>

          <Explore to="/tours/couples">Explore More →</Explore>
        </OfferBlock>
      </Container>
    </Section>
  );
}
