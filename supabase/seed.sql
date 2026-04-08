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

-- Seed products

-- 1. Planilha Financeira para Psicólogos
INSERT INTO public.products (slug, name, description, price_cents, category, file_path, is_active)
VALUES (
  'planilha-financeira-psicologos',
  'Planilha Financeira para Psicólogos',
  '## Pare de adivinhar quanto você ganhou esse mês. Comece a gerenciar seu consultório como um negócio.

A maioria dos psicólogos iniciantes tem o mesmo problema financeiro: não sabe exatamente quanto recebeu, quantas sessões realizou, quais pacientes estão em dia e quanto vai entrar no próximo mês. O dinheiro aparece e some sem deixar rastro — e no final do mês a sensação é de que se trabalhou muito para sobrar pouco.

Esse problema não é falta de disciplina. É falta de ferramenta.

A **Planilha Financeira para Psicólogos** foi desenvolvida especificamente para a realidade do consultório particular, com uma lógica simples: você registra suas sessões, e a planilha cuida do resto.

## Como ela funciona

A planilha é dividida em abas que trabalham juntas de forma automática.

Na aba de **Pacientes**, você cadastra cada um com suas informações básicas: valor padrão de sessão, frequência de atendimento e tipo (particular, convênio ou deslizante). Esse cadastro alimenta todas as projeções futuras.

Na aba de **Sessões**, você registra cada atendimento realizado: data, paciente, presença, valor cobrado e status de pagamento. Esse é o coração da planilha — cada linha é um registro histórico imutável da sua prática clínica e financeira.

A partir daí, a planilha gera automaticamente seu **resumo mensal**: total recebido, total a receber, sessões realizadas, faltas e cancelamentos. Você também visualiza sua **projeção de receita futura**, calculada com base na frequência e no valor de cada paciente ativo — o que permite planejar seus meses com antecedência real, não com chutes.

Um recurso que poucos esperam encontrar: o **Risco de Churn**. A planilha identifica automaticamente pacientes que estão há muito tempo sem sessão, sinalizando quem pode estar abandonando o processo. Isso permite que você tome uma ação — uma mensagem, um reagendamento — antes de perder definitivamente aquele paciente.

## Para quem é essa planilha

- Para psicólogos que atendem de forma particular e precisam ter clareza sobre seu financeiro sem precisar de um contador ou de um sistema caro de gestão
- Para quem tem entre 5 e 30 pacientes e quer parar de gerenciar tudo na cabeça ou em anotações espalhadas
- Para quem quer crescer de forma sustentável e sabe que entender os números é o primeiro passo

## Simples de usar. Poderosa o suficiente para crescer com você.

Não é necessário saber Excel ou ter experiência com planilhas. Você preenche os campos indicados, e a lógica já está toda construída. O design foi pensado para ser limpo, agradável e fácil de navegar — porque você vai abrir essa planilha toda semana, e ela precisa ser um aliado, não mais uma tarefa.

**Requisitos:** Microsoft Excel 2016+ ou Google Sheets. Sem macros, sem VBA — funciona em qualquer versão.

**Garantia:** 7 dias de garantia incondicional. Se não gostar, devolvemos 100% do valor.

*Porque cuidar de pessoas é sua vocação. Mas cuidar do seu negócio é o que vai garantir que você continue fazendo isso por muito tempo.*',
  4700,
  'planilhas',
  'planilha-financeira-psicologos/Planilha_Financeira_Psicologos_v2.xlsx',
  true
);

-- 2. Pack de Documentos Essenciais para Psicólogos
INSERT INTO public.products (slug, name, description, price_cents, category, file_path, is_active)
VALUES (
  'pack-documentos-psicologos',
  'Pack de Documentos Essenciais para Psicólogos',
  '## Abra seu consultório com segurança e profissionalismo — desde a primeira sessão.

Você estudou anos para chegar até aqui. Mas ninguém te ensinou como abrir um consultório. Ninguém te explicou o que assinar com o paciente antes da primeira sessão, como registrar sua evolução clínica do jeito certo, ou o que fazer quando o paciente pede uma declaração de comparecimento. Essas lacunas — burocráticas, mas importantes — aparecem logo nos primeiros dias de atendimento e podem deixar qualquer psicólogo iniciante se sentindo despreparado.

O **Pack de Documentos Essenciais para Psicólogos** foi criado exatamente para preencher esse espaço.

São **10 documentos profissionais**, editáveis no Google Docs, desenvolvidos em conformidade com as resoluções do Conselho Federal de Psicologia. Você personaliza com seu nome, CRP e identidade visual, e já está pronto para atender com segurança legal e ética desde o dia um.

## O que está incluído

O pack reúne todos os documentos que um psicólogo precisa para conduzir seu consultório com profissionalismo:

- **Contrato de Prestação de Serviços Psicológicos** — protege você e o paciente, deixando claro honorários, política de cancelamento, sigilo e rescisão
- **Termo de Consentimento Livre e Esclarecido (TCLE)** — garante que o paciente inicia o processo ciente de seus direitos e deveres, em conformidade com a Resolução CFP 010/05
- **Ficha de Anamnese Adulto** — roteiro completo de avaliação inicial: identificação, queixa principal, histórico familiar, hábitos de vida e expectativas terapêuticas
- **Ficha de Anamnese Criança e Adolescente** — versão adaptada para atendimento infanto-juvenil
- **Ficha de Evolução e Prontuário** — registros de sessão dentro do que exige a Resolução CFP 001/2009, com estrutura clara para conteúdo, intervenções e observações clínicas
- **Plano Terapêutico** — documentação de objetivos, estratégias e indicadores de progresso
- **Declaração de Comparecimento** — resolve em segundos uma das solicitações mais frequentes dos pacientes
- **Relatório Psicológico** — template estruturado baseado na Resolução CFP 006/2019, para laudos e encaminhamentos
- **Recibo de Pagamento** — simplifica o registro financeiro de quem ainda não emite nota fiscal
- **Termo de Encerramento do Processo Terapêutico** — formaliza o fim do acompanhamento de forma ética e cuidadosa

## Para quem é esse pack

- Para psicólogos recém-formados que estão abrindo o primeiro consultório e não sabem por onde começar a parte burocrática
- Para quem atende de forma particular e quer profissionalizar a experiência que entrega ao paciente
- Para quem usa documentos genéricos da internet e sabe que chegou a hora de ter materiais próprios, alinhados à ética do CFP

## Tudo editável, tudo seu.

Cada documento é entregue em formato Google Docs, o que significa que você abre, personaliza com seu nome e CRP, imprime ou compartilha digitalmente — sem precisar de nenhum software pago. O cabeçalho é completamente editável para você colocar sua identidade visual. Os textos são redigidos em linguagem clara, mas juridicamente consistente.

**Garantia:** 7 dias de garantia incondicional. Se não gostar, devolvemos 100% do valor.

*Você passou anos estudando psicologia. Agora é hora de exercê-la com a estrutura que ela merece.*',
  3700,
  'documentos',
  'pack-documentos-psicologos/Pack_Documentos_Psicologos.zip',
  true
);
