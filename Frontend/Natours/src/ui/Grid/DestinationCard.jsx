import {
  Card,
  ImageWrapper,
  Image,
  Gradient,
  Content,
  Destination,
  HoverContent,
  Location,
  ExploreButton,
} from "./DestinationCard.styles";
import { useNavigate } from "react-router-dom";
import { getOptimizedImageUrl } from "../../utils/imageUtils";

function DestinationCard({ tour: { slug, _id, id, imageCover, name, destinations } }) {
  const navigate = useNavigate();

  const slugOrId = slug || _id || id;

  function handleClick() {
    if (slugOrId) {
      navigate(`/tour/${slugOrId}`);
    }
  }
  
  const nameTour = name.split(" ").slice(0, 2).join(" ");
  const imageUrl = getOptimizedImageUrl(imageCover);

  return (
    <Card onClick={handleClick}>
      <ImageWrapper>
        <Image src={imageUrl} alt={name} loading="lazy" />
      </ImageWrapper>

      <Gradient />

      <Content>
        <Destination>{nameTour}</Destination>

        <HoverContent>
          <Location>{destinations[0].country}</Location>

          <ExploreButton type="button">Explore →</ExploreButton>
        </HoverContent>
      </Content>
    </Card>
  );
}

export default DestinationCard;
