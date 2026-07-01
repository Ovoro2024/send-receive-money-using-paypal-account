import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";

export function useSavings() {
  const { user } = useAuth();
  const [savings, setSavings] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setSavings(null);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("savings")
      .select("amount")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!error) setSavings(data ? Number(data.amount) : 0);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const transferToSavings = useCallback(async (amount: number) => {
    const { data, error } = await supabase.rpc("transfer_to_savings", {
      p_amount: amount,
    });
    if (error) return { error: error.message, newBalance: null as number | null, newSavings: null as number | null };
    const row = Array.isArray(data) ? data[0] : data;
    const newBalance = row?.new_balance == null ? null : Number(row.new_balance);
    const newSavings = row?.new_savings == null ? null : Number(row.new_savings);
    if (newSavings !== null) setSavings(newSavings);
    return { error: null, newBalance, newSavings };
  }, []);

  return { savings, loading, refresh, transferToSavings };
}
