import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import crypto from 'crypto';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  console.log(config);
  const query = getQuery(event);
  const keys = Object.keys(query).sort((a, b) => a.localeCompare(b));
  const checkString = keys.map(key => `${key}=${query[key]}`).join('\n');
  const botToken = 'ahaha';
  const secretKey = crypto.createHash('sha256').update(botToken).digest('base64');
  const hash = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');
  const telegramHash = query.hash as string;
  console.log(query, checkString);
  console.log(secretKey);
  console.log(hash);
  console.log(telegramHash);
  console.log(hash === telegramHash);
  return;
  const code = query.code as string;
  const next = (query.next as string) ?? '/';
  const { auth } = await serverSupabaseClient(event)

  if (code) {
    const { error } = await auth.exchangeCodeForSession(code)
    if (!error) {
      await sendRedirect(event, `/${next.slice(1)}`, 303)
    }
  }

  // return the user to an error page with instructions
  await sendRedirect(event, `/auth/auth-code-error`, 303)
})
