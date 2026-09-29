import { config } from './config';
import http from 'http';
import { AddressInfo } from 'net';
import { conectarBanco } from './database';

console.log(`Ambiente: ${config.env} (arquivo ${config.arquivo})`);
console.log(`DB_HOST: ${config.db.host}`);
console.log(`PORT: ${config.port} (${typeof config.port})`);

conectarBanco();

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', port: config.port, env: config.env }));
    return;
  }
  res.writeHead(404);
  res.end();
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`A porta ${config.port} ja esta em uso.`);
  } else {
    console.error(`Erro ao subir o servidor: ${err.message}`);
  }
  process.exit(1);
});

server.listen(config.port, () => {
  const endereco = server.address() as AddressInfo;
  console.log(`Servidor rodando na porta ${endereco.port}`);
});
