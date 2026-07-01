
REVOKE EXECUTE ON FUNCTION public.add_money(numeric) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.transfer_money(numeric) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.transfer_to_savings(numeric) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.add_money(numeric) TO authenticated;
GRANT EXECUTE ON FUNCTION public.transfer_money(numeric) TO authenticated;
GRANT EXECUTE ON FUNCTION public.transfer_to_savings(numeric) TO authenticated;
