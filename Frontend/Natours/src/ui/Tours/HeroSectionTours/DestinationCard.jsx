import {
  Card,
  CardImage,
  CardOverlay,
  CardContent,
  Country,
  Title,
} from "./DestinationCard.styles";

import { getOptimizedImageUrl } from "../../../utils/imageUtils";
import { useNavigate } from "react-router-dom";
function DestinationCard({ destination }) {
  const navigate = useNavigate();
  const { imageCover, image, title, country } = destination;
  const cardImg = getOptimizedImageUrl(imageCover || image);

  return (
    <Card onClick={() => navigate(`/tour/${destination.slug}`)}>
      <CardImage src={cardImg} alt={title} loading="lazy" />

      <CardOverlay />

      <CardContent>
        <Country>{country}</Country>

        <Title>{title}</Title>
      </CardContent>
    </Card>
  );
}

export default DestinationCard;
