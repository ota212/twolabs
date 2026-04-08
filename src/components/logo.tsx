export function Logo({ variant = "light", height = 32 }: { variant?: "light" | "dark"; height?: number }) {
  const fill = variant === "light" ? "#FFFFFF" : "#1A3A5C";
  const viewWidth = 400;
  const viewHeight = 120;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      height={height}
      fill="none"
      aria-label="Dois Labs"
    >
      <g transform="translate(10, 8)">
        <path d="M 18,52 A 34,34 0 1,1 68,18 L 57,18 A 22,22 0 1,0 18,44 Z" fill={fill} />
        <polygon points="63,24 76,24 52,58 39,58" fill={fill} />
        <polygon points="44,68 57,68 33,98 20,98" fill={fill} />
        <rect x="16" y="94" width="72" height="13" rx="1" fill={fill} />
      </g>
      <text x="115" y="82" fontFamily="'DM Sans',Arial,sans-serif" fontWeight="700" fontSize="52" letterSpacing="-1" fill={fill}>
        DOIS
      </text>
      <text x="280" y="82" fontFamily="'DM Sans',Arial,sans-serif" fontWeight="400" fontSize="52" fill={fill}>
        Labs
      </text>
    </svg>
  );
}

export function LogoIcon({ variant = "light", size = 32 }: { variant?: "light" | "dark"; size?: number }) {
  const fill = variant === "light" ? "#FFFFFF" : "#1A3A5C";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 110"
      height={size}
      fill="none"
      aria-label="Dois Labs"
    >
      <path d="M 18,52 A 34,34 0 1,1 68,18 L 57,18 A 22,22 0 1,0 18,44 Z" fill={fill} />
      <polygon points="63,24 76,24 52,58 39,58" fill={fill} />
      <polygon points="44,68 57,68 33,98 20,98" fill={fill} />
      <rect x="16" y="94" width="72" height="13" rx="1" fill={fill} />
    </svg>
  );
}
