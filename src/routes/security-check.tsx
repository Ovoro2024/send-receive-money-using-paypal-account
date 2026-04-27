import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { PayPalLogo } from "@/components/paypal/PayPalLogo";

type Search = { amount?: string };

export const Route = createFileRoute("/security-check")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    amount: typeof s.amount === "string" ? s.amount : "10",
  }),
  component: SecurityCheckPage,
  head: () => ({
    meta: [
      { title: "Quick security check — PayPal" },
      { name: "description", content: "Confirm your identity to continue." },
    ],
  }),
});

function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6, 10);
  if (digits.length <= 3) return a;
  if (digits.length <= 6) return `(${a}) ${b}`;
  return `(${a}) ${b}-${c}`;
}

function SecurityCheckPage() {
  const navigate = useNavigate();
  const { amount = "10" } = Route.useSearch();
  const [phone, setPhone] = useState("");
  const digits = phone.replace(/\D/g, "");
  const isValid = digits.length === 10;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="relative flex items-center justify-center px-4 pt-5 pb-4">
        <Link to="/add-money/method" className="absolute left-4 top-5 text-[var(--pp-text)]">
          <X size={24} strokeWidth={2.25} />
        </Link>
        <h1 className="text-[15px] font-semibold text-[var(--pp-text)]">PayPal</h1>
      </header>

      <main className="flex-1 flex flex-col px-7 pt-6">
        <div className="flex justify-center">
          <PayPalLogo className="h-14 w-14" />
        </div>

        <h2 className="mt-6 text-center text-[28px] font-semibold text-[var(--pp-text)]">
          Quick security check
        </h2>

        <p className="mt-3 text-center text-[15px] text-[var(--pp-text-muted)]">
          We just need some additional info to confirm it's you.
        </p>

        <div className="mt-10">
          <label className="flex items-center gap-3">
            <span className="h-5 w-5 rounded-full border-2 border-[var(--pp-blue)] flex items-center justify-center">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--pp-blue)]" />
            </span>
            <span className="text-[16px] font-medium text-[var(--pp-text)]">
              Receive a text
            </span>
          </label>

          <div className="mt-4 ml-8 flex items-center gap-3">
            <span className="text-[15px] text-[var(--pp-text-muted)]">Mobile</span>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="(555) 123-4567"
              aria-label="Phone number"
              className="flex-1 h-11 rounded-md border border-[color:var(--border)] bg-white px-3 text-[15px] text-[var(--pp-text)] outline-none focus:border-[var(--pp-blue)] focus:ring-1 focus:ring-[var(--pp-blue)]"
            />
          </div>
        </div>

        <p className="mt-8 text-[14px] leading-relaxed text-[var(--pp-text-muted)]">
          By continuing, you confirm that you are authorized to use this phone number
          and agree to receive text messages to confirm your identity in this session.
          Carrier fees may apply.
        </p>

        <button
          disabled={!isValid}
          onClick={() => navigate({ to: "/security-check/code", search: { amount } })}
          className="mt-8 w-full rounded-full bg-[var(--pp-blue-dark)] py-4 text-white text-[17px] font-semibold disabled:opacity-50"
        >
          Next
        </button>
      </main>
    </div>
  );
}
