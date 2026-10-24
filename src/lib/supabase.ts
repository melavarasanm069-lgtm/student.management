import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Student {
  student_id: number;
  name: string;
  gender: string;
  age: number;
  grade: string;
  math_score: number;
  science_score: number;
  english_score: number;
  created_at?: string;
}

export interface StudentInput {
  name: string;
  gender: string;
  age: number;
  grade: string;
  math_score: number;
  science_score: number;
  english_score: number;
}
