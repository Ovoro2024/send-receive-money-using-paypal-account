import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PayPalLogo } from "@/components/paypal/PayPalLogo";
import { useAuth } from "@/auth/AuthProvider";

export const Route = createFileRoute("/splash")({
  component: SplashPage,
  head: () => ({
    meta: [
      { title: "PayPal" },
      { name: "description", content: "Loading PayPal." },
    ],
  }),
});

type Phase = "yellow" | "loading";

function SplashPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [phase, setPhase] = useState<Phase>("yellow");

  // Yellow splash -> loading screen
  useEffect(() => {
    const t = setTimeout(() => setPhase("loading"), 1400);
    return () => clearTimeout(t);
  }, []);

  // After loading screen + auth resolved, route forward
  useEffect(() => {
    if (phase !== "loading" || loading) return;
    const t = setTimeout(() => {
      navigate({ to: user ? "/" : "/auth", replace: true });
    }, 1300);
    return () => clearTimeout(t);
  }, [phase, loading, user, navigate]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Yellow splash */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
        style={{
          backgroundColor: "var(--pp-yellow)",
          opacity: phase === "yellow" ? 1 : 0,
          pointerEvents: phase === "yellow" ? "auto" : "none",
        }}
      >
        <div
          className="transition-transform duration-700 ease-out"
          style={{
            transform: phase === "yellow" ? "scale(1)" : "scale(1.15)",
          }}
        >
          <PayPalLogo className="h-20 w-20 drop-shadow-sm" />
        </div>
      </div>

      {/* Loading screen */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
        style={{
          backgroundColor: "oklch(0.985 0.005 30)",
          opacity: phase === "loading" ? 1 : 0,
          pointerEvents: phase === "loading" ? "auto" : "none",
        }}
      >
        <Spinner />
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 50 50"
      className="h-14 w-14 animate-spin"
      style={{ animationDuration: "1.1s" }}
      aria-label="Loading"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="oklch(0.55 0.13 265)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="95 40"
      />
    </svg>
  );
}
