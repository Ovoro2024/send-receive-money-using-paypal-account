
-- Lock down SECURITY DEFINER functions: revoke from PUBLIC/anon, grant only to appropriate roles.

REVOKE ALL ON FUNCTION public.add_money(numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.add_money(numeric) TO authenticated;

REVOKE ALL ON FUNCTION public.send_money(numeric, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.send_money(numeric, text, text) TO authenticated;

REVOKE ALL ON FUNCTION public.record_request(numeric, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_request(numeric, text, text) TO authenticated;

REVOKE ALL ON FUNCTION public.transfer_money(numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.transfer_money(numeric) TO authenticated;

REVOKE ALL ON FUNCTION public.transfer_to_savings(numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.transfer_to_savings(numeric) TO authenticated;

-- handle_new_user is a trigger function; no client should call it directly.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
