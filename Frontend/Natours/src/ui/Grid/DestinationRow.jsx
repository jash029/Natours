import { useState } from "react";

import Marquee from "../../components/Marquee/Marquee";

import { Row, RowInner } from "./DestinationRow.styles";

import DestinationCard from "./DestinationCard";

export default function DestinationRow({
  data,
  duration = 28,
  reverse = false,
}) {
  const [paused, setPaused] = useState(false);

  return (
    <Row
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <RowInner>
        <Marquee
          duration={duration}
          reverse={reverse}
          pause={paused}
          data={data}
          renderItem={(tour) => (
            <DestinationCard tour={tour} />
          )}
        />
      </RowInner>
    </Row>
  );
}
