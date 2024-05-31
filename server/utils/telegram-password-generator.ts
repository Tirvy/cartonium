import crypto from 'crypto';


export default function (tgData: TelegramLoginPayload): string {
  const secretKey = process.env.NUXT_TELEGRAM_PASSWORD_GENERATOR;
  if (!secretKey) {
    throw new Error('NUXT_TELEGRAM_PASSWORD_GENERATOR env variable is not set');
  }
  const hash = crypto.createHmac('sha256', secretKey).update(tgData.id + '').digest('hex');
  return hash;
}