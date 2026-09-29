import { config } from './config';

export function headersIntegracao() {
  return {
    Authorization: `Bearer ${config.apiKey}`,
  };
}
