# FlamaAI Frontend

Aplicação Vue 3 com Vite, Pinia, Vue Router, Axios e Shadcn-Vue.

## 🚀 Tecnologias

- **Vue 3** - Framework JavaScript progressivo
- **Vite** - Build tool moderna e rápida
- **Pinia** - Gerenciamento de estado oficial do Vue
- **Vue Router** - Roteamento oficial do Vue
- **Axios** - Cliente HTTP para requisições API
- **Shadcn-Vue** - Componentes UI modernos e acessíveis
- **Tailwind CSS** - Framework CSS utility-first

## 📦 Instalação

```bash
# Instalar dependências
pnpm install

# Rodar em desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview da build de produção
pnpm preview
```

## 📁 Estrutura do Projeto

```
src/
├── api/
│   ├── axios.js       # Configuração do Axios com interceptors
│   └── services.js    # Serviços de API organizados
├── assets/            # Imagens, fontes, etc
├── components/
│   └── ui/           # Componentes do Shadcn-Vue
├── lib/
│   └── utils.js      # Utilitários e helpers
├── router/
│   └── index.js      # Configuração de rotas
├── stores/
│   └── index.js      # Stores do Pinia
├── views/            # Páginas da aplicação
│   └── Home.vue
├── App.vue           # Componente raiz
├── main.js          # Entry point
└── style.css        # Estilos globais
```

## 🎯 Como Usar

### Pinia (Gerenciamento de Estado)

```javascript
import { useCounterStore } from '@/stores'

const counterStore = useCounterStore()
counterStore.increment()
```

### Vue Router

```javascript
// Em um componente
import { useRouter } from 'vue-router'

const router = useRouter()
router.push('/rota')
```

### Axios (API)

```javascript
import { authService } from '@/api/services'

// Exemplo de uso
const login = async () => {
  try {
    const data = await authService.login({ email, password })
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}
```

### Shadcn-Vue Components

```bash
# Adicionar novos componentes
pnpm dlx shadcn-vue add [component-name]
```

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000/api
```

## 📝 Próximos Passos

1. Configurar autenticação
2. Criar páginas adicionais
3. Adicionar mais stores do Pinia
4. Implementar guards de rota
5. Adicionar testes

## 📖 Documentação

- [Vue 3](https://vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Axios](https://axios-http.com/)
- [Shadcn-Vue](https://www.shadcn-vue.com/)
- [Tailwind CSS](https://tailwindcss.com/)
