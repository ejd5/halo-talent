import { AbsoluteFill } from "remotion";

interface Props {
  text: string;
  x?: number;
  y?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  textAlign?: "left" | "center" | "right";
  opacity?: number;
}

export const TextOverlay: React.FC<Props> = ({
  text,
  x = 50,
  y = 50,
  fontSize = 40,
  fontFamily = "sans-serif",
  fontWeight = "bold",
  color = "#FFFFFF",
  textAlign = "center",
  opacity = 100,
}) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          transform: "translate(-50%, -50%)",
          fontSize,
          fontFamily,
          fontWeight,
          color,
          textAlign,
          opacity: opacity / 100,
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          padding: "8px 16px",
          maxWidth: "80%",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
