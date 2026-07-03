
CREATE TABLE public.linked_accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('bank','card')),
  institution text NOT NULL,
  account_type text,
  last4 text NOT NULL,
  brand text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.linked_accounts TO authenticated;
GRANT ALL ON public.linked_accounts TO service_role;
ALTER TABLE public.linked_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own linked accounts" ON public.linked_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own linked accounts" ON public.linked_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own linked accounts" ON public.linked_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own linked accounts" ON public.linked_accounts FOR DELETE USING (auth.uid() = user_id);
