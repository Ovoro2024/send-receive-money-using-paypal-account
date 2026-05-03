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
  const firstName = (to || "them").split(/\s|@/)[0];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div
        className="flex items-center justify-center pt-10 pb-6"
        style={{ background: "oklch(0.32 0.18 295)", minHeight: "55vh" }}
      >
        <div className="text-[200px] leading-none">✌️</div>
      </div>

      <div className="flex-1 px-6 pt-8 pb-8 flex flex-col">
        <h1 className="text-[24px] font-bold text-center leading-tight text-[var(--pp-text)]">
          You requested {fmtUSD(n)}
          <br />
          from {to || "recipient"}
        </h1>
        <p className="mt-5 text-center text-[14px] text-[var(--pp-text-muted)] leading-relaxed">
          We'll let {firstName} know right away that you requested money. You can see the
          details in your Activity in case you need them later.
        </p>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="mx-auto px-12 rounded-full bg-[var(--pp-blue-dark)] py-3.5 text-[16px] font-bold text-white"
        >
          Done
        </button>
        <Link to="/payments" className="mt-5 text-center text-[15px] font-bold text-[var(--pp-blue-dark)]">
          New Request
        </Link>
      </div>
    </div>
  );
}
