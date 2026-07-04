import fs from "node:fs";

let loaded = false;

export function loadLocalEnv() {
  if (loaded) return;
  loaded = true;

  if (process.env.NETLIFY || process.env.SUPABASE_URL) return;

  try {
    const text = fs.readFileSync(".env.local", "utf8");
    text.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const index = trimmed.indexOf("=");
      if (index === -1) return;
      const key = trimmed.slice(0, index);
      const value = trimmed.slice(index + 1);
      if (!process.env[key]) process.env[key] = value;
    });
  } catch (error) {
    // Local env is optional. Netlify uses real environment variables.
  }
}
