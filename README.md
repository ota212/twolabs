# doislabs.com.br

Loja oficial de produtos digitais da Dois Labs.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Stripe (Checkout Sessions)
- Supabase (Auth + PostgreSQL + Storage)

## Setup

### 1. Clone e instale dependencias

```bash
git clone <repo-url>
cd doislabs
npm install
```

### 2. Configure variaveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

Variaveis necessarias:
- `STRIPE_SECRET_KEY` — chave secreta do Stripe
- `STRIPE_WEBHOOK_SECRET` — secret do webhook do Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — chave publica do Stripe
- `NEXT_PUBLIC_SUPABASE_URL` — URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — chave anon do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — chave service role do Supabase

### 3. Configure o Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o SQL em `supabase/seed.sql` no SQL Editor
3. Crie dois storage buckets:
   - `products` (privado) — arquivos para download
   - `product-images` (publico) — imagens do catalogo
4. Ative a autenticacao por email (Magic Link) em Auth > Providers

### 4. Configure o Stripe

1. Crie uma conta no [Stripe](https://stripe.com)
2. Configure o webhook apontando para `https://seu-dominio.com/api/webhook`
3. Selecione o evento `checkout.session.completed`

### 5. Rode o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Deploy

Deploy na Vercel:

```bash
npx vercel
```

Configure as variaveis de ambiente no dashboard da Vercel.
