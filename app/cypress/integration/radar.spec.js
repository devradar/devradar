/// <reference types="Cypress" />
const devices = ['macbook-15', 'macbook-13', 'iphone-x']

context('Radar View', () => {
  before(() => {
    cy.exec('node cypress/support/wipe-firestore.js')
  })
  beforeEach(() => {
    cy.visit('/')
    cy.get('[data-cy=cookie-banner] button').click()
  })

  it('does not show settings button to anonymous users', () => {
    cy.visit('/logout')
    cy.visit('/@rick')
    cy.get('[data-cy="radar-settings-button"]').should('not.exist')
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
      cy.get('[data-cy="radar-settings-button"]').should('exist') // logged in user should see edit button
    })
  })
})
