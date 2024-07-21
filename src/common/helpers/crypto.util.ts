import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'crypto';

import { ENCRYPTION_KEY } from '@/config';

const algorithm = 'aes-256-ctr';
const password = ENCRYPTION_KEY;
const key = scryptSync(password, 'salt', 32);

export const encrypt = (text: string): string => {
  const iv = randomBytes(16);
  const cipher = createCipheriv(algorithm, key, iv);
  const encryptedText = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString('hex')}:${encryptedText.toString('hex')}`;
};

export const decrypt = (token: string): string => {
  const [ivHex, encryptedText] = token.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedBuffer = Buffer.from(encryptedText, 'hex');
  const decipher = createDecipheriv(algorithm, key, iv);
  const decryptedText = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final(),
  ]);
  return decryptedText.toString();
};
