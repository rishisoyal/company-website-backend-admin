export const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8000",
  "http://localhost:5173",
  "https://company-website-frontend-woad.vercel.app",
  "https://company-website-backend-admin.vercel.app",
];

export function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin || !allowedOrigins.includes(origin)) {
    // Return an empty object (safe)
    return {};
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
}
