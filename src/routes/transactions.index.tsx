import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import { RequireAuth } from "@/auth/RequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/paypal/BottomNav";
import { kindMeta } from "@/routes/activity.index";

export const Route = createFileRoute("/transactions/")({
  component: () => (
    <RequireAuth>
      <TransactionsPage />
    </RequireAuth>
  ),
  head: () => ({
    meta: [
      { title: "Transactions — PayPal" },
      { name: "description", content: "Your PayPal send and request history." },
    ],
  }),
});

type Txn = {
  id: string;
  amount: number;
  kind: string;
  counterparty: string | null;
  note: string | null;
  status: string;
  created_at: string;
};

type Filter = "all" | "pending" | "completed";

function fmtUSD(n: number, signed = false) {
  const s = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(n));
  if (!signed) return s;
  return n >= 0 ? `+${s}` : `-${s}`;
}

function monthLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function isSend(t: Txn) {
  return t.kind === "send_money";
}

function TransactionsPage() {
  const [items, setItems] = useState<Txn[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    supabase
      .from("transactions")
      .select("id,amount,kind,counterparty,note,status,created_at")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => {
        if (alive) setItems((data as Txn[]) ?? []);
      });
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!items) return null;
    return items.filter((t) => {
      if (!isSend(t)) return false;
      if (filter === "pending" && t.status !== "pending") return false;
      if (filter === "completed" && t.status !== "completed") return false;
      if (q) {
        const hay = `${t.counterparty ?? ""} ${t.note ?? ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [items, filter, q]);

  const grouped = useMemo(() => {
    if (!filtered) return [];
    const map = new Map<string, Txn[]>();
    for (const t of filtered) {
      const k = monthLabel(t.created_at);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(t);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const counts = useMemo(() => {
    if (!items) return { all: 0, pending: 0, completed: 0 };
    const sends = items.filter(isSend);
    return {
      all: sends.length,
      pending: sends.filter((t) => t.status === "pending").length,
      completed: sends.filter((t) => t.status === "completed").length,
    };
  }, [items]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--pp-bg)]">
      <header className="px-4 pt-6 pb-3 flex items-center gap-3 bg-white">
        <button aria-label="Back" onClick={() => navigate({ to: "/" })}>
          <ArrowLeft className="h-6 w-6 text-[var(--pp-text)]" />
        </button>
        <h1 className="text-[22px] font-bold text-[var(--pp-text)]">Transactions</h1>
      </header>

      <div className="px-4 pt-3 pb-2 bg-white">
        <div className="flex items-center gap-2 rounded-full bg-[var(--pp-bg)] px-4 h-11 border border-[color:var(--border)]">
          <Search className="h-4 w-4 text-[var(--pp-text-muted)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search transactions"
            className="flex-1 bg-transparent outline-none text-[14px] text-[var(--pp-text)]"
          />
          <SlidersHorizontal className="h-4 w-4 text-[var(--pp-text-muted)]" />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {(
            [
              ["all", "All", counts.all],
              ["pending", "Pending", counts.pending],
              ["completed", "Completed", counts.completed],
            ] as [Filter, string, number][]
          ).map(([k, label, count]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`shrink-0 px-4 h-8 rounded-full text-[13px] font-semibold border flex items-center gap-1.5 ${
                filter === k
                  ? "bg-[var(--pp-blue-dark)] text-white border-transparent"
                  : "bg-white text-[var(--pp-text)] border-[color:var(--border)]"
              }`}
            >
              {label}
              <span
                className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[11px] font-bold ${
                  filter === k ? "bg-white/20 text-white" : "bg-[var(--pp-bg)] text-[var(--pp-text-muted)]"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 px-4 pt-3 pb-24">
        {filtered === null && (
          <p className="mt-8 text-center text-[13px] text-[var(--pp-text-muted)]">Loading…</p>
        )}
        {filtered && filtered.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-[16px] font-semibold text-[var(--pp-text)]">
              No {filter === "all" ? "" : filter} transactions
            </p>
            <p className="mt-1 text-[13px] text-[var(--pp-text-muted)]">
              Payments you send will appear here.
            </p>
          </div>
        )}
        {grouped.map(([month, rows]) => (
          <section key={month} className="mt-4">
            <h2 className="px-1 mb-2 text-[13px] font-semibold text-[var(--pp-text-muted)] uppercase tracking-wide">
              {month}
            </h2>
            <div className="rounded-2xl bg-white border border-[color:var(--border)] divide-y divide-[color:var(--border)] overflow-hidden">
              {rows.map((t) => {
                const m = kindMeta(t);
                const isPending = t.status === "pending";
                return (
                  <Link
                    key={t.id}
                    to="/activity/$id"
                    params={{ id: t.id }}
                    className="flex items-center gap-3 px-4 py-3.5"
                  >
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center text-[16px] font-bold"
                      style={{ background: m.bg, color: "var(--pp-blue-dark)" }}
                    >
                      {m.glyph}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-[var(--pp-text)] truncate">
                        {m.title}
                      </p>
                      <p className="text-[12px] text-[var(--pp-text-muted)] truncate">
                        {new Date(t.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        · {m.sub}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className="block text-[15px] font-bold tabular-nums"
                        style={{ color: m.color }}
                      >
                        {m.sign === 0 ? fmtUSD(t.amount) : fmtUSD(Number(t.amount) * m.sign, true)}
                      </span>
                      <span
                        className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          isPending
                            ? "bg-[var(--pp-yellow)] text-[var(--pp-blue-dark)]"
                            : "bg-[var(--pp-bg)] text-[var(--pp-text-muted)]"
                        }`}
                      >
                        {isPending ? "Pending" : "Completed"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}
