import { useEffect, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

export default function Marquee({
  data = [],
  renderItem,
  vertical = false,
  reverse = false,
  duration = 28,
  pause = false,
  className = "",
}) {
  const items = [...data, ...data];

  const axis = useMotionValue(0);
  const animationRef = useRef(null);

  useEffect(() => {
    if (items.length === 0) return;

    if (pause) {
      animationRef.current?.pause();
      return;
    }

    animationRef.current?.play();

    if (!animationRef.current) {
      animationRef.current = animate(
        axis,
        reverse ? ["-50%", "0%"] : ["0%", "-50%"],
        {
          ease: "linear",
          duration,
          repeat: Infinity,
          repeatType: "loop",
        },
      );
    }

    return () => {
      animationRef.current?.stop();
      animationRef.current = null;
    };
  }, [pause, reverse, duration, items.length, axis]);

  return (
    <div
      className={className}
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
    >
      <motion.div
        style={{
          display: "flex",
          flexDirection: vertical ? "column" : "row",
          gap: "1.5rem",
          x: vertical ? undefined : axis,
          y: vertical ? axis : undefined,
          willChange: "transform",
        }}
      >
        {items.map((item, index) => (
          <div key={`${item._id}-${index}`}>{renderItem(item)}</div>
        ))}
      </motion.div>
    </div>
  );
}
