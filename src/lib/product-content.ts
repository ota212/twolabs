export interface ProductHighlight {
  icon: string;
  title: string;
  description: string;
}

export interface ProductSection {
  title: string;
  content: string;
  items?: string[];
}

export interface ProductFaq {
  q: string;
  a: string;
}

export interface ProductTestimonial {
  name: string;
  role: string;
  text: string;
}

export interface ProductContent {
  tagline: string;
  heroImage: string;
  area: string; // slug da área (ex: "psicologia")
  gallery: { src: string; alt: string }[];
  highlights: ProductHighlight[];
  sections: ProductSection[];
  audience: string[];
  closingLine: string;
  requirements?: string;
  faq?: ProductFaq[];
  testimonials?: ProductTestimonial[];
}

// ── Áreas temáticas ────────────────────────────────────────────────────────────

export interface ProductArea {
  slug: string;
  name: string;
  icon: string;
  description: string;
  comingSoon?: boolean;
}

export const PRODUCT_AREAS: ProductArea[] = [
  { slug: "psicologia", name: "Psicologia", icon: "🧠", description: "Ferramentas para o consultório" },
  { slug: "financas", name: "Finanças", icon: "💰", description: "Controle e gestão financeira" },
  { slug: "marketing", name: "Marketing", icon: "📣", description: "Estratégia e conteúdo", comingSoon: true },
  { slug: "produtividade", name: "Produtividade", icon: "⚡", description: "Organização e eficiência", comingSoon: true },
];

export const PRODUCT_CONTENT: Record<string, ProductContent> = {
  "planilha-mei": {
    tagline:
      "Chega de misturar conta pessoal com empresarial. Controle seu MEI sem complicação — do faturamento ao DAS, tudo automático.",
    heroImage: "/images/mei/hero.jpg",
    area: "financas",
    gallery: [
      { src: "/images/mei/painel.png", alt: "Painel do Negócio — KPIs, semáforo MEI e próximas contas" },
      { src: "/images/mei/faturamento.png", alt: "Faturamento — receitas e % do limite anual" },
      { src: "/images/mei/despesas.png", alt: "Despesas do Negócio — gastos por categoria" },
      { src: "/images/mei/das.png", alt: "Controle do DAS — status mensal Pago/Pendente/Vencido" },
    ],
    highlights: [
      {
        icon: "alert",
        title: "Semáforo do limite MEI",
        description:
          "Verde, amarelo ou vermelho — saiba exatamente o quanto já faturou e quando está perto dos R$130.000.",
      },
      {
        icon: "file",
        title: "DAS nunca mais atrasado",
        description:
          "Controle mensal com status Pago, Pendente ou VENCIDO. Alerta automático de vencimento todo mês.",
      },
      {
        icon: "chart",
        title: "Declaração anual sem susto",
        description:
          "A aba DASN-SIMEI gera automaticamente o relatório que você precisa para declarar o imposto anual.",
      },
      {
        icon: "zap",
        title: "Sem macros, sem VBA",
        description:
          "Funciona no Excel 2016+ e Google Sheets. Apenas fórmulas nativas — nada para quebrar.",
      },
    ],
    sections: [
      {
        title: "O que está incluído",
        content:
          "9 abas integradas que cobrem tudo que um MEI precisa para ter o negócio sob controle — do primeiro real faturado até a declaração anual.",
        items: [
          "**Painel do Negócio** — dashboard com faturamento do mês, acumulado no ano, total de gastos, semáforo do limite MEI e próximas contas a vencer",
          "**Faturamento** — registro de todas as receitas com totalizador mensal e percentual do limite anual consumido",
          "**Despesas** — gastos do negócio por categoria (equipamentos, marketing, impostos, etc.) com gráfico automático",
          "**Controle do DAS** — status de cada parcela mensal (Pago, Pendente ou VENCIDO) com cálculo por categoria MEI",
          "**Contas a Pagar** — alertas automáticos de vencimento para você nunca mais ser pego de surpresa",
          "**Notas Fiscais** — registro das NFs emitidas para controle e histórico",
          "**DASN-SIMEI** — relatório automático com os dados necessários para a declaração anual do MEI",
          "**Configurações** — setup inicial com nome da empresa, CNPJ e categoria MEI",
          "**Guia do MEI** — instruções em linguagem acessível para configurar e usar a planilha do zero",
        ],
      },
      {
        title: "Para quem foi feita",
        content:
          "A planilha foi construída para o MEI real — não para o MEI que tem contador, mas para quem gerencia tudo sozinho e precisa de clareza sem complexidade.",
        items: [
          "**MEI que não sabe o quanto faturou** — o semáforo mostra em tempo real se você está longe, perto ou no limite dos R$130.000",
          "**MEI que paga DAS com atraso** — o controle mensal mostra o status de cada parcela e avisa quando está vencendo",
          "**MEI que mistura pessoal com empresarial** — a aba de despesas é exclusiva para gastos do negócio, zero confusão",
          "**MEI que teme a declaração anual** — a aba DASN-SIMEI organiza os dados automaticamente para você não ter susto em janeiro",
        ],
      },
    ],
    audience: [
      "MEIs que não sabem se estão perto do limite de faturamento anual de R$130.000",
      "Quem esquece de pagar o DAS ou paga com atraso todo mês",
      "Quem mistura conta pessoal com empresarial e não sabe o lucro real do negócio",
      "Quem sofre na hora de fazer a declaração anual DASN-SIMEI",
    ],
    closingLine:
      "Você abriu um MEI para ter mais liberdade. Controlar as finanças é o que garante que essa liberdade dure.",
    requirements:
      "Microsoft Excel 2016+ ou Google Sheets. Sem macros, sem VBA — funciona em qualquer versão moderna.",
    faq: [
      {
        q: "Funciona no Google Sheets ou só no Excel?",
        a: "Funciona nos dois. Google Sheets e Microsoft Excel 2016 ou superior. Sem macros, sem VBA — apenas fórmulas nativas.",
      },
      {
        q: "Funciona para qualquer categoria de MEI?",
        a: "Sim. Na aba Configurações você seleciona sua categoria (Comércio, Serviços ou Indústria) e a planilha ajusta o cálculo do DAS automaticamente.",
      },
      {
        q: "O que é a DASN-SIMEI e por que preciso dela?",
        a: "É a Declaração Anual do Simples Nacional para MEI — obrigatória todo ano até 31 de maio. A planilha organiza automaticamente os dados que você precisa informar.",
      },
      {
        q: "Preciso de contador para usar?",
        a: "Não. A planilha foi feita para quem não tem formação financeira. Você preenche os campos simples e ela faz os cálculos.",
      },
      {
        q: "Como recebo a planilha após a compra?",
        a: "Imediatamente após o pagamento, você recebe acesso à sua conta. Lá encontra o link de download — disponível para sempre.",
      },
      {
        q: "Posso pedir reembolso?",
        a: "Sim — 7 dias de garantia incondicional. Se por qualquer motivo não ficar satisfeito, devolvemos 100% do valor.",
      },
    ],
  },

  "planilha-financeira-pessoal": {
    tagline:
      "Controle seu dinheiro sem complicação. Uma planilha pronta para usar — do salário ao orçamento, tudo automático.",
    heroImage: "/images/financeira-pessoal/hero.jpg",
    area: "financas",
    gallery: [
      { src: "/images/financeira-pessoal/dashboard.png", alt: "Dashboard — visão geral do mês" },
      { src: "/images/financeira-pessoal/receitas.png", alt: "Aba de Receitas — registro de entradas" },
      { src: "/images/financeira-pessoal/despesas.png", alt: "Aba de Despesas — controle de gastos por categoria" },
      { src: "/images/financeira-pessoal/cartao.png", alt: "Aba de Cartão de Crédito — faturas e parcelas" },
    ],
    highlights: [
      {
        icon: "chart",
        title: "Dashboard automático",
        description:
          "Receitas, despesas, saldo do mês e evolução ao longo do ano — tudo calculado em tempo real.",
      },
      {
        icon: "trending",
        title: "Orçamento inteligente",
        description:
          "Defina metas por categoria e acompanhe quanto já gastou — sem surpresa no fim do mês.",
      },
      {
        icon: "file",
        title: "Cartão de crédito sob controle",
        description:
          "Registre compras parceladas e veja a fatura do mês antes que ela chegue.",
      },
      {
        icon: "zap",
        title: "Sem macros, sem VBA",
        description:
          "Funciona no Excel 2016+ e Google Sheets. Apenas fórmulas nativas — nada para quebrar.",
      },
    ],
    sections: [
      {
        title: "O que está incluído",
        content:
          "7 abas que trabalham juntas de forma automática. Você preenche o básico e a planilha faz o resto.",
        items: [
          "**Dashboard** — visão completa do mês: receitas, despesas, saldo, gráficos e comparativos",
          "**Receitas** — registre salário, freelas, rendimentos e qualquer outra entrada",
          "**Despesas** — controle de gastos por categoria com totais automáticos",
          "**Cartão de Crédito** — compras parceladas, fatura do mês e próximas faturas",
          "**Orçamento** — metas mensais por categoria e acompanhamento de quanto já foi gasto",
          "**Metas** — objetivos financeiros de curto, médio e longo prazo com progresso",
          "**Guia de Uso** — instruções passo a passo para começar em minutos",
        ],
      },
      {
        title: "Como ela funciona",
        content:
          "A planilha vem com dados de exemplo (salário de R$4.500/mês e 52 lançamentos de despesas de Jan a Jun/2025) para você ver tudo funcionando. Depois é só apagar e colocar os seus.",
        items: [
          "**Design limpo e profissional** — verde escuro #1A4D2E e tipografia Arial em hierarquia clara",
          "**Células de entrada destacadas** — azul claro #E8F4FD indica exatamente onde você preenche",
          "**Fórmulas prontas** — totais, médias, saldos e gráficos atualizam sozinhos",
          "**Feito com openpyxl** — sem macros, sem VBA, compatível com qualquer versão moderna",
        ],
      },
    ],
    audience: [
      "Quem quer começar a controlar o dinheiro e não sabe por onde",
      "Quem tentou usar apps de finanças mas acabou abandonando",
      "Quem quer ter clareza sobre para onde o salário está indo todo mês",
      "Quem precisa organizar as faturas de cartão antes que elas escapem do controle",
    ],
    closingLine:
      "Controlar o dinheiro não precisa ser difícil. Precisa só de uma ferramenta que funciona.",
    requirements:
      "Microsoft Excel 2016+ ou Google Sheets. Sem macros, sem VBA — funciona em qualquer versão moderna.",
    faq: [
      {
        q: "Funciona no Google Sheets ou só no Excel?",
        a: "Funciona nos dois. Google Sheets e Microsoft Excel 2016 ou superior. Sem macros, sem VBA — apenas fórmulas nativas.",
      },
      {
        q: "Como recebo a planilha após a compra?",
        a: "Imediatamente após o pagamento, você recebe acesso à sua conta. Lá encontra o link de download — disponível para sempre.",
      },
      {
        q: "Funciona no Mac?",
        a: "Sim. O Excel para Mac e o Google Sheets (qualquer sistema) funcionam normalmente.",
      },
      {
        q: "Preciso saber usar Excel avançado?",
        a: "Não. A planilha já vem pronta com dados de exemplo. Você só precisa substituir pelos seus valores — todas as fórmulas já estão configuradas.",
      },
      {
        q: "Já vem com dados dentro?",
        a: "Sim. Ela vem com um exemplo completo (salário de R$4.500/mês e 52 lançamentos de despesas) para você ver tudo funcionando. Depois é só apagar e usar com os seus dados.",
      },
      {
        q: "Posso pedir reembolso?",
        a: "Sim — 7 dias de garantia incondicional. Se por qualquer motivo não ficar satisfeito, devolvemos 100% do valor.",
      },
    ],
  },

  "planilha-financeira-psicologos": {
    tagline:
      "Pare de adivinhar quanto você ganhou esse mês. Comece a gerenciar seu consultório como um negócio.",
    heroImage: "/images/planilha/hero.jpg",
    area: "psicologia",
    gallery: [
      { src: "/images/planilha/sessoes.png", alt: "Aba de Sessões — registro de cada atendimento" },
      { src: "/images/planilha/pacientes.png", alt: "Aba de Pacientes — cadastro e Risco de Churn" },
      { src: "/images/planilha/custos.png", alt: "Controle de Custos — visão mensal de despesas" },
      { src: "/images/planilha/recibo.png", alt: "Recibo de Honorários — pronto para imprimir" },
    ],
    highlights: [
      {
        icon: "chart",
        title: "Resumo mensal automático",
        description:
          "Total recebido, a receber, sessões realizadas, faltas e cancelamentos — tudo calculado.",
      },
      {
        icon: "trending",
        title: "Projeção de receita",
        description:
          "Saiba quanto vai entrar nos próximos meses com base na frequência dos seus pacientes ativos.",
      },
      {
        icon: "alert",
        title: "Risco de Churn",
        description:
          "Identifica pacientes que estão há muito tempo sem sessão, antes que abandonem o processo.",
      },
      {
        icon: "zap",
        title: "Sem macros, sem VBA",
        description:
          "Funciona no Excel 2016+ e Google Sheets. Sem nada para quebrar — apenas fórmulas.",
      },
    ],
    sections: [
      {
        title: "Como ela funciona",
        content:
          "A planilha é dividida em abas que trabalham juntas de forma automática. Você registra suas sessões, e a planilha cuida do resto.",
        items: [
          "**Pacientes** — cadastre cada um com valor padrão de sessão, frequência e tipo de atendimento (particular, convênio ou deslizante)",
          "**Sessões** — registre cada atendimento: data, paciente, presença, valor cobrado e status de pagamento",
          "**Resumo Mensal** — total recebido, total a receber, sessões realizadas, faltas e cancelamentos",
          "**Projeção Futura** — receita estimada com base na frequência e valor de cada paciente ativo",
          "**Risco de Churn** — pacientes que estão há muito tempo sem sessão são sinalizados automaticamente",
          "**Recibo** — geração automática em A4, pronto para imprimir",
        ],
      },
    ],
    audience: [
      "Psicólogos que atendem de forma particular e precisam ter clareza sobre seu financeiro",
      "Quem tem entre 5 e 30 pacientes e quer parar de gerenciar tudo na cabeça",
      "Quem quer crescer de forma sustentável e sabe que entender os números é o primeiro passo",
    ],
    closingLine:
      "Porque cuidar de pessoas é sua vocação. Mas cuidar do seu negócio é o que vai garantir que você continue fazendo isso por muito tempo.",
    requirements:
      "Microsoft Excel 2016+ ou Google Sheets. Sem macros, sem VBA — funciona em qualquer versão.",
    testimonials: [
      {
        name: "Ana Paula M.",
        role: "Psicóloga clínica — SP",
        text: "Finalmente consigo ver quanto realmente entrou no mês. Antes disso eu vivia no escuro com o financeiro do consultório.",
      },
      {
        name: "Renata C.",
        role: "Psicóloga — Atendimento particular",
        text: "O alerta de Risco de Churn me surpreendeu — identifiquei dois pacientes que eu ia perder sem perceber. Indispensável.",
      },
      {
        name: "Mariana T.",
        role: "Psicóloga — RJ",
        text: "Configurei em menos de 30 minutos e já vi o valor. A projeção de receita me ajudou muito a planejar os próximos meses.",
      },
    ],
    faq: [
      {
        q: "Funciona no Google Sheets ou só no Excel?",
        a: "Funciona nos dois. Google Sheets e Microsoft Excel 2016 ou superior. Sem macros, sem VBA — apenas fórmulas nativas.",
      },
      {
        q: "Como recebo a planilha após a compra?",
        a: "Imediatamente após o pagamento, você recebe acesso à sua conta. Lá encontra o link de download — disponível para sempre.",
      },
      {
        q: "Funciona no Mac?",
        a: "Sim. O Excel para Mac e o Google Sheets (qualquer sistema) funcionam normalmente.",
      },
      {
        q: "Posso pedir reembolso?",
        a: "Sim — 7 dias de garantia incondicional. Se por qualquer motivo não ficar satisfeito, devolvemos 100% do valor.",
      },
      {
        q: "Preciso saber usar Excel avançado?",
        a: "Não. A planilha é projetada para quem não é técnico. Você preenche os campos básicos e ela faz os cálculos automaticamente.",
      },
    ],
  },

  "pack-documentos-psicologos": {
    tagline:
      "Abra seu consultório com segurança e profissionalismo — desde a primeira sessão.",
    heroImage: "/images/pack/hero.jpg",
    area: "psicologia",
    gallery: [],
    highlights: [
      {
        icon: "file",
        title: "10 documentos profissionais",
        description:
          "Tudo que você precisa para conduzir seu consultório com segurança legal e ética.",
      },
      {
        icon: "shield",
        title: "Conformidade com o CFP",
        description:
          "Desenvolvidos em conformidade com as resoluções do Conselho Federal de Psicologia.",
      },
      {
        icon: "edit",
        title: "100% editável",
        description:
          "Google Docs — personalize com seu nome, CRP e identidade visual em minutos.",
      },
      {
        icon: "zap",
        title: "Pronto para usar",
        description:
          "Abra, personalize e comece a atender. Sem software pago, sem complicação.",
      },
    ],
    sections: [
      {
        title: "O que está incluído",
        content:
          "O pack reúne todos os documentos que um psicólogo precisa para conduzir seu consultório com profissionalismo:",
        items: [
          "**Contrato de Prestação de Serviços Psicológicos** — honorários, cancelamento, sigilo e rescisão",
          "**Termo de Consentimento Livre e Esclarecido (TCLE)** — em conformidade com a Resolução CFP 010/05",
          "**Ficha de Anamnese Adulto** — identificação, queixa principal, histórico, hábitos e expectativas",
          "**Ficha de Anamnese Criança e Adolescente** — versão adaptada para atendimento infanto-juvenil",
          "**Ficha de Evolução e Prontuário** — conforme Resolução CFP 001/2009",
          "**Plano Terapêutico** — objetivos, estratégias e indicadores de progresso",
          "**Declaração de Comparecimento** — a solicitação mais frequente, resolvida em segundos",
          "**Relatório Psicológico** — baseado na Resolução CFP 006/2019",
          "**Recibo de Pagamento** — registro financeiro simplificado",
          "**Termo de Encerramento** — formaliza o fim do acompanhamento de forma ética",
        ],
      },
    ],
    audience: [
      "Psicólogos recém-formados abrindo o primeiro consultório",
      "Quem atende de forma particular e quer profissionalizar a experiência do paciente",
      "Quem usa documentos genéricos da internet e quer materiais alinhados à ética do CFP",
    ],
    closingLine:
      "Você passou anos estudando psicologia. Agora é hora de exercê-la com a estrutura que ela merece.",
    requirements: "Google Docs — sem necessidade de software pago.",
    testimonials: [
      {
        name: "Juliana F.",
        role: "Psicóloga recém-formada — MG",
        text: "Abri meu consultório com esses documentos. Economizei horas pesquisando modelos na internet e ainda fiquei tranquila sobre a parte ética.",
      },
      {
        name: "Carolina S.",
        role: "Psicóloga clínica — SP",
        text: "O contrato de prestação de serviços resolveu um problema que eu tinha faz tempo. Profissional, claro e alinhado ao CFP.",
      },
      {
        name: "Beatriz N.",
        role: "Psicóloga — Atendimento online",
        text: "Personalizar é muito simples. Em menos de 1 hora já tinha todos os documentos com meu nome, CRP e identidade visual.",
      },
    ],
    faq: [
      {
        q: "O que é Google Docs e preciso pagar?",
        a: "Google Docs é o editor de documentos gratuito do Google. Você acessa pelo navegador ou celular — sem nenhum custo.",
      },
      {
        q: "Como personalizo os documentos?",
        a: "Basta abrir cada documento no Google Docs e substituir os campos em colchetes ([NOME DO PROFISSIONAL], [CRP], etc.) pelos seus dados.",
      },
      {
        q: "Funciona no Microsoft Word?",
        a: "Sim. Você pode exportar qualquer documento do Google Docs para .docx e editar no Word normalmente.",
      },
      {
        q: "Os documentos estão de acordo com o CFP?",
        a: "Sim. Todos foram desenvolvidos com base nas resoluções vigentes do Conselho Federal de Psicologia — TCLE, prontuário, relatório e demais.",
      },
      {
        q: "Posso pedir reembolso?",
        a: "Sim — 7 dias de garantia incondicional. Se por qualquer motivo não ficar satisfeito, devolvemos 100% do valor.",
      },
    ],
  },
};
