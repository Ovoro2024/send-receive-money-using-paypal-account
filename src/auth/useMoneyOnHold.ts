import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";

/** Sum of all pending transactions — shown as "Money on hold". */
export function useMoneyOnHold() {
  const { user } = useAuth();
  const [onHold, setOnHold] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setOnHold(null);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", user.id)
      .eq("status", "pending");
    if (!error) {
      const total = (data ?? []).reduce((sum, r) => sum + Math.abs(Number(r.amount) || 0), 0);
      setOnHold(total);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { onHold, loading, refresh };
}
