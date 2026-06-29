import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const env = {
  port: parseInt(process.env.PORT ?? '4000', 10),
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret-change-me',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret-change-me',
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES ?? '15m',
  jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES ?? '7d',
  aiProvider: process.env.AI_PROVIDER ?? 'groq',
  groqApiKey: process.env.GROQ_API_KEY ?? '',
  geminiApiKey: process.env.GEMINI_API_KEY ?? '',
  mistralApiKey: process.env.MISTRAL_API_KEY ?? '',
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
  zhipuApiKey: process.env.ZHIPU_API_KEY ?? '',
  ntfyDefaultServer: process.env.NTFY_DEFAULT_SERVER ?? 'https://ntfy.sh',
  notionApiKey: process.env.NOTION_API_KEY ?? '',
};
