import { createClient } from "@supabase/supabase-js";

function readEnv(name) {
  if (typeof Netlify !== "undefined" && Netlify.env?.get) {
    return Netlify.env.get(name);
  }

  return process.env[name];
}

export function hasSupabaseConfig() {
  return Boolean(readEnv("SUPABASE_URL") && readEnv("SUPABASE_SERVICE_ROLE_KEY"));
}

export function supabaseAdmin() {
  const url = readEnv("SUPABASE_URL");
  const serviceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase is not configured. Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
