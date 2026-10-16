import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Peringatan: NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_ANON_KEY durung disetel ing .env!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserRecord {
  id?: number;
  nama_lengkap: string;
  username: string;
  kelas: string;
  nomor_absen: number;
  kata_sandi: string;
  created_at?: string;
}
