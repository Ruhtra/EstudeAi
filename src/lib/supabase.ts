import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database

declare global {
  // eslint-disable-next-line no-var
  var supabase: SupabaseClient | undefined;
}

const supabase =
  globalThis.supabase ||
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

if (process.env.NODE_ENV !== "production") globalThis.supabase = supabase;

export { supabase };
