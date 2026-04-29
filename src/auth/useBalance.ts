import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";

export function useBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setBalance(null);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("balances")
      .select("amount")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!error) setBalance(data ? Number(data.amount) : 30.71);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addMoney = useCallback(
    async (amount: number) => {
      const { data, error } = await supabase.rpc("add_money", { p_amount: amount });
      if (error) return { error: error.message, newBalance: null as number | null };
      const newBalance = data === null ? null : Number(data);
      if (newBalance !== null) setBalance(newBalance);
      return { error: null, newBalance };
    },
    [],
  );

  const transferMoney = useCallback(
    async (amount: number) => {
      const { data, error } = await supabase.rpc("transfer_money", { p_amount: amount });
      if (error) return { error: error.message, newBalance: null as number | null };
      const newBalance = data === null ? null : Number(data);
      if (newBalance !== null) setBalance(newBalance);
      return { error: null, newBalance };
    },
    [],
  );

  return { balance, loading, refresh, addMoney, transferMoney };
}
