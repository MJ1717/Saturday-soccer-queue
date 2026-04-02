import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-only client — uses the service role key so it bypasses RLS.
// Never import this in client components.
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
