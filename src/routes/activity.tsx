import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/activity")({
  component: () => <Outlet />,
});

export { Link };
