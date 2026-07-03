import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, ChevronRight, HelpCircle } from "lucide-react";
import { BottomNav } from "@/components/paypal/BottomNav";
import { RequireAuth } from "@/auth/RequireAuth";
import { useBalance } from "@/auth/useBalance";
import { useSavings } from "@/auth/useSavings";
import { PayPalLogo } from "@/components/paypal/PayPalLogo";

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
  const { savings } = useSavings();
  const bal = balance ?? 0;
  const sav = savings ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--pp-bg)]">
      {/* Header */}
      <header className="px-5 pt-6 pb-2 flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-[var(--pp-text)]">Wallet</h1>
        <button aria-label="Help" className="text-[var(--pp-text)]">
          <HelpCircle className="h-6 w-6" strokeWidth={1.75} />
        </button>
      </header>

      <main className="flex-1 px-5 pb-8">
        {/* Balance section */}
        <section className="mt-3">
          <p className="text-[15px] text-[var(--pp-text)]">PayPal balance</p>
          <p className="mt-1 text-[36px] font-bold leading-none text-[var(--pp-text)] tracking-tight">
            {formatUsd(bal)}
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              to="/add-money"
              className="flex-1 text-center rounded-full py-3 text-[15px] font-bold"
              style={{ background: "var(--pp-blue-dark)", color: "white" }}
            >
              Add money
            </Link>
            <Link
              to="/transfer/bank"
              className="flex-1 text-center rounded-full py-3 text-[15px] font-bold border-2"
              style={{ borderColor: "var(--pp-blue-dark)", color: "var(--pp-blue-dark)" }}
            >
              Transfer
            </Link>
          </div>
        </section>

        {/* PayPal Savings */}
        <SectionTitle>PayPal Savings</SectionTitle>
        <Link
          to="/transfer/savings"
          className="block rounded-2xl bg-white border border-[color:var(--border)] px-4 py-4"
        >
          <div className="flex items-center gap-3">
            <div
              className="h-11 w-11 rounded-full flex items-center justify-center"
              style={{ background: "var(--pp-yellow)" }}
            >
              <PiggyGlyph />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-[var(--pp-text)]">PayPal Savings</p>
              <p className="text-[12px] text-[var(--pp-text-muted)]">
                4.30% APY · No fees, no minimums
              </p>
            </div>
            <div className="text-right">
              <p className="text-[15px] font-bold text-[var(--pp-text)]">{formatUsd(sav)}</p>
              <ChevronRight className="ml-auto h-4 w-4 text-[var(--pp-text-muted)]" />
            </div>
          </div>
        </Link>

        {/* Banks and cards */}
        <SectionTitle>Banks and cards</SectionTitle>
        <div className="rounded-2xl bg-white border border-[color:var(--border)] divide-y divide-[color:var(--border)] overflow-hidden">
          <MethodRow
            mark={<MastercardMark />}
            title="Mastercard Debit"
            sub="Debit ••••7109 · Preferred"
          />
          <MethodRow
            mark={<CapitalOneMark />}
            title="CAPITAL ONE N.A."
            sub="Checking ••••1260"
          />
          <MethodRow
            mark={<SuttonMark />}
            title="SUTTON BANK"
            sub="Checking ••••7402 · Direct deposit"
          />
        </div>

        <Link
          to="/link-account"
          search={{ returnTo: "/wallet" }}
          className="mt-3 w-full rounded-2xl bg-white border border-[color:var(--border)] px-4 py-3.5 flex items-center gap-3 text-left"
        >
          <div className="h-9 w-9 rounded-full bg-[var(--pp-bg)] flex items-center justify-center">
            <Plus className="h-5 w-5 text-[var(--pp-blue-dark)]" strokeWidth={2.25} />
          </div>
          <span className="text-[15px] font-semibold text-[var(--pp-text)]">Link a bank or card</span>
        </Link>

        {/* PayPal Debit Card */}
        <SectionTitle>PayPal Debit Card</SectionTitle>
        <Link
          to="/finances"
          className="block rounded-2xl overflow-hidden"
          style={{ background: "var(--pp-blue-dark)" }}
        >
          <div className="p-5 relative min-h-[170px] flex flex-col justify-between text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
                  PayPal Debit Card
                </p>
                <div className="mt-1">
                  <PayPalLogo className="h-6 w-6" />
                </div>
              </div>
              <MastercardMark large />
            </div>
            <div>
              <p className="text-[13px] tracking-[0.3em] font-mono opacity-90">
                •••• •••• •••• 7109
              </p>
              <p className="mt-1 text-[11px] opacity-70">Use your balance anywhere.</p>
            </div>
          </div>
        </Link>

        {/* Rewards */}
        <SectionTitle>Rewards & offers</SectionTitle>
        <div className="rounded-2xl bg-white border border-[color:var(--border)] divide-y divide-[color:var(--border)] overflow-hidden">
          <RewardRow
            label="Cash back this month"
            value="$12.40"
            sub="From offers you activated"
          />
          <RewardRow
            label="Gift cards"
            value="0"
            sub="Buy discounted gift cards"
          />
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-[var(--pp-text-muted)]">
          PayPal Savings offered by Synchrony Bank, Member FDIC. PayPal balance is held with our
          partner bank. Rates and terms may change.
        </p>
      </main>
      <BottomNav />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-7 mb-2 text-[15px] font-semibold text-[var(--pp-text)]">{children}</h2>
  );
}

function MethodRow({ mark, title, sub }: { mark: React.ReactNode; title: string; sub: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
      <div className="h-10 w-12 rounded-md bg-white border border-[color:var(--border)] flex items-center justify-center overflow-hidden shrink-0">
        {mark}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-bold text-[var(--pp-text)] truncate">{title}</p>
        <p className="text-[12px] text-[var(--pp-text-muted)] truncate">{sub}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-[var(--pp-text-muted)]" />
    </button>
  );
}

function RewardRow({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-[var(--pp-text)]">{label}</p>
        <p className="text-[12px] text-[var(--pp-text-muted)]">{sub}</p>
      </div>
      <span className="text-[15px] font-bold text-[var(--pp-text)]">{value}</span>
      <ChevronRight className="h-4 w-4 text-[var(--pp-text-muted)]" />
    </button>
  );
}

function PiggyGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="var(--pp-blue-dark)">
      <path d="M20 10c0-3.3-3.6-6-8-6-3.5 0-6.5 1.7-7.6 4.1L2 8v4l2.4.2c.2.6.5 1.1.9 1.6L4 16h3l1-1.3c.6.2 1.2.3 1.9.3H12l1 2h2v-2h1.5c1.9 0 3.5-1.2 3.5-3v-1h1v-1h-1zm-5-1a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
    </svg>
  );
}

function MastercardMark({ large }: { large?: boolean }) {
  const size = large ? "h-6 w-6" : "h-5 w-5";
  return (
    <div className="relative flex items-center">
      <span className={`block ${size} rounded-full`} style={{ background: "var(--pp-mc-red)" }} />
      <span
        className={`block ${size} rounded-full -ml-2 mix-blend-multiply`}
        style={{ background: "var(--pp-mc-yellow)" }}
      />
    </div>
  );
}

function CapitalOneMark() {
  return (
    <div className="h-10 w-12 flex items-center justify-center" style={{ background: "oklch(0.22 0.08 265)" }}>
      <span className="text-white text-[8px] font-bold tracking-tight">
        Capital<span style={{ color: "var(--pp-mc-red)" }}>One</span>
      </span>
    </div>
  );
}

function SuttonMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[var(--pp-blue-dark)]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 10 L12 4 L21 10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10 V18 M9 10 V18 M15 10 V18 M19 10 V18" />
      <path d="M3 19 H21" strokeLinecap="round" />
    </svg>
  );
}
