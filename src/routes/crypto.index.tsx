import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Search, Info, ChevronRight } from "lucide-react";
import { BottomNav } from "@/components/paypal/BottomNav";
import { CoinIcon, Sparkline } from "@/components/paypal/CoinIcon";
import { COINS, formatUsd, useCryptoHoldings } from "@/auth/useCrypto";

export const Route = createFileRoute("/crypto/")({
  component: CryptoHome,
});

function CryptoHome() {
  const { holdings, totalValue } = useCryptoHoldings();
  const navigate = useNavigate();
  const owned = COINS.filter((c) => (holdings[c.symbol] ?? 0) > 0);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--pp-bg)]">
      <header className="flex items-center justify-between px-5 pt-6 pb-3">
        <Link to="/" className="text-[var(--pp-text)]">
          <ArrowLeft size={24} strokeWidth={2.25} />
        </Link>
        <h1 className="text-[17px] font-semibold text-[var(--pp-text)]">Crypto</h1>
        <button aria-label="Search" className="text-[var(--pp-text)]">
          <Search size={22} />
        </button>
      </header>

      <main className="flex-1 px-5 pb-6">
        {/* Portfolio */}
        <section className="mt-4">
          <p className="text-[14px] text-[var(--pp-text-muted)]">Your crypto</p>
          <p className="mt-1 text-[40px] font-semibold leading-none text-[var(--pp-text)]">
            {formatUsd(totalValue)}
          </p>
          <p className="mt-2 text-[13px] text-[var(--pp-text-muted)] flex items-center gap-1">
            All-time <Info size={13} />
          </p>
        </section>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate({ to: "/crypto/buy/$symbol", params: { symbol: "BTC" } })}
            className="rounded-full bg-[var(--pp-blue-dark)] py-3.5 text-white text-[16px] font-bold"
          >
            Buy
          </button>
          <button
            disabled={owned.length === 0}
            onClick={() => owned[0] && navigate({ to: "/crypto/sell/$symbol", params: { symbol: owned[0].symbol } })}
            className="rounded-full bg-white border border-[color:var(--border)] py-3.5 text-[var(--pp-blue-dark)] text-[16px] font-bold disabled:opacity-50"
          >
            Sell
          </button>
        </div>

        {/* Your assets */}
        {owned.length > 0 && (
          <>
            <h2 className="mt-8 text-[15px] font-semibold text-[var(--pp-text)]">Your assets</h2>
            <div className="mt-3 rounded-2xl bg-white border border-[color:var(--border)] divide-y divide-[color:var(--border)]">
              {owned.map((c) => {
                const units = holdings[c.symbol] ?? 0;
                const val = units * c.price;
                return (
                  <Link
                    key={c.symbol}
                    to="/crypto/$symbol"
                    params={{ symbol: c.symbol }}
                    className="flex items-center gap-3 px-4 py-3.5"
                  >
                    <CoinIcon coin={c} size={38} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-[var(--pp-text)]">{c.name}</p>
                      <p className="text-[12px] text-[var(--pp-text-muted)]">
                        {units.toFixed(c.symbol === "BTC" || c.symbol === "ETH" ? 6 : 3)} {c.symbol}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[15px] font-semibold text-[var(--pp-text)]">{formatUsd(val)}</p>
                      <p
                        className="text-[12px] font-medium"
                        style={{ color: c.change24h >= 0 ? "var(--pp-success)" : "var(--pp-mc-red)" }}
                      >
                        {c.change24h >= 0 ? "+" : ""}
                        {c.change24h.toFixed(2)}%
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* Market */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-[var(--pp-text)]">Trending</h2>
          <span className="text-[12px] text-[var(--pp-text-muted)]">24h</span>
        </div>
        <div className="mt-3 rounded-2xl bg-white border border-[color:var(--border)] divide-y divide-[color:var(--border)]">
          {COINS.map((c) => (
            <Link
              key={c.symbol}
              to="/crypto/$symbol"
              params={{ symbol: c.symbol }}
              className="flex items-center gap-3 px-4 py-3.5"
            >
              <CoinIcon coin={c} size={38} />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[var(--pp-text)]">{c.name}</p>
                <p className="text-[12px] text-[var(--pp-text-muted)]">{c.symbol}</p>
              </div>
              <Sparkline color={c.change24h >= 0 ? "var(--pp-success)" : "var(--pp-mc-red)"} up={c.change24h >= 0} />
              <div className="text-right w-24">
                <p className="text-[14px] font-semibold text-[var(--pp-text)]">
                  {formatUsd(c.price, c.price < 1 ? 4 : 2, c.price < 1 ? 4 : 2)}
                </p>
                <p
                  className="text-[12px] font-medium"
                  style={{ color: c.change24h >= 0 ? "var(--pp-success)" : "var(--pp-mc-red)" }}
                >
                  {c.change24h >= 0 ? "+" : ""}
                  {c.change24h.toFixed(2)}%
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-white border border-[color:var(--border)] p-4 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-[var(--pp-text)]">Learn about crypto</p>
            <p className="text-[13px] text-[var(--pp-text-muted)] mt-0.5">
              Understand how buying, selling and transferring work.
            </p>
          </div>
          <ChevronRight size={20} className="text-[var(--pp-text-muted)]" />
        </div>

        <p className="mt-6 text-[11px] leading-snug text-[var(--pp-text-muted)]">
          Cryptocurrency is highly volatile, unregulated in some jurisdictions and involves the risk of
          loss. Prices update every few minutes and may not reflect the exact market rate.
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
