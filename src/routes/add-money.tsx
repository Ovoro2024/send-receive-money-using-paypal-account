import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Delete } from "lucide-react";

export const Route = createFileRoute("/add-money")({
  component: AddMoneyPage,
  head: () => ({
    meta: [
      { title: "Add money — PayPal" },
      { name: "description", content: "Add money to your PayPal balance." },
    ],
  }),
});

const chips = [10, 25, 50, 100] as const;

function AddMoneyPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>("0");

  const press = (k: string) => {
    setAmount((prev) => {
      if (k === "del") {
        const next = prev.slice(0, -1);
        return next.length === 0 ? "0" : next;
      }
      if (k === ".") {
        if (prev.includes(".")) return prev;
        return prev + ".";
      }
      if (prev === "0") return k;
      return prev + k;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--pp-bg)]">
      {/* Header */}
      <header className="relative flex items-center justify-center px-4 pt-5 pb-4">
        <Link to="/finances" className="absolute left-4 top-5 text-[var(--pp-text)]">
          <ArrowLeft size={24} strokeWidth={2.25} />
        </Link>
        <h1 className="text-[15px] font-semibold text-[var(--pp-text)]">
          Add money to PayPal balance
        </h1>
      </header>

      {/* Amount */}
      <div className="mt-10 flex flex-col items-center">
        <div className="flex items-center text-[44px] font-semibold text-[var(--pp-text)] leading-none">
          <span>$</span>
          <span className="ml-0.5 inline-block w-[2px] h-9 bg-[var(--pp-blue)] animate-pulse" />
          <span>{amount}</span>
        </div>
        <p className="mt-3 text-[14px] text-[var(--pp-text-muted)]">
          PayPal balance: $30.71
        </p>
      </div>

      {/* Quick chips */}
      <div className="mt-10 flex gap-3 overflow-x-auto px-4">
        {chips.map((c) => (
          <button
            key={c}
            onClick={() => {
              setAmount(String(c));
              navigate({ to: "/add-money/method", search: { amount: String(c) } });
            }}
            className="min-w-[78px] flex-1 rounded-xl bg-white border border-[color:var(--border)] py-3 text-[16px] font-medium text-[var(--pp-text)]"
          >
            ${c}
          </button>
        ))}
      </div>

      {/* Spacer pushes keypad down */}
      <div className="flex-1" />

      {/* Next button — appears once a positive amount is entered */}
      {parseFloat(amount) > 0 && (
        <div className="px-4 pb-3">
          <button
            onClick={() =>
              navigate({ to: "/add-money/method", search: { amount } })
            }
            className="w-full rounded-full bg-[var(--pp-blue-dark)] py-4 text-white text-[17px] font-bold"
          >
            Next
          </button>
        </div>
      )}

      {/* Numeric keypad */}
      <div className="bg-[oklch(0.92_0.005_260)] px-2 pt-2 pb-3">
        <div className="grid grid-cols-3 gap-1.5">
          <Key label="1" onPress={() => press("1")} />
          <Key label="2" sub="ABC" onPress={() => press("2")} />
          <Key label="3" sub="DEF" onPress={() => press("3")} />
          <Key label="4" sub="GHI" onPress={() => press("4")} />
          <Key label="5" sub="JKL" onPress={() => press("5")} />
          <Key label="6" sub="MNO" onPress={() => press("6")} />
          <Key label="7" sub="PQRS" onPress={() => press("7")} />
          <Key label="8" sub="TUV" onPress={() => press("8")} />
          <Key label="9" sub="WXYZ" onPress={() => press("9")} />
          <Key label="." onPress={() => press(".")} muted />
          <Key label="0" onPress={() => press("0")} />
          <Key
            ariaLabel="Delete"
            icon={<Delete size={22} strokeWidth={1.75} />}
            onPress={() => press("del")}
            muted
          />
        </div>
      </div>
    </div>
  );
}

        onClick={() =>
          navigate({ to: "/add-money/method", search: { amount: amount === "0" ? "10" : amount } })
        }
        className="sr-only"
      >
        Continue
      </button>
    </div>
  );
}

function Key({
  label,
  sub,
  icon,
  onPress,
  muted,
  ariaLabel,
}: {
  label?: string;
  sub?: string;
  icon?: React.ReactNode;
  onPress: () => void;
  muted?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      onClick={onPress}
      aria-label={ariaLabel ?? label}
      className={
        "h-12 rounded-md flex flex-col items-center justify-center select-none " +
        (muted
          ? "bg-transparent text-[var(--pp-text)]"
          : "bg-white text-[var(--pp-text)] shadow-[0_1px_0_rgba(0,0,0,0.25)]")
      }
    >
      {icon ? (
        icon
      ) : (
        <>
          <span className="text-[22px] font-normal leading-none">{label}</span>
          {sub && (
            <span className="text-[9px] tracking-[0.15em] text-[var(--pp-text-muted)] mt-0.5">
              {sub}
            </span>
          )}
        </>
      )}
    </button>
  );
}
