/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to wait for articles to load
       * @example cy.waitForArticles()
       */
      waitForArticles(): Chainable<Element>
      
      /**
       * Custom command to search articles
       * @example cy.searchArticles('Argentina')
       */
      searchArticles(searchTerm: string): Chainable<Element>
    }
  }
}

Cypress.Commands.add('waitForArticles', () => {
  // Wait for the table to load and have at least one data row
  cy.get('[data-testid="virtualized-table"]', { timeout: 10000 }).should('be.visible')
  // Wait for loading to complete
  cy.get('[data-testid="loading"]').should('not.exist')
})

Cypress.Commands.add('searchArticles', (searchTerm: string) => {
  cy.get('input[placeholder*="Buscar por nombre o país..."]').clear().type(searchTerm)
  // Wait for debounced search to apply
  cy.wait(500)
})

export {}
