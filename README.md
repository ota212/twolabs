# twolabs

Repositório principal da Two Labs.

## Ambiente de testes

O ambiente de testes está configurado em [ota212/startup](https://github.com/ota212/startup).

Para subir o ambiente local:

```bash
docker compose -f docker-compose.test.yml --env-file .env.test up
```

Para acesso remoto via túnel:

```bash
./scripts/start-with-tunnel.sh
```

Credenciais padrão de teste: `admin / test1234`

## Status

Repositório recriado do zero em 2026-04-21. Conteúdo anterior removido.
