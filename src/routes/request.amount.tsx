import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, X, Delete } from "lucide-react";
import { RequireAuth } from "@/auth/RequireAuth";

type Search = { to: string };

export const Route = createFileRoute("/request/amount")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    to: typeof s.to === "string" ? s.to : "",
  }),
  component: RequestAmountRoute,
  head: () => ({
    meta: [
      { title: "Request money — PayPal" },
      { name: "description", content: "Choose an amount to request." },
    ],
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

function fmtAmount(raw: string) {
  // Display raw with thousands separators, preserve trailing dot / decimals
  if (!raw) return "0";
  const [intPart, decPart] = raw.split(".");
  const intNum = Number.parseInt(intPart || "0", 10);
  const intFmt = Number.isFinite(intNum) ? intNum.toLocaleString("en-US") : "0";
  if (decPart === undefined) return intFmt;
  return `${intFmt}.${decPart}`;
}

function RequestAmountRoute() {
  return (
    <RequireAuth>
      <RequestAmountPage />
    </RequireAuth>
  );
}

function RequestAmountPage() {
  const navigate = useNavigate();
  const { to } = useSearch({ from: "/request/amount" });
  const [raw, setRaw] = useState("0");
  const [showReview, setShowReview] = useState(false);
  const [message, setMessage] = useState("");

  const numeric = useMemo(() => {
    const n = Number.parseFloat(raw || "0");
    return Number.isFinite(n) ? n : 0;
  }, [raw]);

  const canNext = numeric > 0;

  const press = (k: string) => {
    setRaw((cur) => {
      if (k === "back") {
        if (cur.length <= 1) return "0";
        const nxt = cur.slice(0, -1);
        return nxt === "" ? "0" : nxt;
      }
      if (k === ".") {
        if (cur.includes(".")) return cur;
        return cur + ".";
      }
      // digit
      // limit 2 decimals
      if (cur.includes(".")) {
        const [, dec = ""] = cur.split(".");
        if (dec.length >= 2) return cur;
      }
      if (cur === "0") return k;
      // limit length
      if (cur.replace(".", "").length >= 12) return cur;
      return cur + k;
    });
  };

  // Dynamic font size for big numbers
  const display = `$${fmtAmount(raw)}`;
  const sizeClass =
    display.length <= 6
      ? "text-[64px]"
      : display.length <= 9
        ? "text-[52px]"
        : display.length <= 12
          ? "text-[40px]"
          : "text-[32px]";

  const submit = () => {
    navigate({
      to: "/request/success",
      search: { to, amount: numeric.toFixed(2) },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="relative flex items-center justify-center px-4 pt-4 pb-3">
        <Link to="/request" className="absolute left-3 top-4 p-1 text-[var(--pp-text)]" aria-label="Back">
          <ArrowLeft size={24} strokeWidth={2.25} />
        </Link>
        <h1 className="text-[16px] font-semibold text-[var(--pp-text)]">Request money</h1>
      </header>

      <div className="px-5 pt-2">
        <div className="h-12 w-12 rounded-full bg-[var(--pp-blue-dark)] flex items-center justify-center text-white">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5z" />
          </svg>
        </div>
        <p className="mt-3 text-[22px] font-bold leading-tight text-[var(--pp-text)] break-words">
          {to || "recipient"}
        </p>

        <div className="mt-5 flex items-baseline justify-between gap-3">
          <p className={`tabular-nums font-semibold text-[var(--pp-text)] leading-none ${sizeClass}`}>
            {display}
          </p>
          <span className="text-[15px] font-bold text-[var(--pp-blue)]">USD</span>
        </div>
      </div>

      <div className="flex-1" />

      {/* Message + Next */}
      <div className="px-4 pb-3 flex items-center gap-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a message"
          className="flex-1 h-12 rounded-full bg-[#f6ece4] px-4 text-[15px] text-[var(--pp-text)] placeholder:text-[var(--pp-text-muted)] outline-none"
        />
        <button
          type="button"
          disabled={!canNext}
          onClick={() => setShowReview(true)}
          className="h-12 px-7 rounded-full bg-[var(--pp-blue-dark)] text-white text-[15px] font-bold disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Numpad */}
      <div className="bg-[#d8dde6] pt-1.5 pb-2 px-1 grid grid-cols-3 gap-1.5">
        {[
          ["1", ""], ["2", "ABC"], ["3", "DEF"],
          ["4", "GHI"], ["5", "JKL"], ["6", "MNO"],
          ["7", "PQRS"], ["8", "TUV"], ["9", "WXYZ"],
        ].map(([n, sub]) => (
          <NumKey key={n} onPress={() => press(n)}>
            <span className="text-[26px] font-medium text-[var(--pp-text)] leading-none">{n}</span>
            {sub && (
              <span className="text-[10px] tracking-widest text-[var(--pp-text-muted)] mt-0.5">
                {sub}
              </span>
            )}
          </NumKey>
        ))}
        <button
          type="button"
          onClick={() => press(".")}
          className="h-14 flex items-center justify-center text-[28px] text-[var(--pp-text)]"
          aria-label="decimal"
        >
          .
        </button>
        <NumKey onPress={() => press("0")}>
          <span className="text-[26px] font-medium text-[var(--pp-text)] leading-none">0</span>
        </NumKey>
        <button
          type="button"
          onClick={() => press("back")}
          className="h-14 flex items-center justify-center text-[var(--pp-text)]"
          aria-label="backspace"
        >
          <Delete size={24} strokeWidth={2} />
        </button>
      </div>

      {showReview && (
        <ReviewSheet
          amount={numeric}
          to={to}
          onClose={() => setShowReview(false)}
          onConfirm={submit}
        />
      )}
    </div>
  );
}

function NumKey({ children, onPress }: { children: React.ReactNode; onPress: () => void }) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="h-14 rounded-md bg-white shadow-[0_1px_0_rgba(0,0,0,0.18)] flex flex-col items-center justify-center active:bg-[#f0f0f0]"
    >
      {children}
    </button>
  );
}

function ReviewSheet({
  amount,
  to,
  onClose,
  onConfirm,
}: {
  amount: number;
  to: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full bg-white rounded-t-2xl px-5 pt-4 pb-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between">
          <span className="w-6" />
          <h3 className="text-[16px] font-semibold text-[var(--pp-text)]">Review</h3>
          <button onClick={onClose} aria-label="Close" className="text-[var(--pp-text)]">
            <X size={22} />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-[16px] font-bold text-[var(--pp-text)]">Your request</p>
          <p className="text-[16px] font-bold text-[var(--pp-text)]">{fmtUSD(amount)}</p>
        </div>
        <div className="mt-3 flex items-start justify-between gap-4">
          <p className="text-[14px] text-[var(--pp-text-muted)]">From</p>
          <p className="text-[14px] text-[var(--pp-text)] text-right break-all max-w-[70%]">{to}</p>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          className="mt-6 w-full rounded-full bg-[var(--pp-blue-dark)] py-4 text-[17px] font-bold text-white"
        >
          Request {fmtUSD(amount)}
        </button>
      </div>
    </div>
  );
}
