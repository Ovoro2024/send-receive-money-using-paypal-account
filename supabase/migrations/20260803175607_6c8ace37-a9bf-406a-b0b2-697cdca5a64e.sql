CREATE OR REPLACE FUNCTION public.send_money(
  p_amount numeric,
  p_to text,
  p_note text DEFAULT NULL::text,
  p_status text DEFAULT 'completed'::text
)
 RETURNS TABLE(new_balance numeric, transaction_id uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user uuid := auth.uid();
  v_new numeric;
  v_id uuid;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF p_amount IS NULL OR p_amount <= 0 THEN RAISE EXCEPTION 'Amount must be positive'; END IF;
  IF p_to IS NULL OR length(btrim(p_to)) = 0 THEN RAISE EXCEPTION 'Recipient required'; END IF;
  IF p_status IS NULL OR p_status NOT IN ('pending', 'completed') THEN
    p_status := 'completed';
  END IF;

  INSERT INTO public.balances (user_id, amount) VALUES (v_user, 0)
    ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.balances
    SET amount = amount - p_amount, updated_at = now()
    WHERE user_id = v_user AND amount >= p_amount
    RETURNING amount INTO v_new;

  IF v_new IS NULL THEN RAISE EXCEPTION 'Insufficient funds'; END IF;

  INSERT INTO public.transactions (user_id, amount, kind, counterparty, note, status)
  VALUES (v_user, p_amount, 'send_money', p_to, p_note, p_status)
  RETURNING id INTO v_id;

  RETURN QUERY SELECT v_new, v_id;
END;
$function$