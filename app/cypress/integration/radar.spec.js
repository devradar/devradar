/// <reference types="Cypress" />
const devices = ['macbook-15', 'macbook-13', 'iphone-x']
context('Radar', () => {
  before(() => {
    cy.clean()
    cy.wait(3000)
  })
  beforeEach(() => {
    cy.visit('/')
    cy.get('[data-cy=cookie-banner] button').click()
  })

  it('login should happen in less than 10s', () => {
    cy.viewport('macbook-13')
    cy.get('header').contains('Radar').should('not.exist')
    cy.getBackend().then(backend => backend.test.login())
    cy.wait(1000)
    cy.get('header').contains('Radar', { timeout: 10e3 }).should('be.visible')
  })

  it('does not show settings button to anonymous users', () => {
    cy.visit('/logout')
    cy.visit('/@rick')
    cy.get('[data-cy="app-nav-toggle"]').click({ force: true })
    cy.get('[data-cy="app-nav-settings"]').should('not.be.visible')
  })

  it('shows radar + legend responsively', () => {
    cy.getBackend().then(backend => backend.test.login())
    cy.visit('/@rick')
    devices.forEach(device => {
      cy.viewport(device)
      cy.get('[data-cy="radarSvg"]').should('be.visible')
      cy.get('[data-cy="loadingDialog"]').should('not.be.visible')
      cy.get('[data-cy="radar-legendwest"]:visible').should('have.length', 1)
      cy.get('[data-cy="radar-legendeast"]:visible').should('have.length', 1)
      cy.get('[data-cy="app-nav-toggle"]').click({ force: true })
      cy.get('[data-cy="app-nav-settings"]').should('be.visible')
      cy.get('[data-cy="app-nav-toggle"]').click({ force: true })
      cy.get('[data-cy="app-nav-settings"]').should('not.be.visible')
    })
  })
})
