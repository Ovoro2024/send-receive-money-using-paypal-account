import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/add-money")({
  component: AddMoneyLayout,
});

function AddMoneyLayout() {
  return <Outlet />;
}
