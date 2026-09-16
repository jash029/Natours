import {
  TimelineWrapper,
  TimelineItem,
  TimelineNumber,
  TimelineDot,
  TimelineLine,
} from "./Timeline.style";

function Timeline({ totalSlides, activeIndex, onSelect }) {
  return (
    <TimelineWrapper>
      {Array.from({ length: totalSlides }).map((_, index) => (
        <TimelineItem key={index} onClick={() => onSelect(index)}>
          <TimelineNumber $active={index === activeIndex}>
            {String(index + 1).padStart(2, "0")}
          </TimelineNumber>

          <TimelineDot $active={index <= activeIndex} />

          {index !== totalSlides - 1 && (
            <TimelineLine $active={index < activeIndex} />
          )}
        </TimelineItem>
      ))}
    </TimelineWrapper>
  );
}

export default Timeline;
