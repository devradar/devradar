/// <reference types="Cypress" />
require('../support/cy-all')

context('Blip editing', function () {
  beforeEach(function () {
    const testUser = 'morty' // see test-calls.ts implementation for mapping
    cy.clean()
    cy.gohome()
    cy.login(testUser, { reroute: true })
    cy.get('[data-cy="radar-tab-diary"]').click()
  })

  it('adding a new blip', function () {
    cy.dropBlips()
    cy.wait(200)
    const blipTitle = 'blipA'
    cy.get('[data-cy="blip-title"]').should('not.exist')
    cy.get('[data-cy="blip-new-button"]:visible').click({ force: true })
    cy.get('[data-cy="blip-new-title"]:visible').type(blipTitle)
    cy.get('[data-cy="blip-new-category"]').click({ force: true })
    cy.get('.menuable__content__active .v-list-item__content:visible')
      .then(listItems => listItems[0].click())
    cy.get('[data-cy="blip-new-level"]').click({ force: true })
    cy.get('.menuable__content__active .v-list-item__content:visible')
      .then(listItems => listItems[0].click())
    cy.get('[data-cy="blip-new-submit"]').click()
    cy.wait(700)
    cy.get('[data-cy="blip-title"]').contains(blipTitle).should('exist')
  })

  it('removing one out of three blips', function () {
    cy.dropBlips()
    cy.wait(200)
    cy.all(
      cy.getTestUtils(),
      cy.fixture('blips'),
    )
      .spread((utils, blipsFix) => {
        return Promise.all(blipsFix.blips.slice(0, 3).map(b => utils.addBlip(b)))
      })
    let blip0, blip1, blip2
    cy.get('[data-cy="blip"]').then($blips => {
      cy.wrap($blips).should('have.length', 3)
      blip0 = $blips.eq(0)
      blip1 = $blips.eq(1)
      blip2 = $blips.eq(2)
      cy.wrap(blip1).should('exist')
      cy.wrap(blip1).within(() => {
        cy.get('[data-cy="blip-edit-button"]').click()
        cy.get('[data-cy="blip-delete-button1"]').click()
        cy.get('[data-cy="blip-delete-button2"]').click()
      })
    })
    cy.wait(300)
    cy.get('[data-cy="blip"]').then($blips => {
      cy.wrap($blips).should('have.length', 2)
      cy.wrap(blip0).should('exist')
      cy.wrap(blip1).should('not.exist')
      cy.wrap(blip2).should('exist')
    })
  })
})
