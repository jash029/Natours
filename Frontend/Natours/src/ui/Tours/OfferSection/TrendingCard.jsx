import { motion } from "framer-motion";

import {
  Card,
  ImageWrapper,
  Image,
  Badge,
  Content,
  TopRow,
  Rating,
  Title,
  Meta,
  PriceSection,
  CurrentPrice,
  OriginalPrice,
  Discount,
  Footer,
  ViewDetails,
} from "./TrendingCard.styles";

import { useNavigate } from "react-router-dom";
import { getOptimizedImageUrl } from "../../../utils/imageUtils";
import useCurrencyDetector from "../../../Services/useCurrencyDetector";
function TrendingCard({ tour, index, category }) {
  const navigate = useNavigate();
  const { formatCurrency } = useCurrencyDetector();
  const {
    slug,
    _id,
    id,
    name,
    imageCover,
    duration,
    destinations,
    ratingsAverage,
    ratingsQuantity,
    startingPrice,
    discount,
  } = tour;

  const slugOrId = slug || _id || id;

  function handleClick() {
    if (slugOrId) {
      navigate(`/tour/${slugOrId}`);
    }
  }

  const imageUrl = getOptimizedImageUrl(imageCover);

  // Discount is an amount, not a percentage
  const discountedPrice = Math.max(startingPrice - discount, 0);

  const discountPercentage =
    startingPrice > 0 ? Math.round((discount / startingPrice) * 100) : 0;

  const location =
    destinations?.map((destination) => destination.country).join(", ") ||
    "Worldwide";

  return (
    <Card
      onClick={handleClick}
      as={motion.article}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      $category={category}
    >
      <ImageWrapper>
        <Image
          src={imageUrl}
          alt={imageCover?.alt || name}
          loading="lazy"
          decoding="async"
        />

        <Badge>{category}</Badge>
      </ImageWrapper>

      <Content>
        <TopRow>
          <Rating>
            ★ {ratingsAverage.toFixed(1)} ({ratingsQuantity})
          </Rating>
        </TopRow>

        <Title>{name}</Title>

        <Meta>
          {location.split(',')[0]} • {duration.days} Days / {duration.nights} Nights
        </Meta>

        <PriceSection>
          <CurrentPrice>
            From {formatCurrency(discountedPrice)}
          </CurrentPrice>

          <Footer>
            {discount > 0 ? (
              <>
                <OriginalPrice>
                  {formatCurrency(startingPrice)}
                </OriginalPrice>

                <Discount>{discountPercentage}% OFF</Discount>
              </>
            ) : (
              <OriginalPrice>&nbsp;</OriginalPrice>
            )}
          </Footer>
        </PriceSection>

        <ViewDetails>View Details →</ViewDetails>
      </Content>
    </Card>
  );
}

export default TrendingCard;
