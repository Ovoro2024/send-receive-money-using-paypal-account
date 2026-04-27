import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { X } from "lucide-react";
import { PayPalLogo } from "@/components/paypal/PayPalLogo";

type Search = { amount?: string };

export const Route = createFileRoute("/security-check/confirmed")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    amount: typeof s.amount === "string" ? s.amount : "10",
  }),
  component: ConfirmedPage,
  head: () => ({
    meta: [
      { title: "Identity confirmed — PayPal" },
      { name: "description", content: "Identity confirmed. Redirecting." },
    ],
  }),
});

function ConfirmedPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/add-money/success" }), 1800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="relative flex items-center justify-center px-4 pt-5 pb-4">
        <Link to="/finances" className="absolute left-4 top-5 text-[var(--pp-text)]">
          <X size={24} strokeWidth={2.25} />
        </Link>
        <h1 className="text-[15px] font-semibold text-[var(--pp-text)]">PayPal</h1>
      </header>

      <main className="flex-1 flex flex-col items-center px-7 pt-16">
        <SuccessCheck />
        <h2 className="mt-6 text-[26px] font-semibold text-[var(--pp-text)]">
          Identity confirmed!
        </h2>
        <p className="mt-2 text-[15px] text-[var(--pp-text-muted)]">Redirecting...</p>

        <div className="flex-1" />

        <div className="pb-8">
          <PayPalLogo className="h-8 w-8" />
        </div>

        <div className="flex gap-5 pb-5 text-[12px] text-[var(--pp-text-muted)]">
          <span>Contact Us</span>
          <span>Privacy</span>
          <span>Legal</span>
          <span>Worldwide</span>
        </div>
      </main>
    </div>
  );
}

function SuccessCheck() {
  return (
    <div className="relative">
      <div className="h-24 w-24 rounded-full bg-[oklch(0.55_0.12_155)] flex items-center justify-center shadow-[0_8px_20px_-8px_oklch(0.55_0.12_155/0.5)]">
        <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>
    </div>
  );
}
