import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";

/** Per-user avatar stored privately at `<uid>/avatar.<ext>` in the `avatars` bucket. */
export function useAvatar() {
  const { user } = useAuth();
  const [url, setUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setUrl(null);
      return;
    }
    const { data } = await supabase.storage.from("avatars").list(user.id, {
      limit: 10,
      sortBy: { column: "updated_at", order: "desc" },
    });
    const file = data?.find((f) => f.name.startsWith("avatar"));
    if (!file) {
      setUrl(null);
      return;
    }
    const { data: signed } = await supabase.storage
      .from("avatars")
      .createSignedUrl(`${user.id}/${file.name}`, 60 * 60);
    setUrl(signed?.signedUrl ?? null);
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const upload = useCallback(
    async (file: File) => {
      if (!user) return;
      setError(null);
      if (!file.type.startsWith("image/")) {
        setError("Please choose an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be smaller than 5 MB.");
        return;
      }
      setUploading(true);
      const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
      // Remove any previous avatar so only one file per user remains.
      const { data: existing } = await supabase.storage.from("avatars").list(user.id);
      if (existing?.length) {
        await supabase.storage
          .from("avatars")
          .remove(existing.map((f) => `${user.id}/${f.name}`));
      }
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(`${user.id}/avatar.${ext}`, file, { upsert: true, contentType: file.type });
      setUploading(false);
      if (upErr) {
        setError(upErr.message);
        return;
      }
      await load();
    },
    [user, load],
  );

  const remove = useCallback(async () => {
    if (!user) return;
    const { data: existing } = await supabase.storage.from("avatars").list(user.id);
    if (existing?.length) {
      await supabase.storage
        .from("avatars")
        .remove(existing.map((f) => `${user.id}/${f.name}`));
    }
    setUrl(null);
  }, [user]);

  return { url, uploading, error, upload, remove, reload: load };
}
