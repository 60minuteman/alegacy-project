import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('Missing Supabase environment variables. Using dummy client.');
  // Create a dummy client that doesn't throw errors
  supabase = {
    from: () => ({
      select: () => ({
        count: async () => ({ count: 0, error: null }),
      }),
    }),
  } as any;
}

export { supabase };