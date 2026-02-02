import { createClient } from '@supabase/supabase-js';
// The comments here are used to remind me about the steps in connecting to datasvase (supabase).

// These variables pull the data from your .env.local file 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// This creates the actual connection object
export const supabase = createClient(supabaseUrl, supabaseAnonKey);