import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
console.log(supabaseKey, supabaseUrl);

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Could not create supabase client. Check url or api key");
}

let cached = (global as any).supabase;

if (!cached) {
  cached = (global as any).supabase = { client: null, promise: null };
}

export async function createSupabaseClient(): Promise<SupabaseClient> {
  // If a supabase client already exists → reuse it
  if (cached.client) return cached.client;

  // If a client creation is in progress → wait for it
  if (!cached.promise) {
    cached.promise = Promise.resolve(
      createClient(supabaseUrl!, supabaseKey!)
    ).then((client) => {
      cached.client = client;
      return client;
    });
  }

  // Wait for the promise and return client
  cached.client = await cached.promise;
  return cached.client;
}
