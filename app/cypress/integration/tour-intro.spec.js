/// <reference types="Cypress" />
context('Intro', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('[data-cy=cookie-banner] button').click()
  })

  it('should star tour via button', () => {
    cy.get('[data-cy=home-tour-button]').click()
    cy.get('[data-cy=intro-step]').contains('Start your devradar journey')
  })

  it('should cancel tour via button', () => {
    cy.get('[data-cy=home-tour-button]').click()
    cy.get('[data-cy=intro-step]').should('exist')
    cy.get('[data-cy=intro-skip-tutorial]').click()
    cy.get('[data-cy=intro-step]').should('not.exist')
  })
})
