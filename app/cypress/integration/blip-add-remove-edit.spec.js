/// <reference types="Cypress" />
const getBackend = function () { return cy.window().its('backend') }

context('Blip editing', function () {
  before(function () {
    cy.exec('node cypress/support/wipe-firestore.js')
    cy.visit('/')
    getBackend()
      .then(backend => backend.test.login())
      .as('userId')
      .then(uid => cy.visit(`/^${uid}`))
    cy.get('[data-cy="loadingDialog"]', { timeout: 10e3 }).should('be.visible')
    cy.get('[data-cy="loadingDialog"]').should('not.be.visible')
    cy.get('[data-cy=cookie-banner] button').click()
  })

  it('adding a new blip', function () {
    cy.get('[data-cy="blip-new-button"]').click()
    cy.get('[data-cy="blip-new-title"]').type('blipA')
    cy.get('[data-cy="blip-new-category"]').click({ force: true })
    cy.get('.menuable__content__active .v-list-item__content:visible')
      .then(listItems => listItems[0].click())
    cy.get('[data-cy="blip-new-level"]').click({ force: true })
    cy.get('.menuable__content__active .v-list-item__content:visible')
      .then(listItems => listItems[0].click())
    cy.get('[data-cy="blip-new-submit"]').click()
    cy.get('[data-cy="blip-title"]').should('be.visible')
  })
})
