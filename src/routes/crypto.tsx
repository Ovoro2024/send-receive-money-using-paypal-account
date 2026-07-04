import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireAuth } from "@/auth/RequireAuth";

export const Route = createFileRoute("/crypto")({
  component: () => (
    <RequireAuth>
      <Outlet />
    </RequireAuth>
  ),
  head: () => ({
    meta: [
      { title: "Crypto — PayPal" },
      { name: "description", content: "Buy, sell, hold and transfer crypto with PayPal." },
    ],
  }),
});
