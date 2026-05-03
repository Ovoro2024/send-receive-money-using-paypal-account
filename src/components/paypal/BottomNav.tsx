import { Link, useLocation } from "@tanstack/react-router";
import iconHome from "@/assets/nav/icon-0.png";
import iconFinances from "@/assets/nav/icon-1.png";
import iconPayments from "@/assets/nav/icon-2.png";
import iconDeals from "@/assets/nav/icon-3.png";
import iconWallet from "@/assets/nav/icon-4.png";

const items = [
  { to: "/", label: "Home", icon: iconHome },
  { to: "/finances", label: "Finances", icon: iconFinances },
  { to: "/payments", label: "Payments", icon: iconPayments },
  { to: "/deals", label: "Deals", icon: iconDeals },
  { to: "/wallet", label: "Wallet", icon: iconWallet },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-30 bg-[var(--pp-card)] border-t border-[color:var(--border)] px-2 pt-2 pb-3">
      <ul className="flex items-end justify-between">
        {items.map(({ to, label, icon }) => {
          const active = pathname === to;
          const color = active ? "var(--pp-blue)" : "var(--pp-text-muted)";
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="flex flex-col items-center gap-1 py-1 select-none"
                style={{ color }}
              >
                <img
                  src={icon}
                  alt={label}
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                  style={{
                    opacity: active ? 1 : 0.85,
                    filter: active
                      ? "none"
                      : "grayscale(1) brightness(0.75) contrast(1.05)",
                  }}
                />
                <span className="text-[11px] font-medium" style={{ color }}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
