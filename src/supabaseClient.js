import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Kiểm tra xem các biến đã được cấu hình chưa
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Vui long cau hinh REACT_APP_SUPABASE_URL va REACT_APP_SUPABASE_ANON_KEY trong tep .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
