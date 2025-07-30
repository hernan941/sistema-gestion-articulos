import { http, HttpResponse } from 'msw'
import type { BackendArticle } from '../../services/apiService'

const mockArticles: BackendArticle[] = [
  {
    id: '1',
    fecha: '2024-01-15T10:00:00.000Z',
    nombreDesencriptado: 'Test Article 1',
    montoOriginal: 100,
    pais: 'Spain',
    agente: 'Agent',
    montoUSD: 100,
    estadoCalculado: 'Válido'
  },
  {
    id: '2',
    fecha: '2024-02-10T10:00:00.000Z',
    nombreDesencriptado: 'Test Article 2',
    montoOriginal: 250,
    pais: 'France',
    agente: 'Agent',
    montoUSD: 250,
    estadoCalculado: 'Inválido'
  },
  {
    id: '3',
    fecha: '2024-03-05T10:00:00.000Z',
    nombreDesencriptado: 'Another Test Article',
    montoOriginal: 500,
    pais: 'Germany',
    agente: 'Agent',
    montoUSD: 500,
    estadoCalculado: 'Válido'
  }
] as const

export const handlers = [
  // Health check endpoint
  http.get('http://localhost:3001/api/health', () => {
    return HttpResponse.json({
      success: true,
      data: {
        status: 'OK',
        timestamp: new Date().toISOString()
      }
    })
  }),

  // Get articles endpoint
  http.get('http://localhost:3001/api/articles', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')
    const status = url.searchParams.get('status')
    const sortBy = url.searchParams.get('sortBy')
    const sortOrder = url.searchParams.get('sortOrder')

    let filteredArticles = [...mockArticles]

    // Apply search filter
    if (search) {
      filteredArticles = filteredArticles.filter(article =>
        article.nombreDesencriptado.toLowerCase().includes(search.toLowerCase()) ||
        article.pais.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Apply status filter
    if (status && status !== 'all') {
      filteredArticles = filteredArticles.filter(article => article.estadoCalculado === status)
    }

    // Apply sorting
    if (sortBy) {
      filteredArticles.sort((a, b) => {
        let aVal: any = a[sortBy as keyof BackendArticle]
        let bVal: any = b[sortBy as keyof BackendArticle]

        if (sortBy === 'fecha') {
          aVal = new Date(aVal).getTime()
          bVal = new Date(bVal).getTime()
        }

        if (sortOrder === 'desc') {
          return aVal < bVal ? 1 : -1
        }
        return aVal > bVal ? 1 : -1
      })
    }

    return HttpResponse.json({
      success: true,
      data: filteredArticles,
      count: filteredArticles.length
    })
  }),

  // Get article stats endpoint
  http.get('http://localhost:3001/api/articles/stats', () => {
    return HttpResponse.json({
      success: true,
      data: {
        total: mockArticles.length,
        validos: mockArticles.filter(a => a.estadoCalculado === 'Válido').length,
        invalidos: mockArticles.filter(a => a.estadoCalculado === 'Inválido').length,
        pendientes: mockArticles.filter(a => a.estadoCalculado === 'Pendiente').length,
        excluidos: 0
      }
    })
  }),

  // Update article endpoint
  http.put('http://localhost:3001/api/articles/:id', async ({ params, request }) => {
    const id = String(params.id)
    const updates = await request.json() as Partial<BackendArticle>
    
    const article = mockArticles.find(a => a.id === id)
    if (!article) {
      return new HttpResponse(null, { status: 404 })
    }

    const updatedArticle = { ...article, ...updates }
    return HttpResponse.json({
      success: true,
      data: updatedArticle
    })
  })
]

export const errorHandlers = [
  http.get('http://localhost:3001/api/health', () => {
    return HttpResponse.json({ success: false, message: 'Health check failed' }, { status: 500 })
  }),

  http.get('http://localhost:3001/api/articles', () => {
    return HttpResponse.json({ success: false, message: 'Failed to fetch articles' }, { status: 500 })
  })
]
