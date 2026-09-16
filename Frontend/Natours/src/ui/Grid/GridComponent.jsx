import { motion } from "framer-motion";

import {
  Section,
  Container,
  Header,
  Badge,
  Title,
  Subtitle,
  DiscoveryFeed,
  AuroraText,
} from "./GridComponent.styles";

import useGetHomePageTours from "../../features/hooks/TourHooks/useGetHomePageTours";
import DestinationRow from "./DestinationRow";

export default function GridComponent() {
  const { data: tours, isPending, error } = useGetHomePageTours();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
          <Badge>Life Beyond Noise</Badge>

          <Title>
            Discover
            <br />
            <AuroraText>Beyond The Ordinary</AuroraText>
          </Title>

          <Subtitle>
            Wander through extraordinary destinations from every corner of the
            world. Pause, explore, and uncover journeys that inspire your next
            adventure.
          </Subtitle>
        </Header>

        <DiscoveryFeed>
          {tours.trendingTours?.length > 0 && (
            <DestinationRow data={tours.trendingTours} duration={26} />
          )}

          {tours.discountTours?.length > 0 && (
            <DestinationRow data={tours.discountTours} reverse duration={30} />
          )}
        </DiscoveryFeed>
      </Container>
    </Section>
  );
}
