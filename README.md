# dotenv-techskills

Atividade de variaveis de ambiente com Node e TypeScript.

## Exercicio 1 - .env

Sintoma: a porta vinha como string e o DB_HOST com aspas.
Causa: cada arquivo lia `process.env` direto, sem conversao.
Correcao: toda leitura ficou no `src/config.ts`, que carrega o dotenv antes de tudo e converte a PORT pra number. O log mostra `PORT: 3000 (number)` e `DB_HOST: localhost` sem aspas. Senha e chave nao sao impressas.

## Exercicio 2 - dev e prod

Sintoma: o prod carregava o arquivo errado.
Causa: `=` no lugar de `===` no if, `dotenv.config()` sem path rodando antes e caminho relativo.
Correcao: caminho com `path.resolve(__dirname, ...)`, `override: true` e `NODE_ENV ?? 'development'`.

```
npm run start:dev  -> Ambiente: development (arquivo .env.dev) / DB_HOST: localhost
npm run start:prod -> Ambiente: production (arquivo .env.prod) / DB_HOST: db.producao.interno
```

## Exercicio 3 - git

O `.gitignore` ignora `.env` e `.env.*`, menos o `.env.example`. Se o `.env` ja tivesse sido commitado, tira do indice com `git rm --cached .env` e troca as senhas que vazaram, porque continuam no historico.

```
git check-ignore -v .env .env.dev .env.prod   -> ignorados
git check-ignore -v .env.example              -> nao ignorado
```

O `.env.example` so tem os nomes das variaveis, sem valor.

## Exercicio 4 - validacao

Validacao com joi no `config.ts`, usando `abortEarly: false` pra mostrar todos os erros de uma vez. Se faltar algo o app nem sobe (`process.exit(1)`), e so mostra o nome da variavel:

```
Configuracao invalida:
- DB_HOST: any.required
```

Depois disso o resto do codigo usa so o objeto `config`.

## Exercicio 5 - porta

| Caso | Resultado |
| --- | --- |
| sem PORT | sobe na 3000 |
| PORT=4000 | `/health` retorna `{"status":"ok","port":4000}` |
| PORT vazio | erro `PORT: number.base`, nao cai no padrao escondido |
| PORT=abc | erro `PORT: number.base` |
| duas instancias na mesma porta | `A porta 3000 ja esta em uso.` |

A mensagem de "servidor rodando" pega a porta de `server.address()`, nao de texto fixo.

Perguntas:

- `||` vs `??`: o `||` troca qualquer valor falso pelo padrao, inclusive string vazia, entao `PORT=` virava 3000 sem ninguem perceber. O `??` so troca `undefined` e `null`. Aqui o vazio da erro de proposito.
- Porta do servidor vs variavel: a variavel e o que foi pedido, o `server.address()` e onde ele realmente subiu. Com `PORT=0` por exemplo o sistema escolhe uma porta aleatoria e so o servidor sabe qual foi.
- Sem valor padrao: em producao. La a porta tem que vir do ambiente (container, plataforma), e se nao vier e melhor quebrar do que subir numa porta errada.
- Codigo de saida diferente de zero: e assim que o terminal, o docker ou o CI sabem que deu erro. Com `exit(0)` pareceria que o app terminou normal.
