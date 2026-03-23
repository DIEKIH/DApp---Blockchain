import { createClient } from '@supabase/supabase-js';

// Các biến môi trường lấy từ tệp .env
const supabaseUrl = "https://vczxarihvftflkjwqlqs.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjenhhcmlodmZ0ZmxrandxbHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNDM0OTcsImV4cCI6MjA4OTgxOTQ5N30.v126uQOauKYWj0bXHQ9A7PAYNnHs0p9ZwdxQL_5yCKM";

// Kiểm tra xem các biến đã được cấu hình chưa
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Vui lòng cấu hình REACT_APP_SUPABASE_URL và REACT_APP_SUPABASE_ANON_KEY trong tệp .env"
  );
}

// Khởi tạo client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
