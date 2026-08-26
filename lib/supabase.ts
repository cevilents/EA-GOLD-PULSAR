import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export class StoreError extends Error {}

export function createClaimStore(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new StoreError("not_configured");
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
