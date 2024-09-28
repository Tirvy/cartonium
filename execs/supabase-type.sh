#!/bin/bash
source .env
npx supabase gen types typescript --project-id ${npm_config_supabase_id} --schema public > .generated/supabase-database.ts