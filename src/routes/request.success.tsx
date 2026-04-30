import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { RequireAuth } from "@/auth/RequireAuth";

type Search = { to: string; amount: string };

export const Route = createFileRoute("/request/success")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    to: typeof s.to === "string" ? s.to : "",
    amount: typeof s.amount === "string" ? s.amount : "0",
  }),
  component: SuccessRoute,
  head: () => ({
    meta: [{ title: "Request sent — PayPal" }],
  }),
});

function fmtUSD(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function SuccessRoute() {
  return (
    <RequireAuth>
      <SuccessPage />
    </RequireAuth>
  );
}

function SuccessPage() {
  const navigate = useNavigate();
  const { to, amount } = useSearch({ from: "/request/success" });
  const n = Number.parseFloat(amount) || 0;

  return (
    <div className="min-h-screen flex flex-col bg-white px-6 pt-20 pb-10">
      <h1 className="text-[28px] font-bold text-center leading-tight text-[var(--pp-text)] break-words">
        You requested {fmtUSD(n)} from {to}
      </h1>
      <p className="mt-6 text-center text-[14px] text-[var(--pp-text-muted)] leading-relaxed">
        We'll let {to} know right away that you requested money. You can see the details in your
        Activity in case you need them later.
      </p>

      <div className="flex-1" />

      <button
        type="button"
        onClick={() => navigate({ to: "/" })}
        className="w-full rounded-full bg-[var(--pp-blue-dark)] py-4 text-[17px] font-bold text-white"
      >
        Done
      </button>
      <Link
        to="/request"
        className="mt-5 text-center text-[15px] font-bold text-[var(--pp-blue)]"
      >
        New Request
      </Link>
    </div>
  );
}
