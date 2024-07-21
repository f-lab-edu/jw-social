import { config } from 'dotenv';

const envPath = process.env.DOTENV_CONFIG_PATH || '.env';
config({ path: envPath });

export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;
