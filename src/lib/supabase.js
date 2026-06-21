import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vodwjzhrtfvkxqpalqzo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_cxvRdXJ5xaw-Yph3wTqfHg_uAl1kuAz";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
