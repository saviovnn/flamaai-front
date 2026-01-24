<template>
  <div v-if="error" class="error-container">
    <div class="error-content">
      <p class="error-title">Erro ao carregar visualização da Terra</p>
      <p class="error-message">{{ error }}</p>
    </div>
  </div>
  <div v-else class="globe-wrapper" :class="className">
    <div class="globe-container">
      <canvas
        ref="canvasRef"
        class="globe-canvas"
      />
      <svg 
        class="satellite-icon" 
        viewBox="0 0 152 152" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        :style="{
          width: `${props.satelliteSize}rem`,
          height: `${props.satelliteSize}rem`,
          top: `${computedSatelliteDistance}rem`,
          right: `${computedSatelliteDistance}rem`
        }"
      >
        <path d="M85.2634 101.955L83.0496 100.156C79.208 103.601 75.4249 107.033 71.5951 110.412C69.7141 112.071 67.8074 113.713 65.8017 115.215C63.1986 117.165 61.5591 116.959 59.2507 114.585C58.4297 113.741 57.6847 112.822 56.6641 111.663C56.3176 114.759 56.139 117.521 55.6796 120.234C54.783 125.656 52.3996 130.723 48.7946 134.871C45.0535 139.214 42.2431 139.489 38.0018 135.793C35.2833 133.425 32.6494 130.96 29.9669 128.549C29.7058 128.403 29.4267 128.293 29.1366 128.221C27.0554 129.936 24.222 130.887 23.9647 134.563C23.8092 136.787 21.7581 137.963 19.497 138.23C18.2936 138.377 17.0747 138.137 16.0166 137.546C14.9584 136.954 14.116 136.041 13.611 134.939C12.6061 132.788 12.637 130.683 14.2253 128.805C14.627 128.332 15.345 127.722 15.834 127.788C19.8751 128.338 21.3965 125.004 23.8288 122.872C22.3337 121.339 20.8432 119.935 19.497 118.404C17.0613 115.631 14.646 112.836 12.3521 109.947C10.9896 108.23 11.6689 106.377 12.6488 104.731C16.5868 98.1197 22.4827 93.9598 29.7136 91.7532C32.4754 90.9105 35.469 90.8264 38.5085 90.3749C38.2979 89.867 38.0518 89.3747 37.7721 88.9014C34.8074 84.4278 34.9918 83.1526 39.0191 79.4502C43.7566 75.0954 48.4553 70.6979 53.196 66.2978C52.3717 64.3826 51.4042 64.5775 50.1342 65.604C48.6342 66.8746 47.0458 68.0371 45.381 69.0827C42.4334 70.8357 40.6016 70.6231 38.0176 68.3371C34.6702 65.3776 31.3275 62.4097 28.1023 59.3203C19.6574 51.2316 11.2506 43.1039 2.88182 34.9373C-0.451717 31.6924 -0.486506 30.8937 2.3049 27.2201C3.13561 26.2079 4.01895 25.2399 4.95126 24.3204C11.6879 17.1663 18.4718 10.0588 25.1507 2.85816C28.2204 -0.452408 29.7398 -1.02605 33.1954 1.87037C40.0529 7.61792 46.6084 13.7271 53.2538 19.7227C58.9298 24.8454 64.5198 30.0634 70.2181 35.1612C73.8175 38.3818 74.0663 39.7798 71.391 43.7303C70.7202 44.72 70.2483 45.8548 69.5152 46.7895C68.6783 47.7362 67.7847 48.6314 66.8393 49.4699L68.8123 52.3578C70.4137 51.0629 71.9259 49.8821 73.3929 48.6476C78.4847 44.361 83.5825 40.0804 88.6343 35.7472C91.3575 33.4107 92.808 33.3673 96.79 35.9533C97.6629 35.4007 98.6402 34.7549 99.6431 34.151C109.016 28.5157 121.122 33.2171 123.454 43.4933C124.694 48.9619 122.651 53.6068 119.062 57.6046C117.735 59.0814 117.017 60.3271 117.452 62.4838C118.062 65.5029 115.892 67.4917 113.938 69.4732C109.491 73.9829 105.115 78.5635 100.472 83.3619L102.473 85.8416C103.705 84.3576 105.016 82.9416 106.401 81.5996C109.686 78.7432 112.587 78.8338 115.625 81.8622C126.073 92.2809 136.643 102.583 146.852 113.235C153.659 120.336 153.11 121.913 146.614 128.922C138.8 137.212 129.686 144.172 119.631 149.526C113.889 152.641 111.367 152.069 107.072 147.254C98.0521 137.147 88.952 127.105 79.8906 117.035C79.2953 116.392 78.7416 115.713 78.2327 115C76.1849 112.042 76.2597 111.138 78.8142 108.49C80.8548 106.376 82.9413 104.305 85.2634 101.955ZM64.1989 108.997C80.7438 94.5308 94.9582 78.4262 110.113 63.209L91.6771 42.199C74.7003 55.7458 58.4323 69.993 42.9847 85.9112L64.1989 108.997ZM43.5426 131.492C47.7195 125.895 51.3563 116.462 49.9209 110.342C48.3719 103.741 43.9719 99.9718 38.6083 99.8163C32.4472 99.6384 24.3992 102.174 20.2308 106.367C27.507 114.546 36.2934 123.341 43.5426 131.492ZM96.3778 99.9876C92.0657 103.713 87.8907 107.318 83.4808 111.128L93.8168 120.316L105.417 110.415L96.3778 99.9876ZM120.737 96.8845L111.745 86.3247L100.644 96.112L110.756 105.923L120.737 96.8845ZM16.6905 20.3942L5.85372 30.1355L16.5842 39.3787L26.0105 29.2626L16.6905 20.3942ZM30.5596 7.58576L20.2315 17.2602L29.9026 25.3252L38.6083 16.3413L30.5596 7.58576ZM143.816 121.506L136.465 114.602L124.254 123.508L131.843 132.606L143.816 121.506ZM124.54 101.225L113.813 110.237L121.37 119.455C125.177 116.252 128.805 113.198 132.659 109.954L124.54 101.225ZM41.779 45.1453L33.3221 54.1103L43.1015 63.1415L50.3088 54.8027L41.779 45.1453ZM115.848 123.914L108.67 114.446C104.704 117.728 101.114 120.694 97.4995 123.685L105.742 131.795L115.848 123.914ZM116.287 144.611L126.281 137.33L118.501 127.98C114.903 130.503 111.584 132.829 108.262 135.158L116.287 144.611ZM54.8887 33.2164L46.5624 41.2821L56.0058 49.8848L63.4467 41.2211L54.8887 33.2164ZM21.2396 43.3897L27.7432 49.1785L37.1499 41.0446C34.8173 38.5918 32.5903 36.2487 30.3384 33.88L21.2396 43.3897ZM43.8373 21.4063L34.6525 29.9537L41.8296 36.6267L50.4742 28.5407L43.8373 21.4063ZM111.938 52.965C116.007 47.6939 116.256 43.7539 112.972 40.7302C109.688 37.7064 104.4 37.8134 100.737 41.2283L111.938 52.965ZM96.3351 88.0186L88.3232 95.2863L90.1826 97.8256L98.2996 89.286L96.3351 88.0186ZM62.0041 54.5014C56.3819 59.5618 56.3819 59.5618 58.257 61.6168L64.4142 56.1291L62.0041 54.5014Z" fill="currentColor"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as d3 from 'd3'

// Função para obter a cor de fundo do oceano - sempre cinza, independente do tema
const getOceanFillColor = () => {
  // Sempre usa a cor cinza fixa, não muda com o tema
  return 'hsl(220, 13%, 10%)'
}

const props = defineProps({
  width: {
    type: Number,
    default: 800
  },
  height: {
    type: Number,
    default: 600
  },
  className: {
    type: String,
    default: ''
  },
  satelliteSize: {
    type: Number,
    default: 2.5 // Tamanho padrão em rem
  },
  satelliteDistance: {
    type: Number,
    default: null // Se null, calcula automaticamente baseado no tamanho
  },
  rotation: {
    type: Array,
    default: null // Se null, usa rotação automática
  },
  autoRotate: {
    type: Boolean,
    default: true
  }
})

// Calcula a distância do satélite
// Se satelliteDistance for fornecido, usa esse valor
// Caso contrário, calcula baseado no tamanho (quanto menor, mais longe)
const computedSatelliteDistance = computed(() => {
  // Se a distância foi fornecida explicitamente, usa ela
  if (props.satelliteDistance !== null) {
    return props.satelliteDistance
  }
  
  // Caso contrário, calcula baseado no tamanho
  // Fórmula: distância base (1.5rem) + (tamanho padrão - tamanho atual) * fator
  // Isso faz com que satélites menores fiquem mais longe
  const baseDistance = 1.5 // Distância base em rem
  const sizeDifference = 2.5 - props.satelliteSize // Diferença do tamanho padrão
  const distanceFactor = 0.8 // Fator de multiplicação para ajustar a sensibilidade
  return baseDistance + (sizeDifference * distanceFactor)
})

const canvasRef = ref(null)
const isLoading = ref(true)
const error = ref(null)

let rotationTimer = null
let fireAnimationTimer = null
let landFeatures = null
let allDots = []
let renderFunction = null
let currentRotation = null // Armazena a rotação atual
let currentProjection = null // Armazena a projeção atual

// Função para verificar se um ponto está no Brasil (coordenadas mais precisas)
const isInBrazil = (lng, lat) => {
  // Brasil: aproximadamente -73° a -34° longitude, -33° a 5° latitude
  // Exclui Chile que está em -70° a -66° longitude, -56° a -17° latitude
  // Exclui Argentina que está em -73° a -53° longitude, -55° a -21° latitude (parte sul)
  const isInChile = lng >= -70 && lng <= -66 && lat >= -56 && lat <= -17
  const isInArgentinaSouth = lng >= -73 && lng <= -53 && lat >= -55 && lat <= -40

  // Brasil: -73° a -34° longitude, -33° a 5° latitude
  // Mas excluindo áreas que se sobrepõem com Chile e Argentina
  if (isInChile || isInArgentinaSouth) {
    return false
  }

  // Verifica se está na área geral do Brasil
  if (lng >= -73 && lng <= -34 && lat >= -33 && lat <= 5) {
    // Exclui área do Chile mais precisamente
    if (lng >= -70 && lng <= -66 && lat <= -17) {
      return false
    }
    return true
  }

  return false
}

// Função para interpolar cor entre cinza e laranja fluorescente baseado na intensidade
const getFireColor = (intensity) => {
  // intensity: 0 = cinza (#999999), 1 = laranja fluorescente (#ff4500)
  if (intensity <= 0) return '#999999'
  if (intensity >= 1) return '#ff4500' // Laranja fluorescente mais brilhante

  // Interpolação linear entre as cores
  const gray = { r: 153, g: 153, b: 153 }
  // Laranja fluorescente: #ff4500 (rgb(255, 69, 0)) - mais brilhante e vibrante
  const orange = { r: 255, g: 69, b: 0 }

  const r = Math.round(gray.r + (orange.r - gray.r) * intensity)
  const g = Math.round(gray.g + (orange.g - gray.g) * intensity)
  const b = Math.round(gray.b + (orange.b - gray.b) * intensity)

  // Adiciona um brilho extra quando a intensidade é alta
  if (intensity > 0.7) {
    const glow = (intensity - 0.7) * 0.3 // Brilho adicional de 0-9%
    return `rgb(${Math.min(255, r + glow * 50)}, ${Math.min(255, g + glow * 30)}, ${b})`
  }

  return `rgb(${r}, ${g}, ${b})`
}

const pointInPolygon = (point, polygon) => {
  const [x, y] = point
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }

  return inside
}

const pointInFeature = (point, feature) => {
  const geometry = feature.geometry

  if (geometry.type === 'Polygon') {
    const coordinates = geometry.coordinates
    // Check if point is in outer ring
    if (!pointInPolygon(point, coordinates[0])) {
      return false
    }
    // Check if point is in any hole (inner rings)
    for (let i = 1; i < coordinates.length; i++) {
      if (pointInPolygon(point, coordinates[i])) {
        return false // Point is in a hole
      }
    }
    return true
  } else if (geometry.type === 'MultiPolygon') {
    // Check each polygon in the MultiPolygon
    for (const polygon of geometry.coordinates) {
      // Check if point is in outer ring
      if (pointInPolygon(point, polygon[0])) {
        // Check if point is in any hole
        let inHole = false
        for (let i = 1; i < polygon.length; i++) {
          if (pointInPolygon(point, polygon[i])) {
            inHole = true
            break
          }
        }
        if (!inHole) {
          return true
        }
      }
    }
    return false
  }

  return false
}

const generateDotsInPolygon = (feature, dotSpacing = 16) => {
  const dots = []
  const bounds = d3.geoBounds(feature)
  const [[minLng, minLat], [maxLng, maxLat]] = bounds

  const stepSize = dotSpacing * 0.08
  let pointsGenerated = 0

  for (let lng = minLng; lng <= maxLng; lng += stepSize) {
    for (let lat = minLat; lat <= maxLat; lat += stepSize) {
      const point = [lng, lat]
      if (pointInFeature(point, feature)) {
        dots.push(point)
        pointsGenerated++
      }
    }
  }

  return dots
}

const initializeGlobe = () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const context = canvas.getContext('2d')
  if (!context) return

  // Set up responsive dimensions - calcula o tamanho baseado no container disponível
  const containerWidth = Math.min(props.width, window.innerWidth - 40)
  const containerHeight = Math.min(props.height, window.innerHeight - 100)
  
  // Calcula o raio do globo baseado no menor lado disponível
  const availableSize = Math.min(containerWidth, containerHeight)
  const radius = availableSize / 2.2 // Ajusta para o globo usar mais espaço
  
  // Canvas deve ter o tamanho exato do globo (diâmetro + pequeno padding)
  const canvasSize = radius * 2 + 20 // 20px de padding
  const canvasWidth = canvasSize
  const canvasHeight = canvasSize

  const dpr = window.devicePixelRatio || 1
  canvas.width = canvasWidth * dpr
  canvas.height = canvasHeight * dpr
  canvas.style.width = `${canvasWidth}px`
  canvas.style.height = `${canvasHeight}px`
  context.scale(dpr, dpr)

  // Create projection and path generator for Canvas
  const projection = d3
    .geoOrthographic()
    .scale(radius)
    .translate([canvasWidth / 2, canvasHeight / 2])
    .clipAngle(90)

  // Armazena referências globais
  currentProjection = projection
  
  // Posição inicial: começa na África (longitude ~15°)
  // Para mostrar a África centralizada, usamos rotação [-15, 0, 0]
  // Se rotation prop for fornecida, usa ela; caso contrário, usa rotação inicial da África
  let rotation = props.rotation ? [...props.rotation] : [-15, 0, 0] // África centralizada
  currentRotation = rotation
  projection.rotate(rotation)

  const path = d3.geoPath().projection(projection).context(context)

  const render = () => {
    // Aplica a rotação atual (usa currentRotation se disponível, senão usa rotation local)
    const rot = currentRotation || rotation
    projection.rotate(rot)

    // Clear canvas
    context.clearRect(0, 0, canvasWidth, canvasHeight)

    const currentScale = projection.scale()
    const scaleFactor = currentScale / radius

    // Draw ocean (globe background)
    context.beginPath()
    context.arc(canvasWidth / 2, canvasHeight / 2, currentScale, 0, 2 * Math.PI)
    context.fillStyle = getOceanFillColor()
    context.fill()
    context.strokeStyle = '#ffffff'
    context.lineWidth = 2 * scaleFactor
    context.stroke()

    if (landFeatures) {
      // Draw graticule
      const graticule = d3.geoGraticule()
      context.beginPath()
      path(graticule())
      context.strokeStyle = '#ffffff'
      context.lineWidth = 1 * scaleFactor
      context.globalAlpha = 0.25
      context.stroke()
      context.globalAlpha = 1

      // Draw land outlines
      context.beginPath()
      landFeatures.features.forEach((feature) => {
        path(feature)
      })
      context.strokeStyle = '#ffffff'
      context.lineWidth = 1 * scaleFactor
      context.stroke()

      // Draw halftone dots
      allDots.forEach((dot) => {
        const projected = projection([dot.lng, dot.lat])
        if (
          projected &&
          projected[0] >= 0 &&
          projected[0] <= canvasWidth &&
          projected[1] >= 0 &&
          projected[1] <= canvasHeight
        ) {
          context.beginPath()

          // Pontos em chamas são ligeiramente maiores para destaque
          const dotSize = isInBrazil(dot.lng, dot.lat) && dot.fireIntensity > 0
            ? 1.5 * scaleFactor
            : 1.2 * scaleFactor

          context.arc(projected[0], projected[1], dotSize, 0, 2 * Math.PI)

          // Usa cor baseada na intensidade de fogo (apenas para pontos do Brasil)
          if (isInBrazil(dot.lng, dot.lat) && dot.fireIntensity > 0) {
            context.fillStyle = getFireColor(dot.fireIntensity)
            // Adiciona um leve brilho para pontos em chamas
            if (dot.fireIntensity > 0.5) {
              context.shadowBlur = 3 * scaleFactor
              context.shadowColor = getFireColor(dot.fireIntensity)
            }
          } else {
            context.fillStyle = '#999999'
            context.shadowBlur = 0
          }

          context.fill()
          context.shadowBlur = 0 // Reseta o shadow
        }
      })
    }
  }

  // Função para animar queimadas no Brasil
  const startFireAnimation = (brazilDots) => {
    if (!brazilDots || brazilDots.length === 0) return

    // Para a animação anterior se existir
    if (fireAnimationTimer) {
      fireAnimationTimer.stop()
    }

    // Configurações da animação - aumentadas para mais visibilidade
    const IGNITE_SPEED = 0.05 // Velocidade de acender (por frame)
    const COOL_SPEED = 0.03 // Velocidade de esfriar (por frame)
    const MAX_ACTIVE_FIRES = 200 // Número máximo de pontos queimando simultaneamente (aumentado)
    const NEW_FIRE_CHANCE = 0.08 // Chance de iniciar novo fogo a cada frame (8% - aumentado)

    const animateFires = () => {
      let needsRender = false

      // Processa cada ponto do Brasil
      brazilDots.forEach((dot) => {
        if (dot.firePhase === 'igniting') {
          // Aumenta intensidade gradualmente
          dot.fireIntensity = Math.min(1, dot.fireIntensity + IGNITE_SPEED)
          if (dot.fireIntensity >= 1) {
            dot.firePhase = 'burning'
            // Mantém queimando por um tempo aleatório
            dot.burnDuration = Math.random() * 30 + 20 // 20-50 frames
          }
          needsRender = true
        } else if (dot.firePhase === 'burning') {
          // Mantém queimando
          if (dot.burnDuration > 0) {
            dot.burnDuration--
          } else {
            dot.firePhase = 'cooling'
          }
        } else if (dot.firePhase === 'cooling') {
          // Diminui intensidade gradualmente
          dot.fireIntensity = Math.max(0, dot.fireIntensity - COOL_SPEED)
          if (dot.fireIntensity <= 0) {
            dot.firePhase = 'none'
            dot.fireIntensity = 0
          }
          needsRender = true
        }
      })

      // Conta quantos pontos estão queimando ou acendendo
      const activeFires = brazilDots.filter(d =>
        d.firePhase === 'igniting' || d.firePhase === 'burning'
      ).length

      // Inicia novos fogos aleatoriamente
      if (activeFires < MAX_ACTIVE_FIRES && Math.random() < NEW_FIRE_CHANCE) {
        // Seleciona um ponto aleatório que não está queimando
        const availableDots = brazilDots.filter(d => d.firePhase === 'none')
        if (availableDots.length > 0) {
          const randomDot = availableDots[Math.floor(Math.random() * availableDots.length)]
          randomDot.firePhase = 'igniting'
          randomDot.fireIntensity = 0
          needsRender = true
        }
      }

      // Re-renderiza se houver mudanças
      if (needsRender) {
        render()
      }
    }

    // Inicia a animação usando d3.timer (60fps)
    fireAnimationTimer = d3.timer(animateFires)
  }

  // Expõe a função render para uso externo
  renderFunction = render

  const loadWorldDataWithXHR = (url) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.setRequestHeader('Accept', 'application/json')
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText)
            resolve(data)
          } catch (err) {
            reject(new Error('Failed to parse JSON response'))
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`))
        }
      }
      xhr.onerror = () => reject(new Error('Network error'))
      xhr.ontimeout = () => reject(new Error('Request timeout'))
      xhr.timeout = 30000 // 30 segundos
      xhr.send()
    })
  }

  const loadWorldData = async () => {
    try {
      isLoading.value = true
      error.value = null

      // URLs alternativas para o GeoJSON
      const urls = [
        'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json',
        'https://cdn.jsdelivr.net/npm/world-atlas@3/land-110m.json',
        'https://unpkg.com/world-atlas@3/land-110m.json'
      ]

      let landData = null
      let lastError = null

      // Primeiro tenta com fetch
      for (const url of urls) {
        try {
          // Usa fetch com cache: 'no-cache' para evitar problemas com ServiceWorker
          // e mode: 'cors' para garantir que CORS funcione
          const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'omit',
            headers: {
              'Accept': 'application/json',
            }
          })

          if (response.ok) {
            landData = await response.json()
            break
          }
        } catch (err) {
          lastError = err
          console.warn(`Fetch failed for ${url}:`, err)
          // Se fetch falhar, tenta com XHR (não é interceptado por ServiceWorker)
          try {
            landData = await loadWorldDataWithXHR(url)
            break
          } catch (xhrErr) {
            console.warn(`XHR also failed for ${url}:`, xhrErr)
            lastError = xhrErr
            continue
          }
        }
      }

      if (!landData) {
        throw lastError || new Error('Failed to load land data from all sources')
      }

      landFeatures = landData

      if (!landFeatures || !landFeatures.features) {
        throw new Error('Invalid GeoJSON data format')
      }

      // Generate dots for all land features
      let totalDots = 0
      let brazilDots = []
      landFeatures.features.forEach((feature) => {
        const dots = generateDotsInPolygon(feature, 16)
        dots.forEach(([lng, lat]) => {
          const dot = {
            lng,
            lat,
            visible: true,
            fireIntensity: 0, // 0 = normal, 1 = laranja máximo
            firePhase: 'none' // 'none', 'igniting', 'burning', 'cooling'
          }
          allDots.push(dot)

          // Identifica pontos do Brasil
          if (isInBrazil(lng, lat)) {
            brazilDots.push(dot)
          }

          totalDots++
        })
      })

      // Aplica a rotação inicial (África se não fornecida via prop)
      if (!props.rotation) {
        rotation = [-15, 0, 0] // África centralizada
      }
      currentRotation = rotation
      projection.rotate(rotation)

      // Renderiza imediatamente com a rotação correta
      render()

      // Inicia animação de queimadas no Brasil
      startFireAnimation(brazilDots)

      render()
      isLoading.value = false
    } catch (err) {
      console.error('Error loading world data:', err)
      error.value = `Erro ao carregar dados do mapa: ${err.message || 'Erro desconhecido'}`
      isLoading.value = false
    }
  }

  // Set up rotation and interaction
  // Usa a prop autoRotate para controlar rotação automática
  const baseRotationSpeed = 0.4 // Velocidade base (rápida)
  const slowRotationSpeed = 0.1 // Velocidade lenta (quando Brasil está visível)

  // Função para verificar se o Brasil está visível no globo atual
  const isBrazilVisible = () => {
    // Brasil está visível quando a longitude de rotação está entre aproximadamente -80° e 30°
    // Normalizamos a rotação para estar entre -180 e 180
    let normalizedLng = rotation[0] % 360
    if (normalizedLng > 180) normalizedLng -= 360
    if (normalizedLng < -180) normalizedLng += 360

    // Brasil visível: aproximadamente entre -30° e 80° (considerando rotação invertida)
    return normalizedLng >= -30 && normalizedLng <= 80
  }

  const rotate = () => {
    // Só rotaciona automaticamente se autoRotate for true E não houver rotação controlada
    if (props.autoRotate && !props.rotation) {
      // Usa velocidade lenta quando Brasil está visível, rápida caso contrário
      const currentSpeed = isBrazilVisible() ? slowRotationSpeed : baseRotationSpeed
      rotation[0] += currentSpeed
      currentRotation = rotation
      projection.rotate(rotation)
      render()
    } else if (props.rotation) {
      // Se rotação controlada, atualiza da prop continuamente
      rotation[0] = props.rotation[0]
      rotation[1] = props.rotation[1]
      rotation[2] = props.rotation[2] || 0
      currentRotation = [...rotation]
      projection.rotate(rotation)
      render()
    }
  }

  // Timer sempre roda para atualizar rotação (automática ou controlada)
  if (props.autoRotate || props.rotation) {
    rotationTimer = d3.timer(rotate)
  }
  
  // Se rotação controlada sem autoRotate, atualiza imediatamente também
  if (!props.autoRotate && props.rotation) {
    rotation[0] = props.rotation[0]
    rotation[1] = props.rotation[1]
    rotation[2] = props.rotation[2] || 0
    currentRotation = [...rotation]
    projection.rotate(rotation)
    render()
  }

  const handleMouseDown = (event) => {
    autoRotate = false
    const startX = event.clientX
    const startY = event.clientY
    const startRotation = [...rotation]

    const handleMouseMove = (moveEvent) => {
      const sensitivity = 0.5
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY

      rotation[0] = startRotation[0] + dx * sensitivity
      rotation[1] = startRotation[1] - dy * sensitivity
      rotation[1] = Math.max(-90, Math.min(90, rotation[1]))

      projection.rotate(rotation)
      render()
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)

      setTimeout(() => {
        autoRotate = true
      }, 1000)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Zoom desativado - apenas rotação permitida
  // const handleWheel = (event) => {
  //   event.preventDefault()
  //   const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1
  //   const newRadius = Math.max(radius * 0.5, Math.min(radius * 3, projection.scale() * scaleFactor))
  //   projection.scale(newRadius)
  //   render()
  // }

  canvas.addEventListener('mousedown', handleMouseDown)
  // canvas.addEventListener('wheel', handleWheel) // Zoom desativado

  // Load the world data
  loadWorldData()

  // Return cleanup function
  return () => {
    if (rotationTimer) {
      rotationTimer.stop()
    }
    if (fireAnimationTimer) {
      fireAnimationTimer.stop()
      fireAnimationTimer = null
    }
    canvas.removeEventListener('mousedown', handleMouseDown)
    // canvas.removeEventListener('wheel', handleWheel) // Zoom desativado
  }
}

let cleanup = null

onMounted(() => {
  cleanup = initializeGlobe()
})

onUnmounted(() => {
  if (cleanup) {
    cleanup()
  }
})

watch(() => [props.width, props.height], () => {
  if (cleanup) {
    cleanup()
  }
  // Reset data when dimensions change
  allDots = []
  landFeatures = null
  cleanup = initializeGlobe()
})

// Watch para atualizar rotação quando a prop mudar
watch(() => props.rotation, (newRotation) => {
  if (newRotation && currentProjection) {
    // Atualiza a rotação atual e re-renderiza
    currentRotation = [...newRotation]
    currentProjection.rotate(newRotation)
    if (renderFunction) {
      renderFunction()
    }
  }
}, { deep: true, immediate: false })

// Watch removido - o globo agora sempre usa a mesma cor cinza, independente do tema
</script>

<style scoped>
.globe-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.globe-container {
  position: relative;
  background: hsl(var(--background));
  display: inline-block;
}

.globe-canvas {
  display: block;
  border-radius: 1rem;
  background: hsl(var(--background));
}

.satellite-icon {
  position: absolute;
  color: hsl(var(--foreground));
  opacity: 0.8;
  z-index: 10;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.globe-instructions {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  background: rgba(0, 0, 0, 0.7);
}

.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--v-card-base, #1e1e1e);
  border-radius: 1rem;
  padding: 2rem;
}

.error-content {
  text-align: center;
}

.error-title {
  color: var(--v-error-base, #ef4444);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.error-message {
  color: var(--v-text-secondary, #9ca3af);
  font-size: 0.875rem;
}
</style>