import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://hiwrqmmfergudukuvuls.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhpd3JxbW1mZXJndWR1a3V2dWxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNTc5MjUsImV4cCI6MjA5NDkzMzkyNX0.MWffpT25cgyI_L79qbj4V1dvrvr07HGrzYYXIYeAnrc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const BUCKET = 'memories';

export { supabase as default };
