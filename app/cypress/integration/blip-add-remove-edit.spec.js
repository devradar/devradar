/// <reference types="Cypress" />
const getBackend = () => cy.window().its('backend')

context('Blip editing', () => {
  before(() => {
    cy.exec('node cypress/support/wipe-firestore.js')
    cy.visit('/')
    getBackend().then(backend => {
      return backend.test.login()
    })
    cy.get('[data-cy="loadingDialog"]', { timeout: 10e3 }).should('be.visible')
    cy.get('[data-cy="loadingDialog"]').should('not.be.visible')
    cy.visit('/^rick')
    cy.get('[data-cy=cookie-banner] button').click()
  })

  it('adding a new blip', () => {
    cy.get('[data-cy="blip-new-button"]').click()
    cy.get('[data-cy="blip-new-title"]').type('blipA')
    cy.get('[data-cy="blip-new-category"]').click({force: true})
    cy.get('.menuable__content__active')[1].click()
    // cy.get('[data-cy="blip-new-category"]').type('T{return}', {force: true})
    // cy.get('[data-cy="blip-new-level"]').click({force: true})
    // cy.get('[data-cy="blip-new-level"]').type('H{return}', {force: true})
    cy.get('[data-cy="blip-new-submit"]').click()
    cy.get('[data-cy="blip-title"]').should('be.visible')
  })
})
