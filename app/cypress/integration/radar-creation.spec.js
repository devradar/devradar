/// <reference types="Cypress" />
const getBackend = () => cy.window().its('backend')

context('Radar Upsert', () => {
  it('login via backend', () => {
    cy.viewport('macbook-13')
    cy.visit('/')
    cy.get('header').contains('Radar').should('not.exist')
    getBackend().then(backend => {
      backend.test.login()
    })
    cy.get('header').contains('Radar', { timeout: 10e3 }).should('be.visible')
  })
})
