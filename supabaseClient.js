import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://your-project-ref.supabase.co'; // Replace with your project's URL
const supabaseAnonKey = 'your-anon-key'; // Replace with your project's anon key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;