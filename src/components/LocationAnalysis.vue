<template>
  <div class="w-full max-w-[1400px] mx-auto flex flex-col gap-8 pb-12 animate-in fade-in duration-700" ref="reportContainer">
    <!-- Header: Informações da Localidade -->
    <AnalysisHeader :report-container-ref="reportContainer" />

    <!-- Hero: Risco (protagonista) + Mapa (suporte) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <FireRiskCard />
      <MapCard />
    </div>

    <!-- Seção: Fatores (depende de air/weather) -->
    <FactorStatsSection />

    <!-- Seção: Gráficos e IA -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <RiskEvolutionCard />
      <AIAnalysisCard />
    </div>

    <!-- Seção Secundária: air OU weather -->
    <WeatherChartsSection />
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Components
import {
  AnalysisHeader,
  FireRiskCard,
  MapCard,
  FactorStatsSection,
  RiskEvolutionCard,
  AIAnalysisCard,
  WeatherChartsSection
} from './analysis'

const reportContainer = ref(null)
</script>
