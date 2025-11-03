import { createClient } from "@supabase/supabase-js";
import { REQUIRED_ENV } from "./env";

export function getSupabaseServiceRoleClient() {
  if (!REQUIRED_ENV.SUPABASE_URL || !REQUIRED_ENV.SUPABASE_SERVICE_ROLE) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createClient(REQUIRED_ENV.SUPABASE_URL, REQUIRED_ENV.SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false }
  });
}
