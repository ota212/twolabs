# doislabs.com.br — Design Spec

**Data:** 2026-04-08
**Status:** Aprovado
**Autores:** Leo + Claude

---

## 1. Visao Geral

Loja oficial de produtos digitais da Dois Labs (Leo + Otavio). Site minimalista para vender produtos digitais automatizados com IA. Primeiro produto: Planilha Financeira para Psicologos (R$47-97, .xlsx).

## 2. Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript
- **Estilo:** Tailwind CSS (sem shadcn/ui)
- **Pagamentos:** Stripe Checkout Sessions (redirect, nao embedded)
- **Backend:** Supabase (Auth + PostgreSQL + Storage)
- **Deploy:** Vercel
- **Fonte:** DM Sans (Google Fonts) via next/font

## 3. Brand Identity

| Token | Valor | Uso |
|-------|-------|-----|
| Navy | #1A3A5C | Cor primaria, hero, navbar |
| Cream | #F5F5F0 | Background principal |
| Electric Blue | #3B82F6 | CTAs, botoes, accent |
| White | #FFFFFF | Texto sobre escuro |
| DM Sans 700 | — | Titulos |
| DM Sans 400 | — | Corpo |

Estilo: minimalista, flat, sem sombras pesadas. Referencias: Gumroad, Lemonsqueezy, Vercel.

## 4. Arquitetura

### 4.1 Rendering Strategy

- **SSG + ISR (revalidate: 60):** Home, Catalogo, Pagina do Produto, Sobre, Sucesso, Cancelado
- **Client-side (auth-gated):** Minha Conta
- **API Routes:** checkout, webhook, download

### 4.2 Fluxo de Compra

1. Usuario clica "Comprar" na pagina do produto
2. Frontend POST `/api/checkout` com `{ productId }`
3. API cria Stripe Checkout Session, retorna `{ url }`
4. Frontend redireciona para Stripe
5. Stripe redireciona para `/sucesso?session_id=xxx` ou `/cancelado`
6. Em paralelo, Stripe envia webhook para `/api/webhook`
7. Webhook: evento `checkout.session.completed` → busca/cria usuario Supabase Auth pelo email → insere `purchase`
8. Usuario acessa `/minha-conta`, faz login via magic link, ve compras e faz download

### 4.3 Fluxo de Download

1. Usuario logado em `/minha-conta` clica "Baixar"
2. Frontend GET `/api/download/[purchaseId]` com auth token
3. API verifica que purchase pertence ao user
4. Gera signed URL do Supabase Storage (TTL 5 minutos)
5. Retorna `{ url }`, frontend redireciona

### 4.4 Diagrama

```
Vercel (Next.js App Router)
├── SSG: /, /produtos, /produtos/[slug], /sobre
├── Static: /sucesso, /cancelado
├── Client: /minha-conta (auth-gated)
└── API Routes
    ├── POST /api/checkout → Stripe
    ├── POST /api/webhook ← Stripe
    └── GET  /api/download/[purchaseId] → Supabase Storage

Supabase
├── Auth (magic link, email)
├── Database (products, purchases)
└── Storage
    ├── products (privado) — arquivos para download
    └── product-images (publico) — imagens do catalogo

Stripe
├── Checkout Sessions
└── Webhooks → checkout.session.completed
```

## 5. Database Schema

### 5.1 products

```sql
CREATE TABLE products (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  name        text NOT NULL,
  description text,
  price_cents integer NOT NULL,
  category    text,
  image_url   text,
  file_path   text,
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);
```

### 5.2 purchases

```sql
CREATE TABLE purchases (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid REFERENCES auth.users(id),
  product_id        uuid REFERENCES products(id),
  stripe_session_id text UNIQUE,
  status            text DEFAULT 'completed',
  created_at        timestamptz DEFAULT now()
);
```

### 5.3 RLS Policies

- `products`: SELECT publico. INSERT/UPDATE/DELETE bloqueado (gerenciado via Supabase dashboard).
- `purchases`: SELECT apenas `WHERE user_id = auth.uid()`. INSERT via service_role key (webhook).

### 5.4 Storage Buckets

- `products` — privado, arquivos de download
- `product-images` — publico, imagens do catalogo

## 6. Paginas

### 6.1 Layout Global

- **Navbar:** Logo Dois Labs (esquerda), links Produtos + Sobre (centro), Minha Conta (direita). Responsivo com hamburger menu no mobile.
- **Footer:** Logo, links (Produtos, Sobre, Minha Conta), email, @doislabs.
- **Font:** DM Sans via `next/font/google`.

### 6.2 Home (/)

- **Hero:** Fundo navy, headline "Produtos digitais que rodam sozinhos.", subheadline, CTA "Ver Produtos" (electric blue).
- **Grid de Produtos:** Ate 3 produtos mais recentes ativos. Card com imagem, nome, preco, badge "Novo" se criado < 30 dias.
- **Sobre Section:** Uma frase sobre Dois Labs + icones/nomes dos founders.
- **Footer.**

### 6.3 Catalogo (/produtos)

- **Top bar:** Pills de categoria (filtragem client-side) + campo de busca.
- **Ordenacao:** Mais recente, menor preco, maior preco.
- **Grid responsivo:** 3 colunas desktop, 2 tablet, 1 mobile.
- **Product Card:** Imagem, nome, categoria badge, preco formatado (R$ XX,XX), badge "Novo".

### 6.4 Produto (/produtos/[slug])

- **Layout:** 2 colunas desktop (imagem | info), stacked mobile.
- **Info:** Nome, categoria, preco grande, botao "Comprar Agora" (electric blue).
- **Descricao:** Markdown renderizado.
- **FAQ:** Accordion colapsavel (Tailwind puro, sem lib).
- **Badge:** "7 dias de garantia".

### 6.5 Sucesso (/sucesso)

- Icone check, "Compra confirmada!", instrucoes.
- CTA "Acessar Minha Conta".

### 6.6 Cancelado (/cancelado)

- Mensagem amigavel.
- CTA "Voltar aos Produtos".

### 6.7 Minha Conta (/minha-conta)

- **Nao logado:** Form de email → magic link → "Cheque seu email".
- **Logado:** Lista de compras (produto, data, botao "Baixar"), botao logout.

### 6.8 Sobre (/sobre)

- Leo + Otavio (nome, papel, uma linha).
- Missao da Dois Labs.
- Por que produtos digitais automatizados.

## 7. API Routes

### 7.1 POST /api/checkout

- Input: `{ productId: string }`
- Busca produto no Supabase (valida is_active)
- Cria Stripe Checkout Session:
  - `line_items`: nome, preco, qty 1
  - `mode: 'payment'`
  - `success_url: /sucesso?session_id={CHECKOUT_SESSION_ID}`
  - `cancel_url: /cancelado`
  - `metadata: { productId }`
- Retorna `{ url: session.url }`

### 7.2 POST /api/webhook

- Valida Stripe signature (`stripe.webhooks.constructEvent`)
- Evento `checkout.session.completed`:
  1. Extrai `customer_email` e `metadata.productId`
  2. Busca usuario por email no Supabase Auth (`getUserByEmail`)
  3. Se nao existe, cria via `admin.createUser({ email })`
  4. Insere em `purchases`: user_id, product_id, stripe_session_id, status 'completed'
- Retorna 200

### 7.3 GET /api/download/[purchaseId]

- Extrai auth token do header Authorization
- Verifica usuario via Supabase Auth (`getUser`)
- Busca purchase e valida `user_id === auth.uid`
- Busca `file_path` do produto
- Gera signed URL do Supabase Storage (300s TTL)
- Retorna `{ url }`

## 8. SEO

- Meta tags dinamicos por pagina (title, description, og:image)
- `sitemap.xml` gerado via Next.js metadata API
- `robots.txt`
- OG images para compartilhamento

## 9. Variaveis de Ambiente

```
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## 10. Primeiro Produto (Seed)

- **Nome:** Planilha Financeira para Psicologos
- **Slug:** planilha-financeira-psicologos
- **Categoria:** planilhas
- **Preco:** R$47,00 (4700 cents) — a confirmar
- **Descricao:** Planilha Excel completa para psicologos autonomos. Gestao de pacientes, sessoes, pagamentos, imposto (carne-leao) e dashboard financeiro. 10 abas, sem macros.
- **Arquivo:** Planilha_Financeira_Psicologos_v2.xlsx (upload para Supabase Storage)

## 11. Restricoes

- Sem shadcn/ui — Tailwind puro
- Sem sistema de admin (v1) — gerenciar via Supabase dashboard
- Sem cupons/descontos (v1)
- Sem SSR desnecessario — SSG + ISR onde possivel
- Mobile-first, 100% responsivo

## 12. Estrutura de Pastas

```
doislabs/
├── src/
│   ├── app/
│   │   ├── layout.tsx          (root layout, font, navbar, footer)
│   │   ├── page.tsx            (home)
│   │   ├── produtos/
│   │   │   ├── page.tsx        (catalogo)
│   │   │   └── [slug]/
│   │   │       └── page.tsx    (produto)
│   │   ├── minha-conta/
│   │   │   └── page.tsx
│   │   ├── sobre/
│   │   │   └── page.tsx
│   │   ├── sucesso/
│   │   │   └── page.tsx
│   │   ├── cancelado/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── checkout/
│   │       │   └── route.ts
│   │       ├── webhook/
│   │       │   └── route.ts
│   │       └── download/
│   │           └── [purchaseId]/
│   │               └── route.ts
│   ├── components/
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── product-card.tsx
│   │   └── faq-accordion.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       (browser client)
│   │   │   └── server.ts       (service role client)
│   │   ├── stripe.ts           (stripe instance)
│   │   └── utils.ts            (formatPrice, etc)
│   └── types/
│       └── index.ts            (Product, Purchase types)
├── public/
│   └── images/                 (logo, og-image, fallbacks)
├── .env.example
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```
