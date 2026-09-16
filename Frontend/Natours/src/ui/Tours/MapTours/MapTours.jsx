import styled from "styled-components"
import { useRef } from "react";
import { useInView, motion } from "framer-motion";
import Map from './Map'

import {
  AuroraText,
  Header,
  Badge,
  Title,
  Subtitle,
  DiscoveryFeed,
} from "../../Grid/GridComponent.styles";

const Section = styled.section`
  
  padding-top: 4rem; 
  padding-bottom: 1rem;
  background: #0b0b0b;
  overflow: hidden;
  border-top: 1px solid #202018;
  z-index: 10000000000;
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
`;

function MapTours()
{
    const ref = useRef(null);

      
  const isInView = useInView(ref, {
    once: true,
    amount: 0.02,
    margin: "0px 0px -150px 0px",
  });
    return (
      <Section ref={ref}>
        <Container>
          <Header
            as={motion.div}
            initial={{ opacity: 0, y: 30 }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    y: 0,
                  }
                : {}
            }
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            <Badge>The World Is One Click Away</Badge>

            <Title>
                        Your Next Adventure
                        <br/>
              <AuroraText>Starts Here</AuroraText>
            </Title>

            <Subtitle>
              Search, explore, and discover destinations around the world with
              our interactive travel map.
            </Subtitle>
          </Header>

         <DiscoveryFeed>
                    <Map />
          </DiscoveryFeed>
        </Container>
      </Section>
    );
}

export default MapTours
