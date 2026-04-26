import { createFileRoute } from "@tanstack/react-router";
import { BottomNav } from "@/components/paypal/BottomNav";

export const Route = createFileRoute("/payments")({
  component: PaymentsPage,
});

function PaymentsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--pp-bg)]">
      <main className="flex-1 px-5 pt-12">
        <h1 className="text-3xl font-bold text-[var(--pp-text)]">Payments</h1>
      </main>
      <BottomNav />
    </div>
  );
}
