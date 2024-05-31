import crypto from 'crypto';
import telegramLoginButton from '~/components/common/telegramLoginButton.vue';

export default function (tgData: TelegramLoginPayload): boolean {
    const checkString = hashedKeys
        .filter(key => (tgData as any)[key])
        .map(key => `${key}=${(tgData as any)[key]}`)
        .join('\n');
    const botToken = process.env.NUXT_BOT_TOKEN || '';
    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    const hash = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');
    const checkHash = tgData.hash as string;
    return hash === checkHash;
}

// todo: make a single source of truth somehow
export interface TelegramLoginPayload {
    id: number;
    hash: string;
    auth_date: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
}

const telegramKeys = ['id', 'auth_date', 'first_name', 'last_name', 'username', 'photo_url', 'hash'];
const hashedKeys = telegramKeys.filter(key => key !== 'hash');