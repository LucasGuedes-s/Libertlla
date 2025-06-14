import axios from 'axios'

// Crie uma instância do Axios
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
})

// Interceptor de requisição (antes da requisição ser enviada)
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token') // ou use AsyncStorage no React Native

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de resposta (todas as respostas passam por aqui)
api.interceptors.response.use(
  (response) => {
    // Resposta bem-sucedida
    return response
  },
  (error) => {
    if (error.response) {
      const { status } = error.response

      if (status === 401) {
        // Token expirado ou não autorizado
        console.warn('Sessão expirada. Faça login novamente.')
        // Aqui você pode redirecionar para login, limpar token, etc.
        localStorage.removeItem('token')
        window.location.href = '/login' // ou use navegação do React Router
      }

      if (status === 500) {
        console.error('Erro interno no servidor.')
      }
    } else {
      console.error('Erro de conexão com o servidor.')
    }

    return Promise.reject(error)
  }
)

export default api
