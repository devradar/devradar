/// <reference types="Cypress" />

const devices = ['macbook-15', 'macbook-13', 'iphone-x']
context('Radar View', () => {
  before(() => {
    cy.exec('node cypress/support/wipe-firestore.js')
  })

  it('shows radar + legend responsively', () => {
    cy.visit('/@rick')
    devices.forEach(device => {
      cy.viewport(device)
      cy.get('[data-cy="radarSvg"]').should('be.visible')
      cy.get('[data-cy="loadingDialog"]').should('not.be.visible')
      cy.get('[data-cy="radar-legendwest"]:visible').should('have.length', 1)
      cy.get('[data-cy="radar-legendeast"]:visible').should('have.length', 1)
    })
  })

  it('shows settings button to owners and not to anonymous users', () => {
    cy.visit('/@rick')
    cy.get('[data-cy="radar-settings-button"]').should('not.exist')
    cy.visit('/login')
    cy.get('[data-cy="admin-login"]').click()
    cy.wait(1000)
    cy.visit('/@rick')
    cy.get('[data-cy="radar-settings-button"]').should('exist')
  })
})
