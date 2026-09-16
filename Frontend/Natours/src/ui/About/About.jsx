import  { useState, useEffect } from "react";
import {
  Compass,
  MapPin,
  Clock,
  ShieldCheck,
  Hotel,
  Check,
  Star,
  Award,
  Users,
  ArrowRight,
  Sparkles,
  Search,
} from "lucide-react";

import {
  GlobalStyle,
  AuroraText,
  PageWrapper,
  Container,
  Section,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  PrimaryButton,
  ButtonGroup,
  HeroSection,
  HeroGrid,
  HeroContent,
  HeroImageWrapper,
  HeroMainImage,
  HeroOverlay,
  StoryGrid,
  StoryImageWrapper,
  StoryContent,
  MiniFeatureGrid,
  MiniFeatureCard,
  ValuesGrid,
  ValueCard,
  GalleryGrid,
  GalleryItem,
  StatsGrid,
  StatCard,
  TrustGrid,
  TrustContent,
  ChecklistGrid,
  ChecklistItem,
  TrustImageWrapper,
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineContent,
  PromiseGrid,
  PromiseCard,
  CTASection,
  CTAOverlay,
 CTAContent,
  SecondaryButton
} from "./About.styles";
import { Navigate, useNavigate } from "react-router-dom";

// High-resolution Unsplash images curated for luxury travel aesthetic with fallback
const IMAGES = {
  hero: "/m.jpg",
  heroFallback:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
  story: "/hero.jpg",
  storyFallback:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
  trust: "/couple.jpg",
  trustFallback:
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop",
  cta: "/m.jpg",
  ctaFallback:
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&auto=format&fit=crop",
  gallery: [
    {
      url: "/images/itly.jpg",
      fallback:
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop",
      title: "Amalfi Coast Private Villa & Yacht",
      location: "Positano, Italy",
      tag: "Coastal Luxury",
      size: "large",
      desc: "Private 120ft yacht charter exploring hidden sea caves, paired with exclusive cliffside villa accommodations overlooking Positano.",
    },
    {
      url: "/images/japan.jpg",
      fallback:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop",
      title: "Kyoto Ancient Temple Sanctuary",
      location: "Kyoto, Japan",
      tag: "Cultural Access",
      size: "small",
      desc: "After-hours private access to historic UNESCO temples with tea ceremony guided by a 15th-generation Grand Master.",
    },
    {
      url: "/images/switzerland.jpg",
      fallback:
        "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=1000&auto=format&fit=crop",
      title: "Alpine Chalet Overlooking Matterhorn",
      location: "Zermatt, Switzerland",
      tag: "Mountain Retreat",
      size: "small",
      desc: "Helicopter transfers direct to private ski chalets complete with Michelin-trained private chef and spa butler.",
    },
    {
      url: "/images/about/gallery-4.jpg",
      fallback:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200&auto=format&fit=crop",
      title: "Serengeti Private Air Safari",
      location: "Serengeti National Park, Tanzania",
      tag: "Wilderness",
      size: "medium",
      desc: "Chartered bush flights landing at hyper-exclusive luxury tented camps with dedicated conservation rangers.",
    },
    {
      url: "/images/about/gallery-5.jpg",
      fallback:
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000&auto=format&fit=crop",
      title: "Overwater Coral Island Residence",
      location: "Baa Atoll, Maldives",
      tag: "Island Sanctuary",
      size: "small",
      desc: "Multi-bedroom glass-floored overwater estate featuring private observatory and dedicated marine biologist.",
    },
    {
      url: "/images/about/gallery-6.jpg",
      fallback:
        "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=1000&auto=format&fit=crop",
      title: "Icelandic Northern Lights Lodge",
      location: "Reykjavik Hinterlands, Iceland",
      tag: "Polar Odyssey",
      size: "small",
      desc: "Geothermal glass domes tucked deep into volcanic valleys designed specifically for private aurora viewing.",
    },
    {
      url: "/images/about/gallery-7.jpg",
      fallback:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop",
      title: "Swiss Alpine Panorama Retreat",
      location: "Zermatt, Switzerland",
      tag: "Mountain Escape",
      size: "small",
      desc: "A secluded luxury chalet overlooking snow-capped peaks, offering breathtaking sunrise views and world-class alpine experiences.",
    },
    {
      url: "/images/m1.jpg",
      fallback:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop",
      title: "Kyoto Bamboo Forest Hideaway",
      location: "Arashiyama, Kyoto, Japan",
      tag: "Cultural Journey",
      size: "small",
      desc: "An elegant retreat nestled beside Kyoto's iconic bamboo groves, blending traditional Japanese architecture with modern luxury.",
    },
  ],
  team: [
    {
      name: "Elena Rostova",
      role: "Founder & Managing Director",
      bio: "Former luxury hospitality executive with 20+ years orchestrating ultra-luxury travel for global leaders.",
      img: "/images/about/team-1.jpg",
      imgFallback:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500&auto=format&fit=crop",
    },
    {
      name: "Marcus Vance",
      role: "Travel Expert & Expedition Lead",
      bio: "Veteran wilderness guide and polar explorer who has personally led high-profile expeditions across 7 continents.",
      img: "/images/about/team-2.jpg",
      imgFallback:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop",
    },
    {
      name: "Sophia Chen",
      role: "Luxury Planner & Cultural Director",
      bio: "Art historian specializing in private heritage access across Japan, Bhutan, and Southeast Asia.",
      img: "/images/about/team-3.jpg",
      imgFallback:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop",
    },
    {
      name: "Julian Sterling",
      role: "Customer Success & Aviation Director",
      bio: "Former private aviation director coordinating global jet charters, guest relations, and mega-yacht buyouts.",
      img: "/images/about/team-4.jpg",
      imgFallback:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop",
    },
  ],
  sampleTours: [
    {
      title: "The Japanese Cultural Odyssey",
      duration: "12 Days / 11 Nights",
      destinations: "Tokyo, Kyoto, Hakone, Naoshima",
      highlights:
        "Private temple tea ceremony, bullet train suite, Michelin multi-course kaiseki, art island curator access",
      price: "$28,500 / person",
    },
    {
      title: "Swiss Alpine & Italian Lakes Reserve",
      duration: "10 Days / 9 Nights",
      destinations: "Zurich, Zermatt, Lake Como, St. Moritz",
      highlights:
        "Glacier Express private wagon, Villa d'Este suite, private Riva boat charter, helicopter heli-skiing",
      price: "$34,000 / person",
    },
    {
      title: "Serengeti & Seychelles Private Sanctuary",
      duration: "14 Days / 13 Nights",
      destinations: "Singita Serengeti, Private Island Seychelles",
      highlights:
        "Charter bush aircraft, game drives with master tracker, private island villa, dedicated wellness staff",
      price: "$42,000 / person",
    },
  ],
};

// Image component with fallback handling
const SafeImage = ({ src, fallbackSrc, alt, className, style }) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  return (
    <img
      src={imgSrc}
      alt={alt || "Luxe Travel"}
      className={className}
      style={style}
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
};

export default function About() {
  const [setScrolled] = useState(false);
  const navigate=useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

 

  return (
    <PageWrapper>
      <GlobalStyle />

      {/* HEADER / NAVIGATION */}

      {/* SECTION 1: HERO */}
      <HeroSection id="about">
        <Container>
          <HeroGrid>
            <HeroContent>
              <h1>
                Experience <br />
                <AuroraText>Beyond Destinations</AuroraText>
              </h1>
              <p>
                At Natours, we design custom journeys for the world’s most
                discerning travelers. Combining unmatched local access,
                ultra-luxury accommodations, and effortless private logistics
                into seamless lifelong memories.
              </p>
              <ButtonGroup>
                <PrimaryButton onClick={() => navigate("/tours")}>
                  Explore Tours <ArrowRight size={16} />
                </PrimaryButton>
                <SecondaryButton onClick={() => navigate("/search")}>
                  <Search size={16} /> Search
                </SecondaryButton>
              </ButtonGroup>
            </HeroContent>

            <HeroImageWrapper>
              <HeroMainImage>
                <SafeImage
                  src={IMAGES.hero}
                  fallbackSrc={IMAGES.heroFallback}
                  alt="Luxury Private Yacht and Ocean"
                />
                <HeroOverlay />
              </HeroMainImage>
            </HeroImageWrapper>
          </HeroGrid>
        </Container>
      </HeroSection>

      {/* SECTION 2: OUR STORY */}
      <Section id="story" $border={true}>
        <Container>
          <StoryGrid>
            <StoryImageWrapper>
              <SafeImage
                src={IMAGES.story}
                fallbackSrc={IMAGES.storyFallback}
                alt="Secluded Tropical Villa Beach"
              />
            </StoryImageWrapper>

            <StoryContent>
              <SectionTitle>
                <AuroraText>Our Journey</AuroraText>
              </SectionTitle>
              <p>
                Founded over a decade ago by a collective of former luxury hotel
                executives and veteran polar expedition leaders, Luxe
                Expeditions was born from a shared passion for uncharted
                exploration and effortless elegance.
              </p>
              <p>
                Our mission is to replace standardized, pre-packaged itineraries
                with deeply personalized, authentic experiences—granting
                privileged access to private sanctuaries, UNESCO heritage sites,
                and remote wilderness lodges across seven continents.
              </p>
              <p>
                Every journey is underpinned by our trusted global network of
                local hosts, uncompromising safety protocols, and ultra-luxury
                partners, guaranteeing total peace of mind and lifelong memories
                for every traveler.
              </p>

              <MiniFeatureGrid>
                <MiniFeatureCard>
                  <div className="icon-wrap">
                    <Compass size={18} />
                  </div>
                  <span>Personalized Tours</span>
                </MiniFeatureCard>
                <MiniFeatureCard>
                  <div className="icon-wrap">
                    <Hotel size={18} />
                  </div>
                  <span>Luxury Hotels</span>
                </MiniFeatureCard>
                <MiniFeatureCard>
                  <div className="icon-wrap">
                    <MapPin size={18} />
                  </div>
                  <span>Local Experiences</span>
                </MiniFeatureCard>
              </MiniFeatureGrid>
            </StoryContent>
          </StoryGrid>
        </Container>
      </Section>

      {/* SECTION 3: WHAT MAKES US DIFFERENT */}
      <Section id="values" $bg="#080808" $border={true}>
        <Container>
          <SectionHeader>
            <SectionTitle>
              Why <AuroraText>We Are Different</AuroraText>
            </SectionTitle>
            <SectionSubtitle>
              We combine deep local expertise with uncompromising luxury
              standards to create truly bespoke journeys.
            </SectionSubtitle>
          </SectionHeader>

          <ValuesGrid style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <ValueCard>
              <div className="icon-box">
                <Compass size={24} />
              </div>
              <h3>Luxury Planning</h3>
              <p>
                Bespoke itinerary design handcrafted by senior travel architects
                from a completely blank canvas for your individual preferences.
              </p>
            </ValueCard>

            <ValueCard>
              <div className="icon-box">
                <ShieldCheck size={24} />
              </div>
              <h3>Verified Partners</h3>
              <p>
                Direct relationships with double-inspected luxury hotels,
                private aviators, mega-yacht charters, and estate managers.
              </p>
            </ValueCard>

            <ValueCard>
              <div className="icon-box">
                <Users size={24} />
              </div>
              <h3>Expert Guides</h3>
              <p>
                Native historians, wildlife conservationists, and expedition
                leaders providing privileged access and deep cultural context.
              </p>
            </ValueCard>

            <ValueCard>
              <div className="icon-box">
                <Award size={24} />
              </div>
              <h3>Transparent Pricing</h3>
              <p>
                Clear, upfront luxury advisory rates with zero hidden markups,
                full financial protection, and preferred VIP perks included.
              </p>
            </ValueCard>

            <ValueCard>
              <div className="icon-box">
                <Clock size={24} />
              </div>
              <h3>24×7 Support</h3>
              <p>
                Dedicated Master Curator line available around the clock to
                handle seamless logistics, schedule tweaks, and instant
                assistance.
              </p>
            </ValueCard>

            <ValueCard>
              <div className="icon-box">
                <Sparkles size={24} />
              </div>
              <h3>Personalized Itineraries</h3>
              <p>
                Custom travel blueprints curated around your exact pace, dietary
                desires, family dynamics, and personal milestones.
              </p>
            </ValueCard>
          </ValuesGrid>
        </Container>
      </Section>

      {/* SECTION 4: EDITORIAL GALLERY */}
      <Section id="gallery" $border={true}>
        <Container>
          <SectionHeader>
            <SectionTitle>
              <AuroraText>Extraordinary </AuroraText> Moments
            </SectionTitle>
            <SectionSubtitle>
              Explore private sanctuaries, hidden villas, and remote natural
              wonders experienced by our esteemed travelers.
            </SectionSubtitle>
          </SectionHeader>

          <GalleryGrid>
            {IMAGES.gallery.map((item, idx) => (
              <GalleryItem key={idx} $size={item.size}>
                <SafeImage
                  src={item.url}
                  fallbackSrc={item.fallback}
                  alt={item.title}
                />
                <div className="gallery-overlay">
                  <span className="tag">
                    {item.tag} • {item.location}
                  </span>
                  <span className="title">{item.title}</span>
                </div>
              </GalleryItem>
            ))}
          </GalleryGrid>
        </Container>
      </Section>

      {/* SECTION 5: ACHIEVEMENTS */}
      <Section $bg="#080808" $border={true}>
        <Container>
          <StatsGrid>
            <StatCard>
              <div className="number">150+</div>
              <div className="label">Destinations</div>
            </StatCard>

            <StatCard>
              <div className="number">40+</div>
              <div className="label">Countries</div>
            </StatCard>

            <StatCard>
              <div className="number">20K+</div>
              <div className="label">Bookings</div>
            </StatCard>

            <StatCard>
              <div className="number">98%</div>
              <div className="label">Customer Satisfaction</div>
            </StatCard>
          </StatsGrid>
        </Container>
      </Section>

      {/* SECTION 6: WHY TRAVELERS TRUST US */}
      <Section id="trust" $border={true}>
        <Container>
          <TrustGrid>
            <TrustContent>
              <h2 className="trust-heading">
                Why Travelers <AuroraText>Trust Us</AuroraText>
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.72)",
                  fontSize: "1.5rem",
                  lineHeight: "1.8",
                  fontWeight: "300",
                }}
              >
                We eliminate every friction point between inspiration and
                arrival. From diplomatic tarmac transfers to private island
                buyouts, our global infrastructure guarantees perfection.
              </p>

              <ChecklistGrid>
                <ChecklistItem>
                  <div className="check-icon">
                    <Check size={14} />
                  </div>
                  <span>Secure Booking</span>
                </ChecklistItem>
                <ChecklistItem>
                  <div className="check-icon">
                    <Check size={14} />
                  </div>
                  <span>Verified Hotels</span>
                </ChecklistItem>
                <ChecklistItem>
                  <div className="check-icon">
                    <Check size={14} />
                  </div>
                  <span>Experienced Team</span>
                </ChecklistItem>
                <ChecklistItem>
                  <div className="check-icon">
                    <Check size={14} />
                  </div>
                  <span>24×7 Assistance</span>
                </ChecklistItem>
                <ChecklistItem>
                  <div className="check-icon">
                    <Check size={14} />
                  </div>
                  <span>Luxury Partners</span>
                </ChecklistItem>
                <ChecklistItem>
                  <div className="check-icon">
                    <Check size={14} />
                  </div>
                  <span>Transparent Pricing</span>
                </ChecklistItem>
                <ChecklistItem>
                  <div className="check-icon">
                    <Check size={14} />
                  </div>
                  <span>Flexible Packages</span>
                </ChecklistItem>
                <ChecklistItem>
                  <div className="check-icon">
                    <Check size={14} />
                  </div>
                  <span>Premium Support</span>
                </ChecklistItem>
              </ChecklistGrid>
            </TrustContent>

            <TrustImageWrapper>
              <SafeImage
                src={IMAGES.trust}
                fallbackSrc={IMAGES.trustFallback}
                alt="Luxury Resort Horizon Pool"
              />
            </TrustImageWrapper>
          </TrustGrid>
        </Container>
      </Section>

      {/* SECTION 7: TIMELINE */}
      <Section id="journey" $bg="#080808" $border={true}>
        <Container>
          <SectionHeader>
            <SectionTitle>
              Journey of<AuroraText> Natours </AuroraText>
            </SectionTitle>
            <SectionSubtitle>
              A decade of growth, defining luxury access and bespoke expedition
              standards worldwide.
            </SectionSubtitle>
          </SectionHeader>

          <Timeline>
            <TimelineItem $isEven={false}>
              <TimelineDot />
              <TimelineContent>
                <div className="year">2014</div>
                <div className="title">Company Founded</div>
                <div className="description">
                  Established in Zurich to deliver private, bespoke travel
                  advisory services for high-net-worth European travelers.
                </div>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem $isEven={true}>
              <TimelineDot />
              <TimelineContent>
                <div className="year">2016</div>
                <div className="title">International Expansion</div>
                <div className="description">
                  Expanded global operations into North America and
                  Asia-Pacific, establishing dedicated concierge hubs in London
                  and New York.
                </div>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem $isEven={false}>
              <TimelineDot />
              <TimelineContent>
                <div className="year">2018</div>
                <div className="title">10,000 Travelers</div>
                <div className="description">
                  Reached a milestone of serving over 10,000 discerning guests
                  across private aviation, yacht charters, and remote retreats.
                </div>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem $isEven={true}>
              <TimelineDot />
              <TimelineContent>
                <div className="year">2021</div>
                <div className="title">Luxury Collection</div>
                <div className="description">
                  Launched the Ultra-Private Reserve collection, featuring
                  off-market villa buyouts and conservation air safaris.
                </div>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem $isEven={false}>
              <TimelineDot />
              <TimelineContent>
                <div className="year">2024</div>
                <div className="title">Global Experiences</div>
                <div className="description">
                  Recognized internationally for setting new industry benchmarks
                  in private access, service excellence, and guest discretion
                  across 40+ countries.
                </div>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </Container>
      </Section>

      <Section $bg="#080808" $border={true}>
        <Container>
          <SectionHeader>
            <SectionTitle>
              We Don't Just Plan Trips.{" "}<br />
              <AuroraText>We Create Stories Worth Remembering.</AuroraText>
            </SectionTitle>
            <SectionSubtitle>
              We back every single journey with concrete operational guarantees
              for your absolute peace of mind.
            </SectionSubtitle>
          </SectionHeader>

          <PromiseGrid>
            <PromiseCard>
              <div className="icon-wrap">
                <Hotel size={24} />
              </div>
              <h4>Luxury Hotels</h4>
              <p>
                Hand-selected, double-inspected five-star sanctuaries and
                private estates with preferred suite upgrades.
              </p>
            </PromiseCard>

            <PromiseCard>
              <div className="icon-wrap">
                <Star size={24} />
              </div>
              <h4>Best Value</h4>
              <p>
                Unmatched insider rates, complimentary resort credits, and
                preferred VIP amenities with complete price transparency.
              </p>
            </PromiseCard>

            <PromiseCard>
              <div className="icon-wrap">
                <ShieldCheck size={24} />
              </div>
              <h4>Safe Journeys</h4>
              <p>
                Comprehensive 24/7 emergency protocols, vetted local logistics,
                and full diplomatic airside support.
              </p>
            </PromiseCard>

            <PromiseCard>
              <div className="icon-wrap">
                <Clock size={24} />
              </div>
              <h4>Lifetime Support</h4>
              <p>
                Your dedicated Master Curator remains on call before, during,
                and long after your journey concludes.
              </p>
            </PromiseCard>
          </PromiseGrid>
        </Container>
      </Section>

      {/* SECTION 10: FINAL CTA */}
      <Container>
        <CTASection>
          <SafeImage
            className="cta-bg"
            src={IMAGES.cta}
            fallbackSrc={IMAGES.ctaFallback}
            alt="Luxury Sunset Mountain Landscape"
          />
          <CTAOverlay />
          <CTAContent>
            <h2>Ready To Experience The World Differently?</h2>
            <p>
              Connect directly with a Master Travel Curator to design your
              custom itinerary or request access to our private destination
              portfolio.
            </p>
            <ButtonGroup style={{ justifyContent: "center" }}>
              <PrimaryButton onClick={() => Navigate("/tours")}>
                Explore Tours <ArrowRight size={16} />
              </PrimaryButton>
            </ButtonGroup>
          </CTAContent>
        </CTASection>
      </Container>
    </PageWrapper>
  );
}
