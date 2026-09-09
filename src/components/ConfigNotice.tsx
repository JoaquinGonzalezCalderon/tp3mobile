import { FeedbackBanner } from '@/components/FeedbackBanner';
import { isSupabaseConfigured } from '@/lib/supabase';

export function ConfigNotice() {
  if (isSupabaseConfigured) return null;
  return <FeedbackBanner message="Configurá las variables de Supabase en .env para conectar la autenticación." type="warning" />;
}

