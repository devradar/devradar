/// <reference types="Cypress" />
const getBackend = () => cy.window().its('backend')

context('Radar created for new users', () => {
  before(() => {
    cy.exec('node cypress/support/wipe-firestore.js')
  })
  beforeEach(() => {
    cy.visit('/')
    cy.get('[data-cy=cookie-banner] button').click()
  })
  it('login via backend', () => {
    cy.viewport('macbook-13')
    cy.get('header').contains('Radar').should('not.exist')
    getBackend().then(backend => {
      backend.test.login()
    })
    cy.get('header').contains('Radar', { timeout: 30e3 }).should('be.visible')
  })
})
