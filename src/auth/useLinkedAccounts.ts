import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";

export type LinkedAccount = {
  id: string;
  kind: "bank" | "card";
  institution: string;
  account_type: string | null;
  last4: string;
  brand: string | null;
  created_at: string;
};

export function useLinkedAccounts() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return setAccounts([]);
    setLoading(true);
    const { data } = await supabase
      .from("linked_accounts")
      .select("*")
      .order("created_at", { ascending: true });
    setAccounts((data ?? []) as LinkedAccount[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const link = useCallback(
    async (a: Omit<LinkedAccount, "id" | "created_at">) => {
      if (!user) return { error: "Not signed in" };
      const { error } = await supabase
        .from("linked_accounts")
        .insert({ ...a, user_id: user.id });
      if (error) return { error: error.message };
      await refresh();
      return { error: null };
    },
    [user, refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await supabase.from("linked_accounts").delete().eq("id", id);
      await refresh();
    },
    [refresh],
  );

  return { accounts, loading, refresh, link, remove };
}
