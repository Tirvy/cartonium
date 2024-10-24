#!/bin/bash
source .env
mkdir -p .generated
npx supabase gen types typescript --project-id ${npm_config_supabase_id} --schema public > .generated/supabase-database.ts