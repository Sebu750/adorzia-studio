import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lnrhrevpouozugsarsmz.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucmhyZXZwb3VvenVnc2Fyc216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MTQxMTQsImV4cCI6MjA4NDk5MDExNH0.--RPkMJJlA3wplVacHc_6azTrr6D9IE1Zsjjwuu_QXk';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact' });
    
    if (error) {
      console.log('Connection test result:', error.message);
    } else {
      console.log('Connection successful! Profile count:', data);
    }
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

testConnection();