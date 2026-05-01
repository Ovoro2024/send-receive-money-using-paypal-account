import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, X, Delete, ChevronRight } from "lucide-react";
import { RequireAuth } from "@/auth/RequireAuth";
import { useBalance } from "@/auth/useBalance";
import { PayPalLogo } from "@/components/paypal/PayPalLogo";

type Search = { to: string };

export const Route = createFileRoute("/send/amount")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    to: typeof s.to === "string" ? s.to : "",
  }),
  component: SendAmountRoute,
  head: () => ({
    meta: [
      { title: "Send money — PayPal" },
      { name: "description", content: "Choose an amount to send." },
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
  if (!raw) return "0";
  const [intPart, decPart] = raw.split(".");
  const intNum = Number.parseInt(intPart || "0", 10);
  const intFmt = Number.isFinite(intNum) ? intNum.toLocaleString("en-US") : "0";
  if (decPart === undefined) return intFmt;
  return `${intFmt}.${decPart}`;
}

function SendAmountRoute() {
  return (
    <RequireAuth>
      <SendAmountPage />
    </RequireAuth>
  );
}

function SendAmountPage() {
  const navigate = useNavigate();
  const { to } = useSearch({ from: "/send/amount" });
  const [raw, setRaw] = useState("0");
  const [showReview, setShowReview] = useState(false);
  const [note, setNote] = useState("");

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
      if (cur.includes(".")) {
        const [, dec = ""] = cur.split(".");
        if (dec.length >= 2) return cur;
      }
      if (cur === "0") return k;
      if (cur.replace(".", "").length >= 12) return cur;
      return cur + k;
    });
  };

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
      to: "/send/success",
      search: { to, amount: numeric.toFixed(2) },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="relative flex items-center justify-center px-4 pt-4 pb-3">
        <Link to="/send" className="absolute left-3 top-4 p-1 text-[var(--pp-text)]" aria-label="Back">
          <ArrowLeft size={24} strokeWidth={2.25} />
        </Link>
        <h1 className="text-[16px] font-semibold text-[var(--pp-text)]">Send money</h1>
      </header>

      <div className="px-5 pt-2">
        <div className="h-12 w-12 rounded-full bg-[var(--pp-blue-dark)] flex items-center justify-center text-white">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5z" />
          </svg>
        </div>
        <p className="mt-3 text-[22px] font-bold leading-tight text-[var(--pp-text)] break-words">
          To {to || "recipient"}
        </p>

        <div className="mt-5 flex items-baseline justify-between gap-3">
          <p className={`tabular-nums font-semibold text-[var(--pp-text)] leading-none ${sizeClass}`}>
            {display}
          </p>
          <span className="text-[15px] font-bold text-[var(--pp-blue)]">USD</span>
        </div>
      </div>

      <div className="flex-1" />

      <div className="px-4 pb-3 flex items-center gap-3">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What's it for?"
          className="flex-1 h-12 rounded-full bg-[#fdf3d9] px-4 text-[15px] text-[var(--pp-text)] placeholder:text-[var(--pp-text-muted)] outline-none"
        />
        <button
          type="button"
          disabled={!canNext}
          onClick={() => setShowReview(true)}
          className="h-12 px-7 rounded-full bg-[var(--pp-yellow)] text-[var(--pp-text)] text-[15px] font-bold disabled:opacity-50"
        >
          Next
        </button>
      </div>

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
          note={note}
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
  note,
  onClose,
  onConfirm,
}: {
  amount: number;
  to: string;
  note: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { balance } = useBalance();
  const [paymentType, setPaymentType] = useState<"friends" | "goods">("friends");

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative w-full bg-white rounded-t-2xl px-5 pt-4 pb-6 shadow-2xl animate-in slide-in-from-bottom duration-200 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <span className="w-6" />
          <h3 className="text-[16px] font-semibold text-[var(--pp-text)]">Review</h3>
          <button onClick={onClose} aria-label="Close" className="text-[var(--pp-text)]">
            <X size={22} />
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[36px] font-bold tabular-nums text-[var(--pp-text)] leading-none">
            {fmtUSD(amount)}
          </p>
          <p className="mt-2 text-[14px] text-[var(--pp-text-muted)]">
            To <span className="font-semibold text-[var(--pp-text)]">{to}</span>
          </p>
          {note && (
            <p className="mt-1 text-[13px] text-[var(--pp-text-muted)] truncate">"{note}"</p>
          )}
        </div>

        {/* Payment method */}
        <div className="mt-5 rounded-xl border border-[color:var(--border)] divide-y divide-[color:var(--border)]">
          <button type="button" className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
            <PayPalLogo className="h-6 w-6" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-[var(--pp-text-muted)]">Pay with</p>
              <p className="text-[15px] font-semibold text-[var(--pp-text)] truncate">
                PayPal balance · {balance === null ? "—" : fmtUSD(balance)}
              </p>
            </div>
            <ChevronRight size={18} className="text-[var(--pp-text-muted)]" />
          </button>
          <button
            type="button"
            onClick={() =>
              setPaymentType((p) => (p === "friends" ? "goods" : "friends"))
            }
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
          >
            <div className="h-6 w-6 rounded-full bg-[var(--pp-blue-light)]/15 flex items-center justify-center text-[var(--pp-blue)] text-[13px] font-bold">
              i
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-[var(--pp-text-muted)]">Sending to</p>
              <p className="text-[15px] font-semibold text-[var(--pp-text)] truncate">
                {paymentType === "friends" ? "Friends and family" : "Goods and services"}
              </p>
            </div>
            <ChevronRight size={18} className="text-[var(--pp-text-muted)]" />
          </button>
        </div>

        <p className="mt-3 text-[12px] text-[var(--pp-text-muted)] leading-relaxed">
          {paymentType === "friends"
            ? "No fees apply. Payments are not protected by Purchase Protection."
            : "Buyer protection applies. Seller may pay a small fee."}
        </p>

        <button
          type="button"
          onClick={onConfirm}
          className="mt-5 w-full rounded-full bg-[var(--pp-yellow)] py-4 text-[17px] font-bold text-[var(--pp-text)]"
        >
          Send {fmtUSD(amount)}
        </button>
      </div>
    </div>
  );
}
