import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Ek hi connection ban banane ka logic taaki "Multiple Instances" warning na aaye
let supabaseInstance;
if (!supabaseInstance) {
  supabaseInstance = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: window.localStorage,
      persistSession: true,
    }
  });
}

export const supabase = supabaseInstance;