/**
 * Test simplificado para verificar que el flujo de datos MSW -> Hook -> Componente funciona
 * Sin virtualización para aislar el problema
 */

import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { useBackendData } from '../hooks/useBackendData'
import { server } from '../__tests__/mocks/server'
import { beforeAll, afterEach, afterAll, describe, it, expect } from 'vitest'

// Tema básico para Material-UI
const theme = createTheme()

// Componente de prueba simple que muestra los datos sin virtualización
function SimpleDataDisplay() {
  const { articles, loading, error } = useBackendData()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Articles</h1>
      <div data-testid="articles-container">
        {articles.map(article => (
          <div key={article.id} data-testid={`article-${article.id}`}>
            <span data-testid={`name-${article.id}`}>{article.name}</span>
            <span data-testid={`country-${article.id}`}>{article.country}</span>
            <span data-testid={`amount-${article.id}`}>{article.originalAmount}</span>
            <span data-testid={`status-${article.id}`}>{article.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  )
}

describe('Simple Data Flow Test (MSW -> Hook -> Component)', () => {
  // Setup MSW
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('should load data from MSW and display it without virtualization', async () => {
    console.log('🔍 Starting simple data flow test...')
    
    renderWithTheme(<SimpleDataDisplay />)
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    }, { timeout: 5000 })
    
    console.log('✅ Loading finished')
    
    // Check that articles container exists
    const container = screen.getByTestId('articles-container')
    expect(container).toBeInTheDocument()
    
    // Wait for articles to appear
    await waitFor(() => {
      expect(screen.getByTestId('article-1')).toBeInTheDocument()
    }, { timeout: 3000 })
    
    console.log('✅ Article containers found')
    
    // Verify specific data
    expect(screen.getByTestId('name-1')).toHaveTextContent('Test Article 1')
    expect(screen.getByTestId('country-1')).toHaveTextContent('Spain')
    expect(screen.getByTestId('amount-1')).toHaveTextContent('100')
    expect(screen.getByTestId('status-1')).toHaveTextContent('Válido')
    
    // Check second article
    expect(screen.getByTestId('name-2')).toHaveTextContent('Test Article 2')
    expect(screen.getByTestId('country-2')).toHaveTextContent('France')
    expect(screen.getByTestId('amount-2')).toHaveTextContent('250')
    expect(screen.getByTestId('status-2')).toHaveTextContent('Inválido')
    
    // Check third article
    expect(screen.getByTestId('name-3')).toHaveTextContent('Another Test Article')
    expect(screen.getByTestId('country-3')).toHaveTextContent('Germany')
    expect(screen.getByTestId('amount-3')).toHaveTextContent('500')
    expect(screen.getByTestId('status-3')).toHaveTextContent('Válido')
    
    console.log('✅ All article data verified successfully!')
  })
})
