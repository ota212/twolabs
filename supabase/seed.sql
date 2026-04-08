-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
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

-- Create purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid REFERENCES auth.users(id),
  product_id        uuid REFERENCES public.products(id),
  stripe_session_id text UNIQUE,
  status            text DEFAULT 'completed',
  created_at        timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Products: public read
CREATE POLICY "Products are publicly readable"
  ON public.products FOR SELECT
  USING (true);

-- Purchases: user can read own
CREATE POLICY "Users can read own purchases"
  ON public.purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Purchases: service role can insert (webhook)
CREATE POLICY "Service role can insert purchases"
  ON public.purchases FOR INSERT
  WITH CHECK (true);

-- Seed first product
INSERT INTO public.products (slug, name, description, price_cents, category, file_path, is_active)
VALUES (
  'planilha-financeira-psicologos',
  'Planilha Financeira para Psicólogos',
  '## O que é

Planilha Excel completa para psicólogos autônomos. Gerencie pacientes, sessões, pagamentos, imposto (carnê-leão) e visualize suas finanças com um dashboard completo.

## O que inclui

- **10 abas** organizadas por função
- **Gestão de pacientes** — cadastro, status, histórico
- **Controle de sessões** — agenda, frequência, valores
- **Financeiro** — receitas, despesas, carnê-leão
- **Dashboard** — KPIs, gráficos, visão geral
- **Recibo** — geração automática em A4
- **Exportação para contador** — dados prontos para enviar

## Requisitos

- Microsoft Excel 2016+ ou Google Sheets
- Sem macros, sem VBA — funciona em qualquer versão

## Garantia

7 dias de garantia incondicional. Se não gostar, devolvemos 100% do valor.',
  4700,
  'planilhas',
  'planilha-financeira-psicologos/Planilha_Financeira_Psicologos_v2.xlsx',
  true
);
