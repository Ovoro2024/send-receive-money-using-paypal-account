import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ScanLine, FileText } from "lucide-react";
import { RequireAuth } from "@/auth/RequireAuth";

export const Route = createFileRoute("/send/")({
  component: SendRoute,
  head: () => ({
    meta: [
      { title: "Send money — PayPal" },
      { name: "description", content: "Send money to a friend, family member or business." },
    ],
  }),
});

type Contact = {
  name: string;
  handle?: string;
  kind: "person" | "business";
  color: string;
};

const SUGGESTED: Contact[] = [
  { name: "Valmir Muja", handle: "@VMuja", kind: "person", color: "bg-emerald-500" },
  { name: "Olena Ivanova", kind: "person", color: "bg-purple-500" },
  { name: "Patedia Management", handle: "@patedia", kind: "business", color: "bg-[var(--pp-blue-dark)]" },
  { name: "Onlyner B.V.", handle: "@serpchampion", kind: "business", color: "bg-[var(--pp-blue-dark)]" },
];

const CONTACTS: Contact[] = [
  { name: "Aaron Garrett", kind: "business", color: "bg-[var(--pp-blue-dark)]" },
  { name: "Aaron Nace", handle: "@aknacer", kind: "person", color: "bg-emerald-500" },
  { name: "Abby Murdoch", kind: "person", color: "bg-[var(--pp-blue-dark)]" },
  { name: "Adam Brown", kind: "person", color: "bg-orange-500" },
  { name: "Alex Carter", handle: "@alexc", kind: "person", color: "bg-pink-500" },
  { name: "Bella Smith", kind: "person", color: "bg-indigo-500" },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

function isEmailLike(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function isPhone(v: string) {
  const digits = v.replace(/[\s\-().]/g, "");
  return /^\+?\d{7,15}$/.test(digits);
}

function recipientKind(v: string): "email" | "phone" | "username" | "name" {
  if (isEmailLike(v)) return "email";
  if (isPhone(v)) return "phone";
  if (v.startsWith("@")) return "username";
  return "name";
}

function recipientSubtitle(v: string): string {
  const k = recipientKind(v);
  if (k === "email") return v;
  if (k === "phone") return `Mobile ${v}`;
  if (k === "username") return v;
  return "New recipient";
}

function SendRoute() {
  return (
    <RequireAuth>
      <SendPage />
    </RequireAuth>
  );
}

function SendPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const trimmed = query.trim();

  const filtered = useMemo(() => {
    if (!trimmed) return null;
    const q = trimmed.toLowerCase();
    return [...SUGGESTED, ...CONTACTS].filter(
      (c) => c.name.toLowerCase().includes(q) || c.handle?.toLowerCase().includes(q),
    );
  }, [trimmed]);

  const choose = (recipient: string) => {
    navigate({ to: "/send/amount", search: { to: recipient } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="flex items-center gap-3 px-3 pt-4 pb-3">
        <Link to="/" className="text-[var(--pp-text)] shrink-0 p-1" aria-label="Back">
          <ArrowLeft size={24} strokeWidth={2.25} />
        </Link>
        <div className="flex-1 relative">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && trimmed) choose(trimmed);
            }}
            placeholder="Name, username, email, mobile"
            className="w-full h-11 rounded-full border-2 border-[var(--pp-blue)] bg-white px-4 text-[14px] text-[var(--pp-text)] placeholder:text-[var(--pp-text-muted)] outline-none"
          />
        </div>
        <button aria-label="Scan" className="text-[var(--pp-blue)] shrink-0 p-1">
          <ScanLine size={22} strokeWidth={2.25} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-6">
        <button
          type="button"
          className="mt-1 w-full flex items-center gap-3 rounded-xl border border-[color:var(--border)] bg-white px-4 py-3.5 text-left"
        >
          <FileText size={22} className="text-[var(--pp-blue-dark)]" strokeWidth={2.25} />
          <span className="text-[16px] font-semibold text-[var(--pp-text)]">
            Send an invoice to get paid
          </span>
        </button>

        {trimmed && (
          <button
            type="button"
            onClick={() => choose(trimmed)}
            className="mt-4 w-full flex items-center gap-3 rounded-xl bg-[var(--pp-bg)] px-3 py-3 text-left"
          >
            <Avatar
              text={(trimmed.replace(/^@/, "")[0] ?? "?").toUpperCase()}
              className="bg-[var(--pp-blue-dark)]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-[var(--pp-text)] break-all">
                Send to {trimmed}
              </p>
              <p className="text-[13px] text-[var(--pp-text-muted)] break-all">
                {recipientSubtitle(trimmed)}
              </p>
            </div>
          </button>
        )}

        {filtered === null ? (
          <>
            <SectionTitle>Suggested</SectionTitle>
            <ul className="mt-1">
              {SUGGESTED.map((c, i) => (
                <ContactRow key={`s-${i}`} c={c} onSelect={() => choose(c.handle ?? c.name)} />
              ))}
            </ul>
            <SectionTitle>Your contacts</SectionTitle>
            <ul className="mt-1">
              {CONTACTS.map((c, i) => (
                <ContactRow key={`c-${i}`} c={c} onSelect={() => choose(c.handle ?? c.name)} />
              ))}
            </ul>
          </>
        ) : (
          <>
            <SectionTitle>Results</SectionTitle>
            {filtered.length === 0 ? (
              <p className="mt-3 text-[14px] text-[var(--pp-text-muted)]">
                No matches. Type a full email to continue.
              </p>
            ) : (
              <ul className="mt-1">
                {filtered.map((c, i) => (
                  <ContactRow key={`f-${i}`} c={c} onSelect={() => choose(c.handle ?? c.name)} />
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-5 text-[15px] font-medium text-[var(--pp-text-muted)]">{children}</h2>
  );
}

function Avatar({ text, className }: { text: string; className?: string }) {
  return (
    <div
      className={`h-11 w-11 shrink-0 rounded-full flex items-center justify-center text-white text-[14px] font-bold ${className ?? ""}`}
    >
      {text}
    </div>
  );
}

function ContactRow({ c, onSelect }: { c: Contact; onSelect: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className="w-full flex items-center gap-3 py-2.5 text-left active:bg-black/5 rounded-lg px-1"
      >
        {c.kind === "business" ? (
          <div className={`h-11 w-11 shrink-0 rounded-full flex items-center justify-center ${c.color}`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
              <path d="M3 9l1.5-4h15L21 9v2a2 2 0 1 1-4 0 2 2 0 1 1-4 0 2 2 0 1 1-4 0 2 2 0 1 1-4 0 2 2 0 1 1-4 0V9zm2 4.5V20h6v-5h2v5h6v-6.5a4 4 0 0 1-3-1.2 4 4 0 0 1-6 0 4 4 0 0 1-5 .2z" />
            </svg>
          </div>
        ) : (
          <Avatar text={initials(c.name)} className={c.color} />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-bold text-[var(--pp-text)] truncate">{c.name}</p>
          {c.handle && (
            <p className="text-[13px] text-[var(--pp-text-muted)] truncate">{c.handle}</p>
          )}
        </div>
        <span className="text-[var(--pp-text-muted)] text-xl leading-none">⋮</span>
      </button>
    </li>
  );
}
