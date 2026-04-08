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

export interface ProductContent {
  tagline: string;
  heroImage: string;
  gallery: { src: string; alt: string }[];
  highlights: ProductHighlight[];
  sections: ProductSection[];
  audience: string[];
  closingLine: string;
  requirements?: string;
}

export const PRODUCT_CONTENT: Record<string, ProductContent> = {
  "planilha-financeira-psicologos": {
    tagline:
      "Pare de adivinhar quanto você ganhou esse mês. Comece a gerenciar seu consultório como um negócio.",
    heroImage: "/images/planilha/hero.jpg",
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
  },

  "pack-documentos-psicologos": {
    tagline:
      "Abra seu consultório com segurança e profissionalismo — desde a primeira sessão.",
    heroImage: "/images/pack/hero.jpg",
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
  },
};
