import { createFileRoute, Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { PayPalLogo } from "@/components/paypal/PayPalLogo";

export const Route = createFileRoute("/security-check")({
  component: SecurityCheckPage,
  head: () => ({
    meta: [
      { title: "Quick security check — PayPal" },
      { name: "description", content: "Confirm your identity to continue." },
    ],
  }),
});

function SecurityCheckPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="relative flex items-center justify-center px-4 pt-5 pb-4">
        <Link to="/add-money/method" className="absolute left-4 top-5 text-[var(--pp-text)]">
          <X size={24} strokeWidth={2.25} />
        </Link>
        <h1 className="text-[15px] font-semibold text-[var(--pp-text)]">PayPal</h1>
      </header>

      <main className="flex-1 flex flex-col px-7 pt-6">
        {/* Logo */}
        <div className="flex justify-center">
          <PayPalLogo className="h-14 w-14" />
        </div>

        {/* Title */}
        <h2 className="mt-6 text-center text-[28px] font-semibold text-[var(--pp-text)]">
          Quick security check
        </h2>

        {/* Subtitle */}
        <p className="mt-3 text-center text-[15px] text-[var(--pp-text-muted)]">
          We just need some additional info to confirm it's you.
        </p>

        {/* Receive a text option */}
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
            <div
              aria-label="Phone number"
              className="flex-1 h-7 rounded-sm"
              style={{ background: "var(--pp-blue)" }}
            />
          </div>
        </div>

        {/* Terms */}
        <p className="mt-8 text-[14px] leading-relaxed text-[var(--pp-text-muted)]">
          By continuing, you confirm that you are authorized to use this phone number
          and agree to receive text messages to confirm your identity in this session.
          Carrier fees may apply.
        </p>

        {/* Next button */}
        <button className="mt-8 w-full rounded-full bg-[var(--pp-blue-dark)] py-4 text-white text-[17px] font-semibold">
          Next
        </button>
      </main>
    </div>
  );
}
