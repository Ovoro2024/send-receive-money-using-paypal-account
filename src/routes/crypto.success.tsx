import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { findCoin, formatUsd } from "@/auth/useCrypto";

type Search = { symbol: string; units: string; usd: string; side: "buy" | "sell" };

export const Route = createFileRoute("/crypto/success")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    symbol: String(s.symbol ?? "BTC"),
    units: String(s.units ?? "0"),
    usd: String(s.usd ?? "0"),
    side: s.side === "sell" ? "sell" : "buy",
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { symbol, units, usd, side } = Route.useSearch();
  const coin = findCoin(symbol);
  const unitsNum = Number.parseFloat(units) || 0;
  const usdNum = Number.parseFloat(usd) || 0;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--pp-bg)] items-center justify-center px-6">
      <div className="h-20 w-20 rounded-full bg-[var(--pp-success)] flex items-center justify-center">
        <Check size={44} className="text-white" strokeWidth={3} />
      </div>
      <h1 className="mt-6 text-[26px] font-semibold text-[var(--pp-text)] text-center">
        {side === "buy" ? "Purchase complete" : "Sell complete"}
      </h1>
      <p className="mt-3 text-center text-[15px] text-[var(--pp-text-muted)]">
        {side === "buy" ? "You bought " : "You sold "}
        <span className="font-semibold text-[var(--pp-text)]">
          {unitsNum.toFixed(coin && (coin.symbol === "BTC" || coin.symbol === "ETH") ? 8 : 4)} {symbol}
        </span>
        {" "}for {formatUsd(usdNum)}.
      </p>

      <Link
        to="/crypto/$symbol"
        params={{ symbol }}
        className="mt-10 w-full max-w-xs rounded-full bg-[var(--pp-blue-dark)] py-4 text-white text-[16px] font-bold text-center"
      >
        View {symbol}
      </Link>
      <Link to="/crypto" className="mt-3 text-[14px] font-semibold text-[var(--pp-link)]">
        Back to Crypto
      </Link>
    </div>
  );
}
