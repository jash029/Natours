import DestinationCarousel from "../ui/Tours/HeroSectionTours/DestinationCarousel"
import { styled } from "styled-components";
import Offer from "../ui/Tours/OfferSection/Offers";
// import MapTours from "../ui/Tours/MapTours/MapTours";
const HeroSection = styled.div`
position: relative;
top:0rem;
width: 100%;
margin: 0 auto;
padding-bottom: 10rem;
background-color: #04070efb;
`;
function Tours() {
    return (
      <>
        <HeroSection>
          <DestinationCarousel />
        </HeroSection>
        <Offer />  
      
      </>
    );
}

export default Tours
