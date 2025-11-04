export const configureSupabaseEnv = () => {
  process.env.SUPABASE_URL = 'https://fake-url.supabase.co';
  process.env.SUPABASE_KEY = 'fake-key';
};
