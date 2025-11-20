import { createClient } from '@supabase/supabase-js';

// Tenta pegar do process.env (definido via vite.config.ts)
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL ou Key não encontradas. Verifique suas variáveis de ambiente.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);