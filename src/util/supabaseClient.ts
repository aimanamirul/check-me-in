import { createClient } from '@supabase/supabase-js';


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

if (!supabase) {
  console.error('Error! Supabase client could not be created!');
} else {
  console.log('Supabase client created successfully');
}

export default supabase;
