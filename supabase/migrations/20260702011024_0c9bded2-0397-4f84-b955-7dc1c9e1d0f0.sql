-- Extend transactions to record counterparty, note, status for activity/receipts
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS counterparty text,
  ADD COLUMN IF NOT EXISTS note text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'completed';

CREATE INDEX IF NOT EXISTS transactions_user_created_idx
  ON public.transactions (user_id, created_at DESC);

-- Send money: deduct balance and record a transaction atomically
CREATE OR REPLACE FUNCTION public.send_money(
  p_amount numeric,
  p_to text,
  p_note text DEFAULT NULL
)
RETURNS TABLE(new_balance numeric, transaction_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_new numeric;
  v_id uuid;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF p_amount IS NULL OR p_amount <= 0 THEN RAISE EXCEPTION 'Amount must be positive'; END IF;
  IF p_to IS NULL OR length(btrim(p_to)) = 0 THEN RAISE EXCEPTION 'Recipient required'; END IF;

  INSERT INTO public.balances (user_id, amount) VALUES (v_user, 0)
    ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.balances
    SET amount = amount - p_amount, updated_at = now()
    WHERE user_id = v_user AND amount >= p_amount
    RETURNING amount INTO v_new;

  IF v_new IS NULL THEN RAISE EXCEPTION 'Insufficient funds'; END IF;

  INSERT INTO public.transactions (user_id, amount, kind, counterparty, note, status)
  VALUES (v_user, p_amount, 'send_money', p_to, p_note, 'completed')
  RETURNING id INTO v_id;

  RETURN QUERY SELECT v_new, v_id;
END;
$$;

-- Record a money request (no balance change)
CREATE OR REPLACE FUNCTION public.record_request(
  p_amount numeric,
  p_from text,
  p_note text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_id uuid;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF p_amount IS NULL OR p_amount <= 0 THEN RAISE EXCEPTION 'Amount must be positive'; END IF;
  IF p_from IS NULL OR length(btrim(p_from)) = 0 THEN RAISE EXCEPTION 'Requestee required'; END IF;

  INSERT INTO public.transactions (user_id, amount, kind, counterparty, note, status)
  VALUES (v_user, p_amount, 'request_money', p_from, p_note, 'pending')
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- Lock down execute grants (mirror existing pattern)
REVOKE EXECUTE ON FUNCTION public.send_money(numeric, text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.record_request(numeric, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.send_money(numeric, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_request(numeric, text, text) TO authenticated;