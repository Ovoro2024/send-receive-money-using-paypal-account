import { Link, useLocation } from "@tanstack/react-router";
import { Home, BarChart3, DollarSign, Tag, Wallet } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/finances", label: "Finances", icon: BarChart3 },
  { to: "/payments", label: "Payments", icon: DollarSign },
  { to: "/deals", label: "Deals", icon: Tag },
  { to: "/wallet", label: "Wallet", icon: Wallet },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-30 bg-[var(--pp-card)] border-t border-[color:var(--border)] px-2 pt-2 pb-3">
      <ul className="flex items-end justify-between">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          const color = active ? "var(--pp-blue)" : "var(--pp-text-muted)";
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="flex flex-col items-center gap-1 py-1 select-none"
                style={{ color }}
              >
                <Icon size={22} strokeWidth={2.25} fill={active ? color : "none"} />
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
