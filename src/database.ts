import { config } from './config';

export function conectarBanco() {
  console.log(`Conectando no banco em ${config.db.host}`);
  return { host: config.db.host, conectado: true };
}
