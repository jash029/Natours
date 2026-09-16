// ImageCard.jsx

import { Card, Content, Heading, ExploreButton } from "./ImageCard.styles";
import { LuArrowUpRight } from "react-icons/lu";
import { Link } from "react-router-dom";

function ImageCard() {
  return (
    <Card>
      <Content>
        <Heading>
          Experience Beyond
          <br />
          Boundaries
        </Heading>

        <ExploreButton as={Link} to="/tours">
          Explore Tours
          <LuArrowUpRight />
        </ExploreButton>
      </Content>
    </Card>
  );
}

export default ImageCard;
