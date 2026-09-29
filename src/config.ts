import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import Joi from 'joi';

const env = process.env.NODE_ENV ?? 'development';

const arquivos: Record<string, string> = {
  development: '.env.dev',
  production: '.env.prod',
};

const raiz = path.resolve(__dirname, '..');
const arquivoEnv = path.resolve(raiz, arquivos[env] ?? '.env');

dotenv.config({ path: path.resolve(raiz, '.env') });

if (fs.existsSync(arquivoEnv)) {
  dotenv.config({ path: arquivoEnv, override: true });
}

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  PORT: Joi.number().integer().min(1).max(65535).default(3000),
  DB_HOST: Joi.string().required().empty(''),
  DB_PASSWORD: Joi.string().required().empty(''),
  API_KEY: Joi.string().required().empty(''),
}).unknown(true);

const { error, value } = schema.validate(process.env, { abortEarly: false });

if (error) {
  console.error('Configuracao invalida:');
  for (const detalhe of error.details) {
    console.error(`- ${detalhe.path.join('.')}: ${detalhe.type}`);
  }
  process.exit(1);
}

export const config = {
  env: value.NODE_ENV as string,
  arquivo: path.basename(arquivoEnv),
  port: value.PORT as number,
  db: {
    host: value.DB_HOST as string,
    password: value.DB_PASSWORD as string,
  },
  apiKey: value.API_KEY as string,
};
