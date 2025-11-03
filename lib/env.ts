export const REQUIRED_ENV = {
  OPENAI_API_KEY: process.env.OPEN_AI_YOUR_API_KEY ?? "",
  KIE_AI_API_KEY: process.env.KIE_AI_API_KEY ?? "",
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN ?? ""
};

export function assertEnv() {
  const missing = Object.entries(REQUIRED_ENV)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    console.warn(
      `Missing environment variables detected: ${missing.join(", ")}. ` +
        "Populate your .env.local before deploying."
    );
  }
}
