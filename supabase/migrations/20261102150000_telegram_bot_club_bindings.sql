-- Club binding for Telegram side bots (chat → club context)
CREATE TABLE public.telegram_bot_club_bindings (
    chat_id bigint NOT NULL,
    bot_name text NOT NULL,
    club_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (chat_id, bot_name)
);

ALTER TABLE public.telegram_bot_club_bindings OWNER TO postgres;

ALTER TABLE public.telegram_bot_club_bindings ENABLE ROW LEVEL SECURITY;
-- No anon/authenticated policies: access via service role only
