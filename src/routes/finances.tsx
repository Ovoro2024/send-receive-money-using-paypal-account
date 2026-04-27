import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BottomNav } from "@/components/paypal/BottomNav";
import { PayPalLogo } from "@/components/paypal/PayPalLogo";
import { RequireAuth } from "@/auth/RequireAuth";
import { useBalance } from "@/auth/useBalance";
import { useAuth } from "@/auth/AuthProvider";

export const Route = createFileRoute("/finances")({
  component: FinancesRoute,
  head: () => ({
    meta: [
      { title: "Finances — PayPal" },
      { name: "description", content: "Manage your PayPal balance, savings and crypto in one place." },
    ],
  }),
});

const tabs = ["Balance", "Savings", "Crypto"] as const;
type Tab = (typeof tabs)[number];

function FinancesRoute() {
  return (
    <RequireAuth>
      <FinancesPage />
    </RequireAuth>
  );
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function FinancesPage() {
  const [tab, setTab] = useState<Tab>("Balance");
  const { balance } = useBalance();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--pp-bg)]">
      <main className="flex-1 px-5 pt-10 pb-6">
        <h1 className="text-[34px] font-bold leading-tight text-[var(--pp-text)]">
          Finances
        </h1>

        {/* Tabs */}
        <div className="mt-4 flex items-center gap-2">
          {tabs.map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={
                  "px-5 py-2 rounded-full text-[15px] font-semibold transition-colors " +
                  (active
                    ? "bg-white text-[var(--pp-blue)] shadow-sm border border-[color:var(--border)]"
                    : "bg-transparent text-[var(--pp-text)]")
                }
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Total balance */}
        <div className="mt-7">
          <p className="text-[15px] text-[var(--pp-text)]">Total PayPal Balance</p>
          <p className="mt-2 text-[44px] font-semibold leading-none text-[var(--pp-text)]">
            $30.71
          </p>
        </div>

        {/* Add Money button */}
        <Link
          to="/add-money"
          className="mt-7 block w-full rounded-full bg-[var(--pp-blue-dark)] py-4 text-center text-white text-[17px] font-bold"
        >
          Add Money
        </Link>

        {/* Debit card visual */}
        <div className="mt-5 rounded-2xl bg-[var(--pp-blue-dark)] p-5 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <PayPalLogo className="h-6 w-6" />
            <span className="text-white font-semibold text-[18px]">Debit Card</span>
          </div>

          {/* Big stylised P */}
          <div className="flex justify-center -mt-1">
            <BigP />
          </div>

          <div className="flex items-end justify-between mt-2">
            <p className="text-white font-semibold text-[17px]">
              Use your balance anywhere.
            </p>
            {/* Mastercard logo */}
            <div className="relative h-7 w-12 shrink-0">
              <span
                className="absolute left-0 top-0 h-7 w-7 rounded-full"
                style={{ background: "var(--pp-mc-red)" }}
              />
              <span
                className="absolute right-0 top-0 h-7 w-7 rounded-full mix-blend-multiply"
                style={{ background: "var(--pp-mc-yellow)" }}
              />
            </div>
          </div>
        </div>

        {/* Get a PayPal Debit Card */}
        <button className="mt-5 w-full rounded-full bg-[var(--pp-yellow)] py-4 text-[var(--pp-text)] text-[16px] font-semibold">
          Get a PayPal Debit Card
        </button>

        {/* Refund banner */}
        <div className="mt-5 rounded-2xl bg-white border border-[color:var(--border)] p-5">
          <p className="text-[17px] font-semibold text-[var(--pp-text)] leading-snug">
            Get your federal tax<br />refund up to 5 days early*
          </p>
          <p className="mt-2 text-[14px] text-[var(--pp-text-muted)]">
            Use PayPal Direct Deposit for
          </p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

function BigP() {
  return (
    <svg viewBox="0 0 200 200" className="h-40 w-40">
      <path
        fill="#5BC0EB"
        d="M50 25h70c30 0 48 18 42 48-6 30-30 47-58 47h-22c-4 0-7 3-8 7l-9 45c-1 4-5 7-9 7H30c-3 0-5-2-4-5L46 32c0-4 2-7 4-7z"
      />
      <path
        fill="#FFC439"
        d="M75 55h60c25 0 40 15 35 40-5 25-25 40-50 40h-19c-4 0-7 3-8 7l-7 35c-1 3-3 5-6 5H62c-3 0-5-2-4-5l13-115c0-4 2-7 4-7z"
      />
    </svg>
  );
}
