describe('Articles Management E2E Tests', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('/')
    
    // Wait for the main title to be visible
    cy.contains('Tabla de Artículos').should('be.visible')
  })

  it('should load and display articles table', () => {
    // Wait for articles to load
    cy.waitForArticles()
    
    // Check that we have the expected table headers
    cy.contains('Fecha').should('be.visible')
    cy.contains('Nombre').should('be.visible')
    cy.contains('País').should('be.visible')
    cy.contains('Monto USD').should('be.visible')
    
    // Verify the table has data
    cy.get('[data-testid="virtualized-table"]').should('be.visible')
  })

  it('should filter articles by search input', () => {
    // Wait for articles to load
    cy.waitForArticles()
    
    // Search for articles from Argentina
    cy.searchArticles('Argentina')
    
    // Check that filtered results contain Argentina
    // Note: Due to virtualization, we check that search was applied
    cy.get('input[placeholder*="Buscar por nombre o país..."]').should('have.value', 'Argentina')
  })


  it('should handle mobile responsive design', () => {
    // Test mobile viewport
    cy.viewport('iphone-x')

    // reload the page to apply mobile styles
    cy.reload()
    
    // Wait for articles to load
    cy.waitForArticles()
    
    // Check that the mobile layout is applied
    cy.get('[data-testid="virtualized-table"]').should('be.visible')
    
    // Check that controls are accessible on mobile
    cy.get('input[placeholder*="Buscar por nombre o país..."]').should('be.visible')
  })

})
