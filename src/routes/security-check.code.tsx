import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PayPalLogo } from "@/components/paypal/PayPalLogo";

type Speed = "debit" | "bank";
type Search = { amount?: string; speed?: Speed };

export const Route = createFileRoute("/security-check/code")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    amount: typeof s.amount === "string" ? s.amount : "10",
    speed: s.speed === "debit" || s.speed === "bank" ? s.speed : "bank",
  }),
  component: ConfirmCodePage,
  head: () => ({
    meta: [
      { title: "Confirm security code — PayPal" },
      { name: "description", content: "Enter the security code we just texted you." },
    ],
  }),
});

const VALID_CODE = "565656";

function ConfirmCodePage() {
  const navigate = useNavigate();
  const { amount = "10", speed = "bank" } = Route.useSearch();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isComplete = code.length === 6;
  const isValid = code === VALID_CODE;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isComplete) {
      setError(false);
      return;
    }
    if (isValid) {
      const t = setTimeout(
        () => navigate({ to: "/security-check/confirmed", search: { amount, speed } }),
        350,
      );
      return () => clearTimeout(t);
    }
    setError(true);
  }, [isComplete, isValid, navigate, amount]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="relative flex items-center justify-center px-4 pt-5 pb-4">
        <Link to="/security-check" className="absolute left-4 top-5 text-[var(--pp-text)]">
          <ArrowLeft size={24} strokeWidth={2.25} />
        </Link>
        <h1 className="text-[15px] font-semibold text-[var(--pp-text)]">PayPal</h1>
      </header>

      <main className="flex-1 flex flex-col px-7 pt-6">
        <div className="flex justify-center">
          <PayPalLogo className="h-14 w-14" />
        </div>

        <h2 className="mt-6 text-center text-[28px] font-semibold text-[var(--pp-text)]">
          Confirm security code
        </h2>

        <p className="mt-3 text-center text-[15px] text-[var(--pp-text-muted)]">
          For your security, we just texted you a code. Please enter it below.
        </p>

        <div
          className="mt-10 flex justify-center gap-2"
          onClick={() => inputRef.current?.focus()}
        >
          {Array.from({ length: 6 }).map((_, i) => {
            const char = code[i] ?? "";
            const isActive = i === code.length;
            return (
              <div
                key={i}
                className={
                  "h-12 w-11 rounded-md border bg-white flex items-center justify-center text-[20px] font-semibold text-[var(--pp-text)] tabular-nums " +
                  (error
                    ? "border-[oklch(0.55_0.22_25)] ring-1 ring-[oklch(0.55_0.22_25)]"
                    : isActive
                      ? "border-[var(--pp-blue)] ring-1 ring-[var(--pp-blue)]"
                      : "border-[color:var(--border)]")
                }
              >
                {char}
              </div>
            );
          })}
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            aria-label="Security code"
            className="absolute opacity-0 pointer-events-none"
          />
        </div>

        {error && (
          <p className="mt-4 text-center text-[14px] text-[oklch(0.55_0.22_25)]">
            Incorrect code. Please try again.
          </p>
        )}

        <button className="mt-8 mx-auto text-[15px] font-semibold text-[var(--pp-link)]">
          Resend code
        </button>

        <div className="flex-1" />

        <button
          disabled={!isValid}
          onClick={() => navigate({ to: "/security-check/confirmed", search: { amount, speed } })}
          className="mb-6 w-full rounded-full bg-[var(--pp-blue-dark)] py-4 text-white text-[17px] font-semibold disabled:opacity-50"
        >
          Continue
        </button>
      </main>
    </div>
  );
}
