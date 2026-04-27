import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/security-check")({
  component: SecurityCheckLayout,
  head: () => ({
    meta: [
      { title: "Quick security check — PayPal" },
      { name: "description", content: "Confirm your identity to continue." },
    ],
  }),
});

function SecurityCheckLayout() {
  return <Outlet />;
}
