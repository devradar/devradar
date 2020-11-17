/// <reference types="Cypress" />
context('Intro', () => {
  beforeEach(() => {
    cy.gohome()
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

  it('tour start for logged-in users should be on radar page', () => {
    cy.get('[data-cy="app-nav-radar"]').should('not.exist')
    cy.getTestUtils().then(utils => utils.login('rick'))
    cy.get('[data-cy="app-nav-radar"]', { timeout: 10e3 }).should('be.visible')
    cy.visit('/') // wait until radar is fully loaded for some reason..
    cy.wait(500)
    cy.get('[data-cy=home-tour-button]').click()
    cy.wait(700)
    cy.get('[data-cy=intro-step]').contains('Create a new', { includeShadowDom: true })
  })
})
