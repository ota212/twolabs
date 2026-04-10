export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PostHog card */}
        <div className="bg-white rounded-xl border border-navy/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h2 className="font-bold">PostHog</h2>
              <p className="text-xs text-navy/50">Analytics completo do site</p>
            </div>
          </div>
          <p className="text-sm text-navy/60 mb-4">
            Acesse o dashboard do PostHog para visualizar métricas detalhadas: visitantes, page views, heatmaps, gravação de sessões e funis de conversão.
          </p>
          <a
            href="https://us.posthog.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-electric-blue text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-electric-blue/90 transition-colors"
          >
            Abrir PostHog
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Features list */}
        <div className="bg-white rounded-xl border border-navy/5 p-6">
          <h2 className="font-bold mb-4">O que você pode ver no PostHog</h2>
          <ul className="space-y-3">
            {[
              { icon: "👥", title: "Visitantes", desc: "Visitantes únicos, page views, sessões" },
              { icon: "🖱️", title: "Click tracking", desc: "Rastreio automático de cliques em botões e links" },
              { icon: "🔥", title: "Heatmaps", desc: "Mapa de calor visual de onde os usuários clicam" },
              { icon: "🎥", title: "Gravação de sessões", desc: "Assista o que os usuários fazem no site em tempo real" },
              { icon: "🔄", title: "Funis", desc: "Conversão: página do produto → checkout → compra" },
              { icon: "📍", title: "Referral sources", desc: "De onde vêm seus visitantes (Google, Instagram, direto)" },
            ].map((item) => (
              <li key={item.title} className="flex gap-3">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-navy/50">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-navy/[0.03] rounded-xl p-6">
        <h2 className="font-bold mb-3">Como acessar os heatmaps</h2>
        <ol className="space-y-2 text-sm text-navy/70">
          <li><strong>1.</strong> Abra o PostHog no botão acima</li>
          <li><strong>2.</strong> No menu lateral, clique em <strong>&quot;Heatmaps&quot;</strong></li>
          <li><strong>3.</strong> Selecione a URL que deseja analisar (ex: /produtos/planilha-financeira-psicologos)</li>
          <li><strong>4.</strong> O mapa de calor mostra onde os visitantes mais clicam</li>
        </ol>
        <p className="text-xs text-navy/40 mt-3">
          Os heatmaps e gravações são preenchidos automaticamente enquanto o PostHog está ativo no site.
        </p>
      </div>
    </div>
  );
}
