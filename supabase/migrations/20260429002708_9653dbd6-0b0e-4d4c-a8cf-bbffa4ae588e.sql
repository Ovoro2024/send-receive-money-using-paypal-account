CREATE OR REPLACE FUNCTION public.transfer_money(p_amount numeric)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_new numeric;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  INSERT INTO public.balances (user_id, amount)
  VALUES (v_user, 0)
  ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.balances
  SET amount = amount - p_amount,
      updated_at = now()
  WHERE user_id = v_user
    AND amount >= p_amount
  RETURNING amount INTO v_new;

  IF v_new IS NULL THEN
    RAISE EXCEPTION 'Insufficient funds';
  END IF;

  RETURN v_new;
END;
$$;