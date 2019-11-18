/// <reference types="Cypress" />

context('Application cookie banner', () => {
  it('is shown by default', () => {
    cy.visit('/login')
    cy.get('[data-cy=cookie-banner]').should('be.visible')
  })
  it('gets removed after clicking button', () => {
    cy.visit('/login')
    cy.get('[data-cy=cookie-banner] button').click()
    cy.get('[data-cy=cookie-banner]').should('not.be.visible')
  })
})
