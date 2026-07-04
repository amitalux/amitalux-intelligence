import { loadLocalEnv } from "../netlify/functions/_shared/env.js";
import { supabaseAdmin } from "../netlify/functions/_shared/supabase-db.js";

loadLocalEnv();

const supabase = supabaseAdmin();

const { data, error } = await supabase
  .from("workspaces")
  .select("slug,name,status")
  .eq("slug", "demo-business")
  .single();

if (error) {
  console.error("Supabase connection failed:", error.message);
  process.exit(1);
}

console.log("Supabase connected.");
console.log(`Workspace: ${data.slug} / ${data.name} / ${data.status}`);
