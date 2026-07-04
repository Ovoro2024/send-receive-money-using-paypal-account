import type { Coin } from "@/auth/useCrypto";

export function CoinIcon({ coin, size = 40 }: { coin: Coin; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold shrink-0"
      style={{ background: coin.color, width: size, height: size, fontSize: size * 0.5 }}
      aria-hidden
    >
      {coin.glyph}
    </div>
  );
}

export function Sparkline({ color, up }: { color: string; up: boolean }) {
  const path = up
    ? "M0 20 L10 18 L20 15 L30 16 L40 10 L50 12 L60 6 L70 8 L80 4"
    : "M0 4 L10 6 L20 3 L30 10 L40 8 L50 14 L60 12 L70 18 L80 20";
  return (
    <svg viewBox="0 0 80 24" className="w-20 h-6" fill="none">
      <path d={path} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
