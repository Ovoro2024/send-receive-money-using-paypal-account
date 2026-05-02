import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, ArrowDownLeft, ArrowUpRight, Landmark, ShoppingBag, Coffee, Smartphone, Gift, Clock } from "lucide-react";
import { BottomNav } from "@/components/paypal/BottomNav";
import { RequireAuth } from "@/auth/RequireAuth";

export const Route = createFileRoute("/payments")({
  component: () => (
    <RequireAuth>
      <PaymentsPage />
    </RequireAuth>
  ),
  head: () => ({
    meta: [
      { title: "Activity — PayPal" },
      { name: "description", content: "Your PayPal payment activity." },
    ],
  }),
});

type TxType = "in" | "out" | "pending";
type Tx = {
  id: string;
  name: string;
  sub: string;
  date: string; // ISO
  amount: number; // negative for out
  type: TxType;
  icon: "bank" | "shop" | "coffee" | "phone" | "gift" | "person";
  initials?: string;
  initialsColor?: string;
};

const TX: Tx[] = [
  { id: "1", name: "Anna Rivera", sub: "Money received", date: "2026-04-22", amount: 45, type: "in", icon: "person", initials: "AR", initialsColor: "oklch(0.7 0.16 30)" },
  { id: "2", name: "Starbucks", sub: "Purchase", date: "2026-04-20", amount: -6.85, type: "out", icon: "coffee" },
  { id: "3", name: "Amazon.com", sub: "Purchase", date: "2026-04-18", amount: -42.19, type: "out", icon: "shop" },
  { id: "4", name: "T-Mobile", sub: "Bill payment", date: "2026-04-15", amount: -75, type: "out", icon: "phone" },
  { id: "5", name: "Marcus Lee", sub: "Pending request", date: "2026-04-12", amount: 20, type: "pending", icon: "person", initials: "ML", initialsColor: "oklch(0.55 0.18 260)" },
  { id: "6", name: "SUTTON BANK", sub: "Transfer to bank · Completed", date: "2026-03-28", amount: -3, type: "out", icon: "bank" },
  { id: "7", name: "Ebay", sub: "Refund", date: "2026-03-21", amount: 18.5, type: "in", icon: "shop" },
  { id: "8", name: "Birthday gift · Mom", sub: "Money sent", date: "2026-03-14", amount: -100, type: "out", icon: "gift" },
];

const TABS = [
  { key: "all", label: "All" },
  { key: "in", label: "Money in" },
  { key: "out", label: "Money out" },
  { key: "pending", label: "Pending" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

function PaymentsPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return TX.filter((t) => {
      if (tab !== "all") {
        if (tab === "in" && t.type !== "in") return false;
        if (tab === "out" && t.type !== "out") return false;
        if (tab === "pending" && t.type !== "pending") return false;
      }
      if (query.trim() && !t.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [tab, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, Tx[]>();
    for (const t of filtered) {
      const d = new Date(t.date);
      const key = d.toLocaleString("en-US", { month: "long", year: "numeric" });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--pp-bg)]">
      {/* Header */}
      <header className="px-5 pt-6 pb-3">
        <h1 className="text-[28px] font-bold text-[var(--pp-text)]">Activity</h1>

        {/* Search + filter */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 h-11 rounded-full bg-white border border-[color:var(--border)] px-4">
            <Search size={18} className="text-[var(--pp-text-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search activity"
              className="flex-1 bg-transparent text-[15px] text-[var(--pp-text)] placeholder:text-[var(--pp-text-muted)] outline-none"
            />
          </div>
          <button
            aria-label="Filter"
            className="h-11 w-11 rounded-full bg-white border border-[color:var(--border)] flex items-center justify-center text-[var(--pp-text)]"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Segmented tabs */}
        <div className="mt-4 flex gap-2 overflow-x-auto -mx-5 px-5 pb-1">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="shrink-0 h-9 px-4 rounded-full text-[14px] font-semibold transition-colors"
                style={{
                  backgroundColor: active ? "var(--pp-text)" : "white",
                  color: active ? "white" : "var(--pp-text)",
                  borderWidth: 1,
                  borderColor: active ? "var(--pp-text)" : "var(--border)",
                  borderStyle: "solid",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="flex-1 px-5 pb-6">
        {grouped.length === 0 && (
          <div className="mt-16 text-center text-[var(--pp-text-muted)] text-[15px]">
            No activity found.
          </div>
        )}

        {grouped.map(([month, items]) => (
          <section key={month} className="mt-3">
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-[var(--pp-text-muted)] mb-2">
              {month}
            </h2>
            <div className="rounded-2xl bg-white border border-[color:var(--border)] overflow-hidden">
              {items.map((tx, i) => (
                <div key={tx.id}>
                  <TxRow tx={tx} />
                  {i < items.length - 1 && (
                    <div className="ml-[68px] h-px bg-[color:var(--border)]" />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Yellow promo CTA */}
        <button className="mt-6 w-full rounded-full bg-[var(--pp-yellow)] py-3.5 text-[15px] font-bold text-[var(--pp-text)]">
          See all activity
        </button>
      </main>

      <BottomNav />
    </div>
  );
}

function TxRow({ tx }: { tx: Tx }) {
  const isIn = tx.type === "in";
  const isPending = tx.type === "pending";
  const date = new Date(tx.date).toLocaleString("en-US", { month: "short", day: "numeric" });
  const amountStr = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(tx.amount));

  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <TxIcon tx={tx} />
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-[var(--pp-text)] truncate">{tx.name}</p>
        <p className="text-[13px] text-[var(--pp-text-muted)] truncate">
          {date} · {tx.sub}
        </p>
      </div>
      <div className="text-right">
        <p
          className="text-[15px] font-bold"
          style={{
            color: isPending
              ? "var(--pp-text-muted)"
              : isIn
                ? "var(--pp-success)"
                : "var(--pp-text)",
          }}
        >
          {isIn ? "+" : isPending ? "" : "-"}
          {amountStr}
        </p>
        {isPending && (
          <p className="text-[11px] font-semibold text-[var(--pp-yellow-deep)] uppercase tracking-wide">
            Pending
          </p>
        )}
      </div>
    </div>
  );
}

function TxIcon({ tx }: { tx: Tx }) {
  if (tx.icon === "person") {
    return (
      <div
        className="h-11 w-11 rounded-full flex items-center justify-center text-white font-bold text-[14px] shrink-0"
        style={{ backgroundColor: tx.initialsColor ?? "var(--pp-blue)" }}
      >
        {tx.initials}
      </div>
    );
  }
  const map = {
    bank: { Icon: Landmark, bg: "var(--pp-blue)", color: "white" },
    shop: { Icon: ShoppingBag, bg: "oklch(0.95 0.04 70)", color: "var(--pp-text)" },
    coffee: { Icon: Coffee, bg: "oklch(0.93 0.04 40)", color: "oklch(0.4 0.12 40)" },
    phone: { Icon: Smartphone, bg: "oklch(0.93 0.04 200)", color: "oklch(0.4 0.12 230)" },
    gift: { Icon: Gift, bg: "oklch(0.93 0.06 350)", color: "oklch(0.45 0.18 0)" },
  } as const;
  const cfg = map[tx.icon as keyof typeof map];
  if (!cfg) {
    const Fallback = tx.type === "in" ? ArrowDownLeft : tx.type === "pending" ? Clock : ArrowUpRight;
    return (
      <div className="h-11 w-11 rounded-full bg-[var(--pp-bg)] flex items-center justify-center text-[var(--pp-text)] shrink-0">
        <Fallback size={18} />
      </div>
    );
  }
  const { Icon, bg, color } = cfg;
  return (
    <div
      className="h-11 w-11 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: bg, color }}
    >
      <Icon size={20} strokeWidth={2.25} />
    </div>
  );
}
