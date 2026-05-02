import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, ChevronRight, Shield, Gift, CreditCard, Building2, QrCode } from "lucide-react";
import { BottomNav } from "@/components/paypal/BottomNav";
import { RequireAuth } from "@/auth/RequireAuth";
import { useBalance } from "@/auth/useBalance";

export const Route = createFileRoute("/wallet")({
  component: () => (
    <RequireAuth>
      <WalletPage />
    </RequireAuth>
  ),
  head: () => ({
    meta: [
      { title: "Wallet — PayPal" },
      { name: "description", content: "Your PayPal balance, cards, banks and rewards in one place." },
    ],
  }),
});

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function WalletPage() {
  const { balance } = useBalance();
  const value = balance ?? 30.71;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--pp-bg)]">
      <main className="flex-1 px-5 pt-10 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-[34px] font-bold leading-tight text-[var(--pp-text)]">Wallet</h1>
          <button
            aria-label="QR code"
            className="h-10 w-10 rounded-full bg-[var(--pp-card)] border border-[color:var(--border)] flex items-center justify-center"
          >
            <QrCode className="h-5 w-5 text-[var(--pp-text)]" />
          </button>
        </div>

        {/* PayPal balance card (yellow accent) */}
        <Link
          to="/finances"
          className="mt-5 block rounded-3xl p-5"
          style={{ background: "var(--pp-yellow)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold uppercase tracking-wide" style={{ color: "var(--pp-blue-dark)" }}>
              PayPal balance
            </span>
            <ChevronRight className="h-5 w-5" style={{ color: "var(--pp-blue-dark)" }} />
          </div>
          <div className="mt-2 text-[34px] font-bold leading-none" style={{ color: "var(--pp-blue-dark)" }}>
            {formatUsd(value)}
          </div>
          <div className="mt-3 flex gap-2">
            <Link
              to="/add-money"
              className="inline-flex items-center gap-1 px-4 h-9 rounded-full text-[13px] font-semibold"
              style={{ background: "var(--pp-blue-dark)", color: "white" }}
            >
              <Plus className="h-4 w-4" /> Add money
            </Link>
            <Link
              to="/transfer/bank"
              className="inline-flex items-center px-4 h-9 rounded-full text-[13px] font-semibold border"
              style={{ borderColor: "var(--pp-blue-dark)", color: "var(--pp-blue-dark)" }}
            >
              Transfer
            </Link>
          </div>
        </Link>

        {/* Banks and cards */}
        <SectionHeader title="Banks and cards" action="Link new" />
        <div className="rounded-2xl bg-[var(--pp-card)] border border-[color:var(--border)] divide-y divide-[color:var(--border)]">
          <CardRow
            mark={<MastercardMark />}
            title="Mastercard debit"
            sub="Ending in 7109 · Preferred"
          />
          <CardRow
            mark={<BankMark letters="C1" bg="oklch(0.55 0.18 28)" />}
            title="Capital One N.A."
            sub="Bank account ending in 1260"
          />
          <CardRow
            mark={<BankMark letters="SB" bg="oklch(0.55 0.18 260)" />}
            title="Sutton Bank"
            sub="Direct deposit set up"
          />
          <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
            <div className="h-10 w-10 rounded-full bg-[var(--pp-bg)] flex items-center justify-center">
              <Plus className="h-5 w-5 text-[var(--pp-blue)]" />
            </div>
            <span className="text-[15px] font-semibold" style={{ color: "var(--pp-blue)" }}>
              Link a bank or card
            </span>
          </button>
        </div>

        {/* Rewards */}
        <SectionHeader title="Rewards" />
        <div className="grid grid-cols-2 gap-3">
          <RewardTile
            icon={<Gift className="h-5 w-5" />}
            title="Cash back"
            value="$12.40"
            sub="This month"
          />
          <RewardTile
            icon={<Shield className="h-5 w-5" />}
            title="Purchase Protection"
            value="On"
            sub="Eligible items"
          />
        </div>

        {/* Manage */}
        <SectionHeader title="Manage" />
        <div className="rounded-2xl bg-[var(--pp-card)] border border-[color:var(--border)] divide-y divide-[color:var(--border)]">
          <ManageRow icon={<CreditCard className="h-5 w-5" />} label="PayPal Debit Card" />
          <ManageRow icon={<Building2 className="h-5 w-5" />} label="Direct deposit" />
          <ManageRow icon={<Shield className="h-5 w-5" />} label="Security and privacy" />
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-[var(--pp-text-muted)]">
          PayPal balance is held with our partner bank. Funds added are typically available within
          minutes. See the user agreement for details.
        </p>
      </main>
      <BottomNav />
    </div>
  );
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <div className="mt-6 mb-2 flex items-center justify-between">
      <h3 className="text-[17px] font-bold text-[var(--pp-text)]">{title}</h3>
      {action && (
        <button className="text-[13px] font-semibold" style={{ color: "var(--pp-blue)" }}>
          {action}
        </button>
      )}
    </div>
  );
}

function CardRow({ mark, title, sub }: { mark: React.ReactNode; title: string; sub: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
      <div className="h-10 w-12 rounded-md bg-white border border-[color:var(--border)] flex items-center justify-center overflow-hidden">
        {mark}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold text-[var(--pp-text)] truncate">{title}</div>
        <div className="text-[12px] text-[var(--pp-text-muted)] truncate">{sub}</div>
      </div>
      <ChevronRight className="h-4 w-4 text-[var(--pp-text-muted)]" />
    </button>
  );
}

function ManageRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
      <div className="h-9 w-9 rounded-full bg-[var(--pp-bg)] flex items-center justify-center text-[var(--pp-blue)]">
        {icon}
      </div>
      <span className="flex-1 text-[14px] font-semibold text-[var(--pp-text)]">{label}</span>
      <ChevronRight className="h-4 w-4 text-[var(--pp-text-muted)]" />
    </button>
  );
}

function RewardTile({
  icon,
  title,
  value,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl bg-[var(--pp-card)] border border-[color:var(--border)] p-4">
      <div
        className="h-9 w-9 rounded-full flex items-center justify-center"
        style={{ background: "var(--pp-yellow)", color: "var(--pp-blue-dark)" }}
      >
        {icon}
      </div>
      <div className="mt-3 text-[12px] text-[var(--pp-text-muted)]">{title}</div>
      <div className="text-[18px] font-bold text-[var(--pp-text)]">{value}</div>
      <div className="text-[11px] text-[var(--pp-text-muted)]">{sub}</div>
    </div>
  );
}

function MastercardMark() {
  return (
    <div className="flex items-center">
      <span
        className="block h-5 w-5 rounded-full"
        style={{ background: "var(--pp-mc-red)" }}
      />
      <span
        className="block h-5 w-5 rounded-full -ml-2 mix-blend-multiply"
        style={{ background: "var(--pp-mc-yellow)" }}
      />
    </div>
  );
}

function BankMark({ letters, bg }: { letters: string; bg: string }) {
  return (
    <span
      className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-sm"
      style={{ background: bg }}
    >
      {letters}
    </span>
  );
}
