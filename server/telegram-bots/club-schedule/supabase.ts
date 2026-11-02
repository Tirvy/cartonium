import { createClient } from '@supabase/supabase-js';
import type { Database } from '#shared/types/supabase.js';

const url = process.env.SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_KEY || '';

const supabase =
  url && serviceKey
    ? createClient<Database>(url, serviceKey)
    : undefined;

export default supabase;
