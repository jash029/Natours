import { useState, useCallback, useMemo } from "react";

import {
  GridMotionCard,
  GridViewport,
  ParallaxContainer,
  GridRow,
  GridTile,
} from "./GridMotionGallery.styles";

function GridMotionGallery({ images = [] }) {
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  // Mouse parallax handler for interactive 3D depth effect
  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);

    setParallaxOffset({
      x: mouseX * 25,
      y: mouseY * 12,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setParallaxOffset({ x: 0, y: 0 });
  }, []);

  // Single row of images duplicated for continuous marquee scrolling
  const singleRow = useMemo(() => {
    if (!Array.isArray(images) || images.length === 0) return [];

    let row = [...images];
    while (row.length < 12) {
      row = [...row, ...images];
    }
    return [...row, ...row];
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <GridMotionCard>
      <GridViewport
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <ParallaxContainer
          style={{
            transform: `translate3d(${parallaxOffset.x}px, calc(-50% + ${parallaxOffset.y}px), 0)`,
          }}
        >
          {/* SINGLE CONTINUOUS ROW OF CARD-SIZE IMAGES */}
          <GridRow className="row-left" $duration={35}>
            {singleRow.map((imgUrl, idx) => (
              <GridTile key={idx}>
                <img
                  src={imgUrl}
                  alt={`Tour gallery card photo ${idx + 1}`}
                  loading="lazy"
                />
              </GridTile>
            ))}
          </GridRow>
        </ParallaxContainer>
      </GridViewport>
    </GridMotionCard>
  );
}

export default GridMotionGallery;
