

import { createClient } from "@supabase/supabase-js";

// Forbindelsen til Supabase. Værdierne ligger i .env.local og som secrets på GitHub
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);
