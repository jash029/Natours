import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import {
  ComparisonSection,
  ComparisonCard,
  CardHeader,
  CardTitle,
  CardSubtitle,
  ComparisonList,
  ComparisonItem,
  IconWrapper
 
} from "./Trust.styles";

import {
   Section,
  Container,
  Header,
  Badge,
  Title,
  Subtitle,
  AuroraText,
} from '../Grid/GridComponent.styles'

import {
  LuCheck,
  LuX
} from "react-icons/lu";
import Consultant from "./Consultant";
import Review from "./Review";

export default function TrustComponent() {
  const sectionRef = useRef(null);

  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.10,
  });

  const traditional = [
    "Search Flight Tickets",
    "Book Train Tickets",
    "Find Hotels",
    "Arrange Local Transport",
    "Hire Local Guides",
    "Find Good Restaurants",
    "Emergency? Figure It Out",
    "Manage Multiple Payments",
  ];

  const ours = [
    "Flights Included",
    "Premium Hotel Stay",
    "Daily Meals Included",
    "Local Transport Included",
    "Professional Tour Guides",
    "Curated Experiences",
    "24×7 Travel Assistance",
    "One Booking. Everything Managed.",
  ];

 

  return (
    <>
      <Section ref={sectionRef}>
        <Container>
          <Header
            as={motion.div}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Badge>ONE BOOKING ZERO STRESS.</Badge>

            <Title>
                       Experiences
                       <br />
                       <AuroraText>Without Worries</AuroraText>
                     </Title>
           
                     <Subtitle>
                       No searching for flights. No comparing hotels. No worrying about
                       transport, meals, guides, or support. Book your trip once and let us
                       take care of everything while you focus on making memories.
                     </Subtitle>
          </Header>

          <ComparisonSection>
            {/* Traditional */}
            <ComparisonCard
              as={motion.div}
              initial={{ opacity: 0, x: -80 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <CardHeader>
                <CardTitle>Traditional Travel</CardTitle>

                <CardSubtitle>
                  Multiple bookings. Endless planning.
                </CardSubtitle>
              </CardHeader>

              <ComparisonList>
                {traditional.map((text, index) => (
                  <ComparisonItem
                    as={motion.li}
                    key={text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.08 }}
                  >
                    <IconWrapper $danger>
                      <LuX />
                    </IconWrapper>

                    {text}
                  </ComparisonItem>
                ))}
              </ComparisonList>
            </ComparisonCard>

            {/* Our Service */}
            <ComparisonCard
              $primary
              as={motion.div}
              initial={{ opacity: 0, x: 80 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <CardHeader>
                <CardTitle $black={true}>Travel With Us</CardTitle>

                <CardSubtitle $black={true}>
                  One booking. Everything included.
                </CardSubtitle>
              </CardHeader>

              <ComparisonList>
                {ours.map((text, index) => (
                  <ComparisonItem
                    as={motion.li}
                    key={text}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + index * 0.08 }}
                    $black={true}
                  >
                    <IconWrapper>
                      <LuCheck />
                    </IconWrapper>

                    {text}
                  </ComparisonItem>
                ))}
              </ComparisonList>
            </ComparisonCard>
          </ComparisonSection>
        </Container>
      </Section>
      <Consultant />
      <Review />
    </>
  );
}
