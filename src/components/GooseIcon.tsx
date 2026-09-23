import { GREEN, ORANGE, PURPLE } from "../game/levels";

interface GooseIconProps {
  color: string;
  className?: string;
}

const GOOSE_ASSET: Record<string, string> = {
  [ORANGE.toLowerCase()]: "/goose-orange.svg",
  [GREEN.toLowerCase()]: "/goose-green.svg",
  [PURPLE.toLowerCase()]: "/goose-purple.svg",
};

export function GooseIcon({ color, className }: GooseIconProps) {
  const asset = GOOSE_ASSET[color.toLowerCase()];

  if (asset) {
    return <img src={asset} alt="" className={className} />;
  }

  // Fallback for any color outside the known palette (shouldn't happen in
  // practice — every level uses ORANGE/GREEN/PURPLE — but keeps rendering
  // robust rather than blank if one ever slips through).
  return (
    <svg viewBox="0 0 120 100" className={className} style={{ color }} aria-hidden="true">
      <ellipse cx="52" cy="72" rx="34" ry="23" fill="currentColor" />
      <path
        d="M50 55 C 44 35, 48 15, 72 10 C 64 18, 62 28, 68 34 C 56 30, 48 40, 50 55 Z"
        fill="currentColor"
      />
      <circle cx="80" cy="20" r="11" fill="currentColor" />
      <path d="M89 17 L106 21 L89 26 Z" fill="#f2a900" />
      <circle cx="82" cy="17" r="1.8" fill="#1a1a1a" />
    </svg>
  );
}
