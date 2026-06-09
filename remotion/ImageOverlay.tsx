import { Img, AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface Props {
  src: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  opacity?: number;
  animation?: "none" | "fadeIn" | "slideUp" | "zoomIn" | "bounce";
  durationFrames?: number;
}

export const ImageOverlay: React.FC<Props> = ({
  src,
  x = 50,
  y = 50,
  width = 80,
  height,
  opacity = 100,
  animation = "none",
  durationFrames = 30,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(frame / 15, 1);

  let animStyle: React.CSSProperties = {};
  if (animation === "fadeIn") {
    animStyle = { opacity: interpolate(frame, [0, 15], [0, 1]) };
  } else if (animation === "slideUp") {
    animStyle = {
      opacity: interpolate(frame, [0, 15], [0, 1]),
      transform: `translate(-50%, -50%) translateY(${interpolate(frame, [0, 20], [40, 0])}px)`,
    };
  } else if (animation === "zoomIn") {
    animStyle = {
      opacity: interpolate(frame, [0, 15], [0, 1]),
      transform: `translate(-50%, -50%) scale(${interpolate(frame, [0, 20], [0.8, 1])})`,
    };
  } else if (animation === "bounce") {
    const bounce = Math.sin(frame * 0.15) * 5;
    animStyle = { transform: `translate(-50%, -50%) translateY(${bounce}px)` };
  }

  return (
    <AbsoluteFill>
      <Img
        src={src}
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: `${width}%`,
          height: height ? `${height}%` : "auto",
          opacity: opacity / 100,
          objectFit: "cover",
          borderRadius: 4,
          ...animStyle,
        }}
      />
    </AbsoluteFill>
  );
};
