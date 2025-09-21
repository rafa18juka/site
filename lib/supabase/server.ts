import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type SupabaseClientType = SupabaseClient<any, any, any>;

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function assertConfig() {
  if (!SUPABASE_URL) {
    throw new Error("SUPABASE_URL is not defined. Configure your environment variables.");
  }
  if (!SUPABASE_ANON_KEY) {
    throw new Error("SUPABASE_ANON_KEY is not defined. Configure your environment variables.");
  }
}

export function getSupabaseBrowserClient(): SupabaseClientType {
  assertConfig();
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false }
  });
}

export function getSupabaseServiceRole(): SupabaseClientType {
  assertConfig();
  const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  return createClient(SUPABASE_URL, key, {
    auth: { persistSession: false }
  });
}