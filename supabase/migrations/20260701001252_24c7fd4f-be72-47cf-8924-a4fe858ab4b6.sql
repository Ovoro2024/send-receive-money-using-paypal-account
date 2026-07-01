
CREATE TABLE public.savings (
  user_id uuid NOT NULL PRIMARY KEY,
  amount numeric NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.savings TO authenticated;
GRANT ALL ON public.savings TO service_role;

ALTER TABLE public.savings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own savings" ON public.savings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own savings" ON public.savings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own savings" ON public.savings FOR UPDATE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.transfer_to_savings(p_amount numeric)
RETURNS TABLE(new_balance numeric, new_savings numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_balance numeric;
  v_savings numeric;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF p_amount IS NULL OR p_amount <= 0 THEN RAISE EXCEPTION 'Amount must be positive'; END IF;

  INSERT INTO public.balances (user_id, amount) VALUES (v_user, 0)
    ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.savings (user_id, amount) VALUES (v_user, 0)
    ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.balances
    SET amount = amount - p_amount, updated_at = now()
    WHERE user_id = v_user AND amount >= p_amount
    RETURNING amount INTO v_balance;

  IF v_balance IS NULL THEN RAISE EXCEPTION 'Insufficient funds'; END IF;

  UPDATE public.savings
    SET amount = amount + p_amount, updated_at = now()
    WHERE user_id = v_user
    RETURNING amount INTO v_savings;

  INSERT INTO public.transactions (user_id, amount, kind)
    VALUES (v_user, p_amount, 'transfer_to_savings');

  RETURN QUERY SELECT v_balance, v_savings;
END;
$$;
