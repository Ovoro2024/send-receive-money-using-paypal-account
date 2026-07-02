import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { kindMeta } from "@/routes/activity.index";

type Txn = {
  id: string;
  amount: number;
  kind: string;
  counterparty: string | null;
  note: string | null;
  status: string;
  created_at: string;
};

function fmtUSD(n: number, signed = false) {
  const s = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(n));
  if (!signed) return s;
  return n >= 0 ? `+${s}` : `-${s}`;
}

export function RecentActivity({ limit = 3 }: { limit?: number }) {
  const [items, setItems] = useState<Txn[]>([]);

  useEffect(() => {
    let alive = true;
    supabase
      .from("transactions")
      .select("id,amount,kind,counterparty,note,status,created_at")
      .order("created_at", { ascending: false })
      .limit(limit)
      .then(({ data }) => {
        if (alive) setItems((data as Txn[]) ?? []);
      });
    return () => {
      alive = false;
    };
  }, [limit]);

  return (
    <div className="mt-3">
      <div className="rounded-2xl bg-white border border-[color:var(--border)] divide-y divide-[color:var(--border)] overflow-hidden">
        {items.length === 0 && (
          <p className="px-4 py-6 text-center text-[13px] text-[var(--pp-text-muted)]">
            No activity yet
          </p>
        )}
        {items.map((t) => {
          const m = kindMeta(t);
          return (
            <Link
              key={t.id}
              to="/activity/$id"
              params={{ id: t.id }}
              className="flex items-center gap-3 px-4 py-3"
            >
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-[15px] font-bold"
                style={{ background: m.bg, color: "var(--pp-blue-dark)" }}
              >
                {m.glyph}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[var(--pp-text)] truncate">
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
              <span
                className="text-[14px] font-bold tabular-nums"
                style={{ color: m.color }}
              >
                {m.sign === 0 ? fmtUSD(t.amount) : fmtUSD(Number(t.amount) * m.sign, true)}
              </span>
            </Link>
          );
        })}
      </div>
      <Link
        to="/activity"
        className="mt-3 block text-center text-[14px] font-bold text-[var(--pp-blue-dark)]"
      >
        See all activity
      </Link>
    </div>
  );
}
