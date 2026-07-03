import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Building2, CreditCard, Check, Search, Lock } from "lucide-react";
import { RequireAuth } from "@/auth/RequireAuth";
import { useLinkedAccounts } from "@/auth/useLinkedAccounts";

type Search = { returnTo?: string };

export const Route = createFileRoute("/link-account")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    returnTo: typeof s.returnTo === "string" ? s.returnTo : undefined,
  }),
  component: () => (
    <RequireAuth>
      <LinkAccountPage />
    </RequireAuth>
  ),
  head: () => ({
    meta: [
      { title: "Link a bank or card — PayPal" },
      { name: "description", content: "Link a bank account or debit/credit card to PayPal." },
    ],
  }),
});

const POPULAR_BANKS = [
  "Chase",
  "Bank of America",
  "Wells Fargo",
  "Citibank",
  "Capital One",
  "US Bank",
  "PNC Bank",
  "TD Bank",
  "Truist",
  "SoFi",
];

type Stage = "choose" | "bankList" | "bankLogin" | "cardForm" | "success";

function LinkAccountPage() {
  const navigate = useNavigate();
  const { returnTo } = useSearch({ from: "/link-account" });
  const { link } = useLinkedAccounts();
  const [stage, setStage] = useState<Stage>("choose");
  const [query, setQuery] = useState("");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // card form
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [zip, setZip] = useState("");

  const filtered = POPULAR_BANKS.filter((b) =>
    b.toLowerCase().includes(query.toLowerCase()),
  );

  const back = () => {
    if (stage === "choose") navigate({ to: returnTo ?? "/wallet" });
    else if (stage === "bankList") setStage("choose");
    else if (stage === "bankLogin") setStage("bankList");
    else if (stage === "cardForm") setStage("choose");
    else navigate({ to: returnTo ?? "/wallet" });
  };

  const confirmBank = async () => {
    if (!selectedBank || !username) return;
    setBusy(true);
    const last4 = String(Math.floor(1000 + Math.random() * 9000));
    await link({
      kind: "bank",
      institution: selectedBank.toUpperCase(),
      account_type: "Checking",
      last4,
      brand: null,
    });
    setBusy(false);
    setStage("success");
  };

  const confirmCard = async () => {
    const digits = cardNumber.replace(/\s+/g, "");
    if (digits.length < 12 || !expiry || cvv.length < 3 || zip.length < 5) return;
    setBusy(true);
    const first = digits[0];
    const brand =
      first === "4" ? "Visa" : first === "5" ? "Mastercard" : first === "3" ? "Amex" : "Card";
    await link({
      kind: "card",
      institution: brand,
      account_type: "Debit",
      last4: digits.slice(-4),
      brand,
    });
    setBusy(false);
    setStage("success");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="relative flex items-center justify-center px-4 pt-5 pb-4 border-b border-[color:var(--border)]">
        <button onClick={back} aria-label="Back" className="absolute left-4 top-5 text-[var(--pp-text)]">
          <ArrowLeft size={24} strokeWidth={2.25} />
        </button>
        <h1 className="text-[15px] font-semibold text-[var(--pp-text)]">
          {stage === "choose"
            ? "Link a bank or card"
            : stage === "bankList"
              ? "Choose your bank"
              : stage === "bankLogin"
                ? selectedBank
                : stage === "cardForm"
                  ? "Add a debit or credit card"
                  : "Linked"}
        </h1>
      </header>

      {stage === "choose" && (
        <main className="flex-1 px-5 pt-6">
          <p className="text-[15px] text-[var(--pp-text-muted)] mb-5">
            Choose how you'd like to fund your PayPal account.
          </p>
          <ChooseRow
            icon={<Building2 className="h-6 w-6 text-[var(--pp-blue-dark)]" />}
            title="Link a bank"
            subtitle="Instant with your online banking"
            onClick={() => setStage("bankList")}
          />
          <ChooseRow
            icon={<CreditCard className="h-6 w-6 text-[var(--pp-blue-dark)]" />}
            title="Debit or credit card"
            subtitle="Add card number, expiry and CVV"
            onClick={() => setStage("cardForm")}
          />
          <p className="mt-8 flex items-start gap-2 text-[12px] text-[var(--pp-text-muted)] leading-relaxed">
            <Lock size={14} className="mt-0.5 shrink-0" />
            Your information is encrypted. We never share your bank credentials.
          </p>
        </main>
      )}

      {stage === "bankList" && (
        <main className="flex-1 px-5 pt-4">
          <div className="flex items-center gap-2 h-11 rounded-full bg-[var(--pp-bg)] px-4">
            <Search size={18} className="text-[var(--pp-text-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for your bank"
              className="flex-1 bg-transparent outline-none text-[15px]"
            />
          </div>
          <ul className="mt-3 divide-y divide-[color:var(--border)]">
            {filtered.map((b) => (
              <li key={b}>
                <button
                  onClick={() => {
                    setSelectedBank(b);
                    setStage("bankLogin");
                  }}
                  className="w-full flex items-center gap-3 py-3.5 text-left"
                >
                  <div className="h-9 w-9 rounded-md bg-[var(--pp-bg)] flex items-center justify-center text-[var(--pp-blue-dark)]">
                    <Building2 size={20} />
                  </div>
                  <span className="text-[15px] font-medium text-[var(--pp-text)]">{b}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="py-6 text-center text-[14px] text-[var(--pp-text-muted)]">
                No banks match "{query}"
              </li>
            )}
          </ul>
        </main>
      )}

      {stage === "bankLogin" && selectedBank && (
        <main className="flex-1 px-5 pt-6">
          <p className="text-[15px] text-[var(--pp-text-muted)] mb-5">
            Sign in with your {selectedBank} credentials. We use bank-level encryption.
          </p>
          <label className="block text-[13px] font-semibold text-[var(--pp-text)] mb-1">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-12 rounded-md border border-[color:var(--border)] px-4 text-[15px] mb-4 outline-none focus:border-[var(--pp-blue)]"
          />
          <label className="block text-[13px] font-semibold text-[var(--pp-text)] mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 rounded-md border border-[color:var(--border)] px-4 text-[15px] outline-none focus:border-[var(--pp-blue)]"
          />
          <button
            onClick={confirmBank}
            disabled={busy || !username || !password}
            className="mt-8 w-full rounded-full bg-[var(--pp-blue-dark)] py-4 text-white text-[16px] font-bold disabled:opacity-50"
          >
            {busy ? "Linking…" : "Agree and link"}
          </button>
          <p className="mt-4 text-[12px] text-[var(--pp-text-muted)] leading-relaxed">
            By tapping Agree and link, you authorize PayPal to link this account and initiate future
            transfers between your bank and PayPal.
          </p>
        </main>
      )}

      {stage === "cardForm" && (
        <main className="flex-1 px-5 pt-6">
          <label className="block text-[13px] font-semibold text-[var(--pp-text)] mb-1">
            Card number
          </label>
          <input
            inputMode="numeric"
            value={cardNumber}
            onChange={(e) =>
              setCardNumber(
                e.target.value
                  .replace(/[^\d]/g, "")
                  .slice(0, 16)
                  .replace(/(\d{4})(?=\d)/g, "$1 "),
              )
            }
            placeholder="1234 5678 9012 3456"
            className="w-full h-12 rounded-md border border-[color:var(--border)] px-4 text-[15px] mb-4 outline-none focus:border-[var(--pp-blue)]"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-[var(--pp-text)] mb-1">
                Expiry
              </label>
              <input
                inputMode="numeric"
                value={expiry}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
                  setExpiry(v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v);
                }}
                placeholder="MM/YY"
                className="w-full h-12 rounded-md border border-[color:var(--border)] px-4 text-[15px] outline-none focus:border-[var(--pp-blue)]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[var(--pp-text)] mb-1">
                CVV
              </label>
              <input
                inputMode="numeric"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
                placeholder="123"
                className="w-full h-12 rounded-md border border-[color:var(--border)] px-4 text-[15px] outline-none focus:border-[var(--pp-blue)]"
              />
            </div>
          </div>
          <label className="mt-4 block text-[13px] font-semibold text-[var(--pp-text)] mb-1">
            Billing ZIP code
          </label>
          <input
            inputMode="numeric"
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/[^\d]/g, "").slice(0, 5))}
            placeholder="10001"
            className="w-full h-12 rounded-md border border-[color:var(--border)] px-4 text-[15px] outline-none focus:border-[var(--pp-blue)]"
          />
          <button
            onClick={confirmCard}
            disabled={busy}
            className="mt-8 w-full rounded-full bg-[var(--pp-blue-dark)] py-4 text-white text-[16px] font-bold disabled:opacity-50"
          >
            {busy ? "Linking…" : "Link card"}
          </button>
        </main>
      )}

      {stage === "success" && (
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="h-20 w-20 rounded-full bg-[var(--pp-success)] flex items-center justify-center mb-6">
            <Check className="h-10 w-10 text-white" strokeWidth={3} />
          </div>
          <h2 className="text-[22px] font-bold text-[var(--pp-text)]">You're all linked</h2>
          <p className="mt-2 text-[15px] text-[var(--pp-text-muted)]">
            You can now use this account to add or send money.
          </p>
          <Link
            to={returnTo ?? "/wallet"}
            className="mt-10 w-full rounded-full bg-[var(--pp-blue-dark)] py-4 text-white text-[16px] font-bold"
          >
            Done
          </Link>
        </main>
      )}
    </div>
  );
}

function ChooseRow({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 py-4 border-b border-[color:var(--border)] text-left"
    >
      <div className="h-11 w-11 rounded-full bg-[var(--pp-bg)] flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[16px] font-semibold text-[var(--pp-text)]">{title}</p>
        <p className="text-[13px] text-[var(--pp-text-muted)]">{subtitle}</p>
      </div>
      <ArrowLeft size={18} className="rotate-180 text-[var(--pp-text-muted)]" />
    </button>
  );
}
