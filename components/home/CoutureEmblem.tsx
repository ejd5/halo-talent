// CoutureEmblem — Original fleur de lys emblem, inline SVG.
// Gold/champagne, subtle, no external assets.
export function CoutureEmblem({
  size = 24,
  color = "var(--or)",
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size * 1.36}
      viewBox="0 0 22 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Center petal */}
      <path
        d="M11 0C11 4 9.5 8 8 11C6 15 3 19 0 22C0 22 3 24 6 24C8 24 10 22 11 20C12 22 14 24 16 24C19 24 22 22 22 22C19 19 16 15 14 11C12.5 8 11 4 11 0Z"
        fill={color}
        opacity="0.9"
      />
      {/* Left petal */}
      <path
        d="M11 8C9 10 5 14 2 18C2 18 4 19 6 19C7.5 19 9.5 17 11 15C12.5 17 14.5 19 16 19C18 19 20 18 20 18C17 14 13 10 11 8Z"
        fill={color}
        opacity="0.6"
      />
      {/* Base band */}
      <path
        d="M7 24C8 25 9.5 27 11 30C12.5 27 14 25 15 24"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        opacity="0.7"
      />
      {/* Center band */}
      <rect
        x="9.5"
        y="20"
        width="3"
        height="6"
        rx="0.5"
        fill={color}
        opacity="0.5"
      />
    </svg>
  );
}
