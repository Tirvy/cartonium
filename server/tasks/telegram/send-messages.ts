/**
 * Formerly drained a Supabase pgmq telegram-messages queue.
 * Disabled — keep stub so Nitro task registration does not break if re-enabled in config.
 */
export default defineTask({
  meta: {
    name: 'telegram:send-messages',
    description: 'No-op: pgmq queue removed with Supabase',
  },
  async run() {
    return { result: 'skipped' }
  },
})
