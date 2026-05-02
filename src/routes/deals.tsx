import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Bookmark, ChevronRight, Tag, Sparkles } from "lucide-react";
import { BottomNav } from "@/components/paypal/BottomNav";
import { RequireAuth } from "@/auth/RequireAuth";

export const Route = createFileRoute("/deals")({
  component: () => (
    <RequireAuth>
      <DealsPage />
    </RequireAuth>
  ),
  head: () => ({
    meta: [
      { title: "Deals — PayPal" },
      { name: "description", content: "Cashback offers and deals from your favorite brands on PayPal." },
    ],
  }),
});

type Deal = {
  id: string;
  brand: string;
  cashback: string;
  tag?: string;
  expires: string;
  color: string;
  initial: string;
  saved?: boolean;
};

const FEATURED: Deal[] = [
  { id: "f1", brand: "Walmart", cashback: "5% cash back", tag: "Online only", expires: "Expires Jun 30", color: "oklch(0.55 0.18 250)", initial: "W" },
  { id: "f2", brand: "Best Buy", cashback: "8% cash back", tag: "Limited time", expires: "Expires May 18", color: "oklch(0.7 0.18 70)", initial: "B" },
  { id: "f3", brand: "Nike", cashback: "10% cash back", tag: "New", expires: "Expires Jul 04", color: "oklch(0.25 0.02 260)", initial: "N" },
];

const TILES: Deal[] = [
  { id: "1", brand: "Target", cashback: "4%", expires: "Expires May 22", color: "oklch(0.65 0.22 27)", initial: "T" },
  { id: "2", brand: "Uber Eats", cashback: "6%", expires: "Expires May 30", color: "oklch(0.55 0.16 145)", initial: "U" },
  { id: "3", brand: "Sephora", cashback: "5%", expires: "Expires Jun 02", color: "oklch(0.2 0.01 260)", initial: "S" },
  { id: "4", brand: "DoorDash", cashback: "7%", expires: "Expires Jun 12", color: "oklch(0.65 0.22 27)", initial: "D" },
  { id: "5", brand: "Adidas", cashback: "10%", expires: "Expires Jun 20", color: "oklch(0.25 0.02 260)", initial: "A" },
  { id: "6", brand: "Lululemon", cashback: "5%", expires: "Expires Jul 01", color: "oklch(0.55 0.18 260)", initial: "L" },
];

function DealsPage() {
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) =>
    setSaved((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--pp-bg)]">
      <main className="flex-1 px-5 pt-10 pb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[34px] font-bold leading-tight text-[var(--pp-text)]">Deals</h1>
          <button
            aria-label="Saved deals"
            className="h-10 w-10 rounded-full bg-[var(--pp-card)] border border-[color:var(--border)] flex items-center justify-center"
          >
            <Bookmark className="h-5 w-5 text-[var(--pp-text)]" />
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 flex items-center gap-2 rounded-full bg-white border border-[color:var(--border)] px-4 h-11">
          <Search className="h-4 w-4 text-[var(--pp-text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brands"
            className="flex-1 bg-transparent outline-none text-[15px] text-[var(--pp-text)] placeholder:text-[var(--pp-text-muted)]"
          />
        </div>

        {/* Yellow hero */}
        <div
          className="mt-5 rounded-3xl p-5 relative overflow-hidden"
          style={{ background: "var(--pp-yellow)" }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" style={{ color: "var(--pp-blue-dark)" }} />
            <span className="text-[12px] font-bold uppercase tracking-wide" style={{ color: "var(--pp-blue-dark)" }}>
              Featured for you
            </span>
          </div>
          <h2 className="mt-2 text-[22px] font-bold leading-snug" style={{ color: "var(--pp-blue-dark)" }}>
            Earn up to 10% cash back at top brands.
          </h2>
          <p className="mt-1 text-[13px]" style={{ color: "var(--pp-blue-dark)", opacity: 0.85 }}>
            Activate offers and pay with PayPal to earn.
          </p>
          <button
            className="mt-4 inline-flex items-center gap-1 px-4 h-9 rounded-full text-[13px] font-semibold"
            style={{ background: "var(--pp-blue-dark)", color: "white" }}
          >
            See all offers <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Featured carousel */}
        <div className="mt-5 -mx-5 px-5 overflow-x-auto no-scrollbar">
          <div className="flex gap-3">
            {FEATURED.map((d) => (
              <div
                key={d.id}
                className="min-w-[220px] rounded-2xl bg-[var(--pp-card)] border border-[color:var(--border)] p-4 flex-shrink-0"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="h-11 w-11 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: d.color }}
                  >
                    {d.initial}
                  </div>
                  <button
                    onClick={() => toggleSave(d.id)}
                    aria-label={saved.has(d.id) ? "Remove" : "Save"}
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                  >
                    <Bookmark
                      className="h-5 w-5"
                      style={{
                        color: saved.has(d.id) ? "var(--pp-blue)" : "var(--pp-text-muted)",
                        fill: saved.has(d.id) ? "var(--pp-blue)" : "none",
                      }}
                    />
                  </button>
                </div>
                <div className="mt-3 text-[15px] font-bold text-[var(--pp-text)]">{d.brand}</div>
                <div className="mt-0.5 text-[13px] font-semibold" style={{ color: "var(--pp-blue)" }}>
                  {d.cashback}
                </div>
                {d.tag && (
                  <div
                    className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{ background: "var(--pp-yellow)", color: "var(--pp-blue-dark)" }}
                  >
                    <Tag className="h-3 w-3" /> {d.tag}
                  </div>
                )}
                <div className="mt-2 text-[11px] text-[var(--pp-text-muted)]">{d.expires}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Browse */}
        <h3 className="mt-7 text-[17px] font-bold text-[var(--pp-text)]">Browse all deals</h3>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {TILES.map((d) => (
            <button
              key={d.id}
              className="text-left rounded-2xl bg-[var(--pp-card)] border border-[color:var(--border)] p-4"
            >
              <div className="flex items-start justify-between">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: d.color }}
                >
                  {d.initial}
                </div>
                <span className="text-[13px] font-semibold" style={{ color: "var(--pp-blue)" }}>
                  {d.cashback}
                </span>
              </div>
              <div className="mt-3 text-[14px] font-semibold text-[var(--pp-text)]">{d.brand}</div>
              <div className="mt-0.5 text-[11px] text-[var(--pp-text-muted)]">{d.expires}</div>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-6 text-[11px] leading-relaxed text-[var(--pp-text-muted)]">
          Cash back is added to your PayPal balance after the merchant confirms your eligible
          purchase. Offers may change without notice. See terms for details.
        </p>
      </main>
      <BottomNav />
    </div>
  );
}
