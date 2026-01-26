<template>
  <button 
    @click="generatePDF"
    :disabled="isGenerating"
    class="h-10 px-4 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-medium text-sm rounded-xl flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white active:scale-[0.98] transition-all disabled:opacity-50"
  >
    <FileDown :size="16" />
    <span>{{ isGenerating ? 'Gerando...' : 'Relatório' }}</span>
  </button>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { FileDown } from 'lucide-vue-next'
import { jsPDF } from 'jspdf'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()
const isGenerating = ref(false)

// Dados do store
const geocodingResult = computed(() => globalStore.orchestratorResponse?.geocoding_result)
const fireRiskResult = computed(() => globalStore.orchestratorResponse?.fire_risk_result)
const weatherResult = computed(() => globalStore.orchestratorResponse?.weather_result)

// Logo SVG para uso no PDF
const logoSvgString = `<svg width="338" height="387" viewBox="0 0 338 387" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M61.3469 147.919C66.5479 138.251 71.4522 128.409 76.9974 118.942C116.223 51.9763 174.89 13.4524 250.939 0.558899C253.818 0.0707399 256.805 0.218995 261.141 0C261.141 4.16125 261.161 7.67767 261.138 11.1939C260.991 33.5779 265.146 55.0029 276.424 74.5444C286.405 91.8397 296.791 108.909 307.314 125.882C318.237 143.502 328.836 161.352 333.056 181.876C345.95 244.587 328.633 298.626 281.596 341.226C232.674 385.533 174.672 397.749 112.325 375.661C49.5788 353.431 12.8025 307.06 2.13518 241.447C-4.40132 201.242 4.24468 163.265 25.6736 128.417C26.544 127.002 27.5156 125.643 28.5173 124.317C28.9058 123.802 29.509 123.449 30.952 122.232C39.1774 130.544 47.4917 138.946 56.6822 148.28C59.4282 150.561 60.8002 150.451 61.3469 147.919ZM43.2946 236.268C53.8473 305.912 119.719 354.973 191.19 342.072C249.616 331.526 294.618 278.911 295.501 219.682C295.823 198.005 289.883 178.139 279.206 159.683C270.706 144.989 261.268 130.836 252.177 116.486C239.804 96.9542 228.967 76.7795 225.043 53.5957C224.789 52.0974 223.765 50.7295 222.756 48.5643C204.269 54.8976 187.434 63.3387 171.597 73.8782C132.266 100.053 108.312 137.651 92.8888 182.466C80.5166 172.89 71.7192 161.535 59.7237 152.604C44.4241 178.937 39.4513 205.836 43.2946 236.268Z" fill="#F46814"/>
<path d="M43.1979 235.389C39.4513 205.836 44.4241 178.937 59.7236 152.605C71.7191 161.535 80.5166 172.89 92.8888 182.466C108.312 137.651 132.266 100.054 171.597 73.8783C187.434 63.3388 204.269 54.8977 222.756 48.5645C223.765 50.7296 224.789 52.0975 225.043 53.5958C228.967 76.7796 239.803 96.9543 252.177 116.486C261.268 130.836 270.706 144.99 279.206 159.683C289.883 178.139 295.823 198.005 295.501 219.682C294.618 278.912 249.616 331.526 191.19 342.072C119.719 354.973 53.8473 305.912 43.1979 235.389Z" fill="#F7B58A"/>
</svg>`

const svgToDataURL = (svg) => 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))
const logoDataURL = svgToDataURL(logoSvgString)

// Helpers
const getRiskLabel = (p) => p < 20 ? 'Mínimo' : p < 40 ? 'Baixo' : p < 60 ? 'Moderado' : p < 80 ? 'Elevado' : 'Extremo'
const getRiskColor = (p) => p < 20 ? '#10b981' : p < 40 ? '#14b8a6' : p < 60 ? '#f59e0b' : p < 80 ? '#f97316' : '#e11d48'
const formatDate = (d) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
const formatDayShort = (iso) => { try { return new Date(iso).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' }).replace('.', '') } catch { return '—' } }

// CSS base isolado para o PDF (não afeta a interface)
const getBaseStyles = () => `
  #pdf-isolated-container * { box-sizing: border-box; margin: 0; padding: 0; }
  #pdf-isolated-container { font-family: 'Times New Roman', Georgia, serif !important; color: #1a1a1a; line-height: 1.6; }
  #pdf-isolated-container .pdf-page { width: 794px; min-height: 1123px; padding: 60px 70px; background: white; position: relative; font-family: 'Times New Roman', Georgia, serif !important; }
  #pdf-isolated-container .pdf-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 2px solid #1a1a1a; margin-bottom: 30px; }
  #pdf-isolated-container .logo-section { display: flex; align-items: center; gap: 12px; }
  #pdf-isolated-container .logo-section img { width: 36px; height: 36px; }
  #pdf-isolated-container .brand { font-size: 20px; font-weight: 700; color: #f97316; font-family: 'Helvetica Neue', Arial, sans-serif !important; }
  #pdf-isolated-container .page-num { font-size: 11px; color: #666; font-family: 'Times New Roman', Georgia, serif !important; }
  #pdf-isolated-container h1 { font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #1a1a1a; font-family: 'Times New Roman', Georgia, serif !important; }
  #pdf-isolated-container h2 { font-size: 16px; font-weight: 700; margin: 24px 0 12px 0; color: #1a1a1a; border-bottom: 1px solid #ddd; padding-bottom: 6px; font-family: 'Times New Roman', Georgia, serif !important; }
  #pdf-isolated-container h3 { font-size: 14px; font-weight: 700; margin: 16px 0 8px 0; color: #333; font-family: 'Times New Roman', Georgia, serif !important; }
  #pdf-isolated-container p { font-size: 12px; text-align: justify; margin-bottom: 12px; font-family: 'Times New Roman', Georgia, serif !important; }
  #pdf-isolated-container .subtitle { font-size: 14px; color: #666; margin-bottom: 20px; }
  #pdf-isolated-container .meta { font-size: 11px; color: #888; margin-bottom: 4px; }
  #pdf-isolated-container table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 11px; font-family: 'Times New Roman', Georgia, serif !important; }
  #pdf-isolated-container th, #pdf-isolated-container td { border: 1px solid #ddd; padding: 8px 10px; text-align: left; }
  #pdf-isolated-container th { background: #f5f5f5; font-weight: 600; }
  #pdf-isolated-container .highlight-box { background: #fff8f0; border: 1px solid #f97316; border-radius: 8px; padding: 16px; margin: 16px 0; }
  #pdf-isolated-container .risk-indicator { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: 600; font-size: 11px; }
  #pdf-isolated-container .chart-container { background: #fafafa; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 16px 0; }
  #pdf-isolated-container .chart-title { font-size: 12px; font-weight: 600; margin-bottom: 12px; color: #333; }
  #pdf-isolated-container .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 120px; padding: 10px 0; }
  #pdf-isolated-container .bar-item { flex: 1; display: flex; flex-direction: column; align-items: center; }
  #pdf-isolated-container .bar { width: 100%; border-radius: 4px 4px 0 0; min-height: 4px; }
  #pdf-isolated-container .bar-label { font-size: 9px; color: #666; margin-top: 6px; text-align: center; }
  #pdf-isolated-container .bar-value { font-size: 10px; font-weight: 600; margin-bottom: 4px; }
  #pdf-isolated-container .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 16px 0; }
  #pdf-isolated-container .stat-box { background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 6px; padding: 12px; text-align: center; }
  #pdf-isolated-container .stat-value { font-size: 20px; font-weight: 700; color: #1a1a1a; }
  #pdf-isolated-container .stat-label { font-size: 10px; color: #666; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  #pdf-isolated-container .stat-unit { font-size: 11px; color: #888; }
  #pdf-isolated-container .pdf-footer { position: absolute; bottom: 40px; left: 70px; right: 70px; display: flex; justify-content: space-between; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 12px; }
  #pdf-isolated-container .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.03; pointer-events: none; }
  #pdf-isolated-container ul, #pdf-isolated-container ol { margin: 12px 0 12px 24px; font-size: 12px; font-family: 'Times New Roman', Georgia, serif !important; }
  #pdf-isolated-container li { margin-bottom: 6px; }
  #pdf-isolated-container .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
`

// Função para criar uma página do PDF
const createPage = (pageNum, content) => {
  const geo = geocodingResult.value || {}
  return `
    <div class="pdf-page">
      <div class="watermark"><img src="${logoDataURL}" width="400" /></div>
      ${pageNum > 1 ? `
        <div class="pdf-header">
          <div class="logo-section">
            <img src="${logoDataURL}" />
            <span class="brand">FlamaAI</span>
          </div>
          <span class="page-num">Página ${pageNum}</span>
        </div>
      ` : ''}
      ${content}
      ${pageNum > 1 ? `
        <div class="pdf-footer">
          <span>FlamaAI - Relatório Técnico</span>
          <span>${formatDate(new Date())}</span>
        </div>
      ` : ''}
    </div>
  `
}

// Função para gerar relatório técnico-acadêmico
const generatePDF = async () => {
  isGenerating.value = true
  
  try {
    const html2canvas = (await import('html2canvas')).default
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const pageWidth = 210
    const pageHeight = 297
    
    // Dados
    const geo = geocodingResult.value || {}
    const fire = fireRiskResult.value || {}
    const weather = weatherResult.value || {}
    const preference = geo.preference || 'weather'
    
    const dailyRisks = fire.daily_risks || []
    const todayRisk = dailyRisks.length > 0 ? (dailyRisks[0].risk || 0) : (fire.weekly_risk_mean || 0)
    const todayRiskPercent = todayRisk * 100
    const weeklyRiskPercent = (fire.weekly_risk_mean || 0) * 100
    
    const weatherFuture = weather.weather_future_7d?.[0]?.daily || {}
    const weatherPast = weather.weather_past_7d?.[0]?.daily || {}
    
    const safeLast = (arr) => Array.isArray(arr) && arr.length ? arr[arr.length - 1] : null
    const currentTempMax = weatherFuture.temperature_2m_max?.[0] ?? safeLast(weatherPast.temperature_2m_max) ?? 0
    const currentHumidity = weatherFuture.relative_humidity_2m_mean?.[0] ?? safeLast(weatherPast.relative_humidity_2m_mean) ?? 0
    const currentWindMax = weatherFuture.windspeed_10m_max?.[0] ?? safeLast(weatherPast.windspeed_10m_max) ?? 0
    const currentUvMax = weatherFuture.uv_index_max?.[0] ?? safeLast(weatherPast.uv_index_max) ?? 0
    
    const precipData = weatherFuture.precipitation_sum || []
    const tempMaxData = weatherFuture.temperature_2m_max || []
    const humidityData = weatherFuture.relative_humidity_2m_mean || []
    const windData = weatherFuture.windspeed_10m_max || []
    const timeData = weatherFuture.time || []
    
    // Conteúdo das páginas
    const pages = [
      // PÁGINA 1: CAPA
      createPage(1, `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; min-height: 900px;">
          <img src="${logoDataURL}" width="80" style="margin-bottom: 30px;" />
          <h1 style="font-size: 32px; margin-bottom: 12px; font-family: 'Helvetica Neue', Arial, sans-serif !important;">FlamaAI</h1>
          <p style="font-size: 14px; color: #666; margin-bottom: 40px; text-align: center;">Sistema Inteligente de Análise e Previsão de Risco de Incêndios</p>
          <div style="border-top: 2px solid #f97316; border-bottom: 2px solid #f97316; padding: 30px 0; margin: 20px 0; width: 100%;">
            <h1 style="font-size: 22px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px;">Relatório Técnico de Análise</h1>
            <h2 style="font-size: 18px; border: none; margin: 0; padding: 0;">Risco de Fogo para ${geo.cidade || 'Localização'}, ${geo.state || geo.estado || 'Estado'}</h2>
          </div>
          <div style="margin-top: 40px;">
            <p class="meta">Coordenadas: ${(geo.lat || 0).toFixed(6)}, ${(geo.lng || 0).toFixed(6)}</p>
            <p class="meta">Endereço: ${geo.publicPlace || geo.logradouro || 'N/A'}, ${geo.neighborhood || geo.bairro || 'N/A'}</p>
            <p class="meta" style="margin-top: 20px;">Data de Geração: ${formatDate(new Date())}</p>
            <p class="meta">Período de Análise: Próximos 7 dias</p>
          </div>
          <div style="position: absolute; bottom: 80px; text-align: center; width: 100%;">
            <p style="font-size: 11px; color: #888;">Documento gerado automaticamente pelo sistema FlamaAI</p>
            <p style="font-size: 10px; color: #aaa;">Para fins de análise técnica e acadêmica</p>
          </div>
        </div>
      `),
      
      // PÁGINA 2: INTRODUÇÃO E SUMÁRIO
      createPage(2, `
        <h2>1. Introdução</h2>
        <p>Os incêndios florestais representam uma das maiores ameaças ambientais do século XXI, causando impactos devastadores em ecossistemas, comunidades e economias. No Brasil, país com vasta extensão territorial e biodiversidade única, o monitoramento e previsão de risco de fogo tornam-se ferramentas essenciais para a gestão ambiental e proteção civil.</p>
        <p>O sistema FlamaAI foi desenvolvido com o objetivo de fornecer análises preditivas de risco de incêndio baseadas em dados meteorológicos e climáticos. Utilizando técnicas de processamento de dados e inteligência artificial, o sistema integra múltiplas variáveis atmosféricas para calcular índices de risco confiáveis e interpretáveis.</p>
        <p>Este relatório apresenta a análise de risco de fogo para a localidade de <strong>${geo.cidade || 'N/A'}, ${geo.state || geo.estado || 'N/A'}</strong>, considerando dados meteorológicos atuais e projeções para os próximos 7 dias.</p>
        
        <h2>2. Sumário Executivo</h2>
        <div class="highlight-box">
          <p style="margin-bottom: 8px;"><strong>Localização Analisada:</strong> ${geo.cidade || 'N/A'}, ${geo.state || geo.estado || 'N/A'}</p>
          <p style="margin-bottom: 8px;"><strong>Coordenadas:</strong> ${(geo.lat || 0).toFixed(6)}°, ${(geo.lng || 0).toFixed(6)}°</p>
          <p style="margin-bottom: 8px;"><strong>Risco Atual:</strong> <span class="risk-indicator" style="background: ${getRiskColor(todayRiskPercent)}20; color: ${getRiskColor(todayRiskPercent)}">${todayRiskPercent.toFixed(0)}% - ${getRiskLabel(todayRiskPercent)}</span></p>
          <p style="margin-bottom: 0;"><strong>Média Semanal:</strong> ${weeklyRiskPercent.toFixed(0)}%</p>
        </div>
        <p>A análise indica que a região apresenta risco de fogo classificado como <strong>${getRiskLabel(todayRiskPercent)}</strong> para o dia atual, com índice de ${todayRiskPercent.toFixed(1)}%. A média projetada para os próximos 7 dias é de ${weeklyRiskPercent.toFixed(1)}%, o que sugere ${weeklyRiskPercent > 60 ? 'condições preocupantes que demandam atenção e possíveis medidas preventivas' : weeklyRiskPercent > 40 ? 'condições moderadas que requerem monitoramento contínuo' : 'condições relativamente favoráveis, embora o monitoramento deva ser mantido'}.</p>
        
        <h2>3. Metodologia</h2>
        <h3>3.1 Fontes de Dados</h3>
        <p>Os dados meteorológicos utilizados nesta análise são obtidos através da API Open-Meteo, que fornece informações climáticas de alta resolução espacial e temporal. A plataforma agrega dados de múltiplos modelos meteorológicos globais e regionais, garantindo precisão e confiabilidade nas previsões.</p>
        
        <h3>3.2 Variáveis Utilizadas</h3>
        <table>
          <tr><th>Variável</th><th>Unidade</th><th>Descrição</th></tr>
          <tr><td>Temperatura Máxima</td><td>°C</td><td>Temperatura máxima diária a 2m do solo</td></tr>
          <tr><td>Umidade Relativa</td><td>%</td><td>Umidade relativa média diária</td></tr>
          <tr><td>Velocidade do Vento</td><td>km/h</td><td>Velocidade máxima do vento a 10m</td></tr>
          <tr><td>Precipitação</td><td>mm</td><td>Acumulado de precipitação diária</td></tr>
          <tr><td>Índice UV</td><td>-</td><td>Índice ultravioleta máximo</td></tr>
        </table>
      `),
      
      // PÁGINA 3: RESULTADOS
      createPage(3, `
        <h3>3.3 Modelo de Cálculo de Risco</h3>
        <p>O índice de risco de fogo é calculado através de um modelo multiparâmetrico que considera a interação entre as variáveis meteorológicas. O algoritmo atribui pesos diferenciados a cada fator com base em sua correlação histórica com ocorrências de incêndios:</p>
        <ul>
          <li><strong>Temperatura elevada:</strong> Aumenta a evapotranspiração e resseca a vegetação</li>
          <li><strong>Baixa umidade:</strong> Reduz o teor de água nos combustíveis vegetais</li>
          <li><strong>Vento intenso:</strong> Acelera a propagação e dificulta o combate</li>
          <li><strong>Ausência de precipitação:</strong> Mantém condições de seca prolongada</li>
        </ul>
        
        <h2>4. Análise dos Resultados</h2>
        <h3>4.1 Condições Meteorológicas Atuais</h3>
        <div class="stats-grid">
          <div class="stat-box"><div class="stat-value">${currentTempMax.toFixed(1)}</div><div class="stat-unit">°C</div><div class="stat-label">Temperatura</div></div>
          <div class="stat-box"><div class="stat-value">${currentHumidity.toFixed(0)}</div><div class="stat-unit">%</div><div class="stat-label">Umidade</div></div>
          <div class="stat-box"><div class="stat-value">${currentWindMax.toFixed(1)}</div><div class="stat-unit">km/h</div><div class="stat-label">Vento Máx</div></div>
          <div class="stat-box"><div class="stat-value">${currentUvMax.toFixed(1)}</div><div class="stat-unit">índice</div><div class="stat-label">UV Máximo</div></div>
        </div>
        
        <h3>4.2 Previsão de Risco - Próximos 7 Dias</h3>
        <div class="chart-container">
          <div class="chart-title">Índice de Risco de Fogo (%)</div>
          <div class="bar-chart">
            ${dailyRisks.slice(0, 7).map(d => `
              <div class="bar-item">
                <div class="bar-value">${Math.round((d.risk || 0) * 100)}%</div>
                <div class="bar" style="height: ${Math.max(8, Math.round((d.risk || 0) * 100))}%; background: ${getRiskColor((d.risk || 0) * 100)}"></div>
                <div class="bar-label">${formatDayShort(d.day)}</div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <table>
          <tr><th>Data</th><th>Risco (%)</th><th>Classificação</th><th>Observação</th></tr>
          ${dailyRisks.slice(0, 7).map(d => {
            const risk = (d.risk || 0) * 100
            return `<tr>
              <td>${formatDayShort(d.day)}</td>
              <td>${risk.toFixed(1)}%</td>
              <td><span class="risk-indicator" style="background: ${getRiskColor(risk)}20; color: ${getRiskColor(risk)}">${getRiskLabel(risk)}</span></td>
              <td>${risk > 80 ? 'Atenção máxima' : risk > 60 ? 'Monitorar' : risk > 40 ? 'Condição moderada' : 'Condição favorável'}</td>
            </tr>`
          }).join('')}
        </table>
      `),
      
      // PÁGINA 4: GRÁFICOS CLIMÁTICOS
      createPage(4, `
        <h2>5. Visualizações Climáticas</h2>
        <p>Os gráficos abaixo apresentam a evolução das principais variáveis meteorológicas que influenciam o risco de incêndio na região analisada.</p>
        
        <div class="two-col">
          <div class="chart-container">
            <div class="chart-title">Temperatura Máxima (°C)</div>
            <div class="bar-chart" style="height: 100px;">
              ${tempMaxData.slice(0, 7).map((v, i) => `
                <div class="bar-item">
                  <div class="bar-value">${(v || 0).toFixed(0)}</div>
                  <div class="bar" style="height: ${Math.max(10, ((v || 0) / 45) * 100)}%; background: #f97316"></div>
                  <div class="bar-label">${timeData[i] ? formatDayShort(timeData[i]) : `D${i+1}`}</div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="chart-container">
            <div class="chart-title">Umidade Relativa (%)</div>
            <div class="bar-chart" style="height: 100px;">
              ${humidityData.slice(0, 7).map((v, i) => `
                <div class="bar-item">
                  <div class="bar-value">${(v || 0).toFixed(0)}</div>
                  <div class="bar" style="height: ${Math.max(10, (v || 0))}%; background: #3b82f6"></div>
                  <div class="bar-label">${timeData[i] ? formatDayShort(timeData[i]) : `D${i+1}`}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <div class="two-col">
          <div class="chart-container">
            <div class="chart-title">Precipitação (mm)</div>
            <div class="bar-chart" style="height: 100px;">
              ${precipData.slice(0, 7).map((v, i) => `
                <div class="bar-item">
                  <div class="bar-value">${(v || 0).toFixed(1)}</div>
                  <div class="bar" style="height: ${Math.max(8, Math.min(100, (v || 0) * 3))}%; background: #06b6d4"></div>
                  <div class="bar-label">${timeData[i] ? formatDayShort(timeData[i]) : `D${i+1}`}</div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="chart-container">
            <div class="chart-title">Velocidade do Vento (km/h)</div>
            <div class="bar-chart" style="height: 100px;">
              ${windData.slice(0, 7).map((v, i) => `
                <div class="bar-item">
                  <div class="bar-value">${(v || 0).toFixed(0)}</div>
                  <div class="bar" style="height: ${Math.max(10, ((v || 0) / 50) * 100)}%; background: #64748b"></div>
                  <div class="bar-label">${timeData[i] ? formatDayShort(timeData[i]) : `D${i+1}`}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <h3>5.1 Interpretação dos Dados Climáticos</h3>
        <p>A análise das variáveis climáticas revela ${currentTempMax > 30 ? 'temperaturas elevadas que contribuem para o aumento do risco de fogo' : 'temperaturas dentro de parâmetros normais'}. ${currentHumidity < 40 ? 'A baixa umidade relativa é um fator crítico que potencializa o ressecamento da vegetação.' : currentHumidity < 60 ? 'A umidade relativa moderada indica condições que merecem monitoramento.' : 'A umidade relativa está em níveis que contribuem para a mitigação do risco.'}</p>
        <p>${precipData.slice(0, 7).reduce((a, b) => a + (b || 0), 0) < 5 ? 'A ausência significativa de precipitação no período analisado é um indicador importante de condições propícias para incêndios.' : 'A ocorrência de precipitação no período contribui para a redução do risco de fogo.'}</p>
      `),
      
      // PÁGINA 5: DISCUSSÃO E CONCLUSÃO
      createPage(5, `
        <h2>6. Discussão</h2>
        <h3>6.1 Pontos Críticos Identificados</h3>
        <ul>
          ${todayRiskPercent > 60 ? '<li><strong>Risco atual elevado:</strong> O índice de ' + todayRiskPercent.toFixed(0) + '% demanda atenção imediata e possível adoção de medidas preventivas.</li>' : ''}
          ${dailyRisks.filter(d => (d.risk || 0) > 0.7).length > 0 ? '<li><strong>Dias críticos na previsão:</strong> Foram identificados ' + dailyRisks.filter(d => (d.risk || 0) > 0.7).length + ' dia(s) com risco superior a 70% no período analisado.</li>' : ''}
          ${currentHumidity < 40 ? '<li><strong>Umidade baixa:</strong> A umidade relativa de ' + currentHumidity.toFixed(0) + '% favorece a propagação de incêndios.</li>' : ''}
          ${currentTempMax > 32 ? '<li><strong>Temperatura elevada:</strong> Máxima de ' + currentTempMax.toFixed(1) + '°C contribui para o ressecamento da vegetação.</li>' : ''}
          <li>A combinação de fatores meteorológicos sugere ${weeklyRiskPercent > 50 ? 'condições desfavoráveis para os próximos dias' : 'condições relativamente estáveis, mas que requerem monitoramento'}.</li>
        </ul>
        
        <h3>6.2 Limitações do Modelo</h3>
        <ul>
          <li>O modelo não considera variáveis locais como tipo de vegetação, uso do solo e histórico de queimadas na área específica.</li>
          <li>Fatores humanos (origem antrópica de incêndios) não são contemplados na análise preditiva.</li>
          <li>A resolução espacial dos dados meteorológicos pode não capturar microclimas locais.</li>
          <li>Eventos extremos de curta duração podem não ser adequadamente previstos.</li>
        </ul>
        
        <h2>7. Conclusão</h2>
        <p>A análise realizada pelo sistema FlamaAI para a região de <strong>${geo.cidade || 'N/A'}, ${geo.state || geo.estado || 'N/A'}</strong> indica um cenário de risco ${getRiskLabel(weeklyRiskPercent).toLowerCase()} para os próximos 7 dias, com índice médio de ${weeklyRiskPercent.toFixed(1)}%.</p>
        <p>${weeklyRiskPercent > 60 ? 'Recomenda-se a intensificação do monitoramento e a preparação de equipes de combate a incêndios na região.' : weeklyRiskPercent > 40 ? 'Recomenda-se manter o monitoramento contínuo das condições meteorológicas.' : 'As condições atuais são relativamente favoráveis, porém o monitoramento deve ser mantido.'}</p>
        
        <h2>8. Melhorias Futuras</h2>
        <ol>
          <li><strong>Integração de dados de sensoriamento remoto:</strong> Utilização de imagens de satélite para detecção de focos de calor.</li>
          <li><strong>Incorporação de dados históricos:</strong> Análise de séries temporais para refinamento do modelo.</li>
          <li><strong>Dados de uso do solo:</strong> Inclusão de informações sobre tipo de cobertura vegetal.</li>
          <li><strong>Validação contínua:</strong> Comparação das previsões com ocorrências reais.</li>
          <li><strong>Alertas automáticos:</strong> Sistema de notificação para órgãos competentes.</li>
        </ol>
        
        <div class="highlight-box" style="margin-top: 24px;">
          <p style="margin: 0; text-align: center;"><strong>Este relatório foi gerado automaticamente pelo sistema FlamaAI.</strong></p>
          <p style="margin: 8px 0 0 0; text-align: center; font-size: 11px; color: #666;">Para mais informações, consulte a documentação do sistema.</p>
        </div>
      `)
    ]
    
    // Renderizar cada página
    for (let i = 0; i < pages.length; i++) {
      // Criar container isolado
      const container = document.createElement('div')
      container.id = 'pdf-isolated-container'
      container.style.cssText = 'position: fixed; left: -9999px; top: 0; z-index: -9999;'
      container.innerHTML = `<style>${getBaseStyles()}</style>${pages[i]}`
      
      document.body.appendChild(container)
      await nextTick()
      await new Promise(r => setTimeout(r, 150))
      
      const pageElement = container.querySelector('.pdf-page')
      const canvas = await html2canvas(pageElement || container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123
      })
      
      if (i > 0) pdf.addPage()
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pageWidth, pageHeight)
      document.body.removeChild(container)
    }
    
    const fileName = `FlamaAI_Relatorio_Tecnico_${(geo.cidade || 'Analise').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
  } finally {
    isGenerating.value = false
  }
}
</script>

