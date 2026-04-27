import { createFileRoute, useNavigate } from "@tanstack/react-router";

type Search = { amount?: string };

function formatCurrency(value: string) {
  const parsed = Number.parseFloat(value);
  const safe = Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe);
}

export const Route = createFileRoute("/add-money/success")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    amount: typeof s.amount === "string" ? s.amount : "10",
  }),
  component: SuccessPage,
  head: () => ({
    meta: [
      { title: "Money added — PayPal" },
      { name: "description", content: "Money successfully added to your balance." },
    ],
  }),
});

function SuccessPage() {
  const { amount = "10" } = Route.useSearch();
  const navigate = useNavigate();
  const formatted = formatCurrency(amount);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 flex flex-col items-center justify-center px-7">
        <div className="h-28 w-28 rounded-full bg-[oklch(0.55_0.12_155)] flex items-center justify-center shadow-[0_10px_24px_-10px_oklch(0.55_0.12_155/0.55)]">
          <svg viewBox="0 0 24 24" className="h-14 w-14" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
        <p className="mt-8 text-center text-[22px] font-semibold text-[var(--pp-text)] leading-snug">
          You added {formatted} to
          <br />
          your balance
        </p>
      </main>

      <div className="px-4 pb-6 pt-2">
        <button
          onClick={() => navigate({ to: "/finances" })}
          className="w-full rounded-full bg-[var(--pp-blue-dark)] py-4 text-white text-[17px] font-bold"
        >
          Done
        </button>
      </div>
    </div>
  );
}
