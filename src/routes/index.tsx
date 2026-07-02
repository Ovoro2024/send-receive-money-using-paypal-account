import { createFileRoute, Link } from "@tanstack/react-router";
import { Trophy, ScanLine, X, ArrowUp, Landmark } from "lucide-react";
import { BottomNav } from "@/components/paypal/BottomNav";
import { PayPalLogo } from "@/components/paypal/PayPalLogo";
import { RequireAuth } from "@/auth/RequireAuth";
import { useBalance } from "@/auth/useBalance";
import { useSavings } from "@/auth/useSavings";
import { useAuth } from "@/auth/AuthProvider";
import avatar from "@/assets/avatar.jpg";

export const Route = createFileRoute("/")({
  component: IndexRoute,
  head: () => ({
    meta: [
      { title: "PayPal" },
      { name: "description", content: "Your PayPal balance, savings and recent activity." },
    ],
  }),
});

function IndexRoute() {
  return (
    <RequireAuth>
      <Index />
    </RequireAuth>
  );
}

function Index() {
  const { balance } = useBalance();
  const { savings } = useSavings();
  const { signOut } = useAuth();
  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);
  const totalBalance = (balance ?? 0) + (savings ?? 0);
  const balanceLabel = balance === null ? "—" : fmt(totalBalance);
  const savingsLabel = savings === null ? "$0.00" : fmt(savings);
  return (
    <div className="min-h-screen flex flex-col bg-[var(--pp-bg)]">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6 pb-3">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt="Profile"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-[color:var(--border)]"
          />
          <button
            onClick={() => signOut()}
            className="text-[13px] font-semibold text-[var(--pp-link)]"
          >
            Sign out
          </button>
        </div>
        <div className="flex items-center gap-4 text-[var(--pp-blue)]">
          <Trophy size={22} strokeWidth={2.25} />
          <ScanLine size={22} strokeWidth={2.25} />
        </div>
      </header>

      <main className="flex-1 px-4 pb-4">
        {/* Account cards row (horizontal scroll) */}
        <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-2 snap-x">
          <AccountCard
            icon={<PayPalLogo className="h-7 w-7" />}
            title="PayPal balance"
            amount={balanceLabel}
            footer={<Link to="/add-money" className="text-[var(--pp-link)] font-semibold">Add money</Link>}
          />
          <AccountCard
            icon={
              <div className="h-7 w-7 rounded-md bg-[var(--pp-blue)] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor">
                  <rect x="3" y="6" width="18" height="13" rx="2" />
                  <circle cx="16" cy="12.5" r="1.4" fill="var(--pp-blue)" />
                </svg>
              </div>
            }
            title="PayPal Savings"
            amount={savingsLabel}
            footer={
              <span className="flex items-center gap-1 font-bold text-[var(--pp-text)]">
                <ArrowUp size={14} strokeWidth={3} />
                APY: <span className="text-[var(--pp-success)]">4.00%</span>
              </span>
            }
          />
          <AccountCard
            icon={
              <div className="h-7 w-7 rounded-full bg-[var(--pp-blue-light)] flex items-center justify-center text-white font-bold text-[13px]">
                C
              </div>
            }
            title="Crypto"
            amount="$0.00"
            footer={<span className="text-[var(--pp-link)] font-semibold">Buy</span>}
          />
        </div>

        {/* Set up your account */}
        <div className="mt-3 rounded-2xl bg-white border border-[color:var(--border)] p-4 flex items-center gap-4">
          <ProgressRing value={4} max={5} />
          <div>
            <p className="text-[17px] font-semibold text-[var(--pp-text)]">
              Set up your account
            </p>
            <p className="text-[14px] text-[var(--pp-text-muted)]">You're almost done!</p>
          </div>
        </div>

        {/* Crypto promo */}
        <div className="mt-3 rounded-2xl bg-white border border-[color:var(--border)] p-4 flex items-start gap-3">
          <CryptoIcon />
          <div className="flex-1">
            <p className="text-[16px] font-semibold text-[var(--pp-text)] leading-snug">
              Move crypto your way—<br />Send. Receive. Enjoy.
            </p>
            <p className="mt-1 text-[13px] text-[var(--pp-text-muted)]">Terms apply.</p>
          </div>
          <button
            aria-label="Dismiss"
            className="text-[var(--pp-text-muted)] -mt-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Recent activity */}
        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[var(--pp-text)]">Recent activity</h2>
          <Link to="/activity" className="text-[13px] font-bold text-[var(--pp-blue-dark)]">
            See all
          </Link>
        </div>
        <RecentActivity />


      </main>

      {/* Send / Request - sticky above bottom nav */}
      <div className="sticky bottom-[72px] left-0 right-0 z-20 bg-[var(--pp-bg)] px-4 pt-3 pb-2 grid grid-cols-2 gap-3">
        <Link
          to="/send"
          className="text-center rounded-full bg-[var(--pp-yellow)] py-3.5 text-[17px] font-bold text-[var(--pp-text)]"
        >
          Send
        </Link>
        <Link
          to="/request"
          className="text-center rounded-full bg-[var(--pp-yellow)] py-3.5 text-[17px] font-bold text-[var(--pp-text)]"
        >
          Request
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}

function AccountCard({
  icon,
  title,
  amount,
  footer,
}: {
  icon: React.ReactNode;
  title: string;
  amount: string;
  footer: React.ReactNode;
}) {
  return (
    <div className="snap-start min-w-[46%] max-w-[80%] flex-1 rounded-2xl bg-white border border-[color:var(--border)] p-4 flex flex-col gap-2 overflow-hidden">
      {icon}
      <p className="text-[14px] text-[var(--pp-text-muted)] mt-1 truncate">{title}</p>
      <p
        className="text-[26px] font-semibold text-[var(--pp-text)] leading-tight truncate"
        title={amount}
      >
        {amount}
      </p>
      <div className="mt-3 text-[14px] truncate">{footer}</div>
    </div>
  );
}

function ProgressRing({ value, max }: { value: number; max: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const pct = value / max;
  return (
    <div className="relative h-12 w-12 shrink-0">
      <svg viewBox="0 0 44 44" className="h-12 w-12 -rotate-90">
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="var(--pp-blue-light)"
          strokeOpacity="0.25"
          strokeWidth="3"
        />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="var(--pp-blue-dark)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[12px] font-semibold text-[var(--pp-blue-dark)]">
        {value}/{max}
      </span>
    </div>
  );
}

function CryptoIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12 shrink-0">
      {/* Blue square (left) */}
      <rect x="4" y="10" width="22" height="28" rx="3" fill="var(--pp-crypto-blue)" />
      <text x="9" y="30" fontFamily="Arial" fontSize="16" fontWeight="700" fill="var(--pp-blue-dark)">
        ¢
      </text>
      {/* Green circle (right) */}
      <circle cx="32" cy="26" r="12" fill="var(--pp-crypto-green)" />
      <text x="27" y="31" fontFamily="Arial" fontSize="14" fontWeight="700" fill="white">
        $
      </text>
    </svg>
  );
}
