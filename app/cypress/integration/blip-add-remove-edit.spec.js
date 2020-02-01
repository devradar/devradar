/// <reference types="Cypress" />
require('../support/cy-all')

context('Blip editing', function () {
  beforeEach(function () {
    cy.clean()
    cy.visit('/')
    cy.getBackend()
      .as('backend')
    cy.get('@backend')
      .then(backend => backend.test.login())
      .as('userId')
    cy.get('[data-cy="loadingDialog"]', { timeout: 10e3 }).should('be.visible')
    cy.get('[data-cy="loadingDialog"]').should('not.be.visible')
    cy.wait(1000) // delay to make sure the getRadarId call does not fail
    cy.get('[data-cy=cookie-banner] button').click()
    cy.all(cy.get('@backend'), cy.get('@userId'))
      .spread((backend, userId) => backend.test.getRadarIdByUserId(userId))
      .then(radarId => radarId)
      .as('radarId')
    cy.get('@radarId')
      .then(radarId => {
        cy.visit(`/^${radarId}`)
      })
  })

  it('adding a new blip', function () {
    const blipTitle = 'blipA'
    cy.get('[data-cy="blip-title"]').should('not.exist')
    cy.get('[data-cy="blip-new-button"]').click()
    cy.get('[data-cy="blip-new-title"]').type(blipTitle)
    cy.get('[data-cy="blip-new-category"]').click({ force: true })
    cy.get('.menuable__content__active .v-list-item__content:visible')
      .then(listItems => listItems[0].click())
    cy.get('[data-cy="blip-new-level"]').click({ force: true })
    cy.get('.menuable__content__active .v-list-item__content:visible')
      .then(listItems => listItems[0].click())
    cy.get('[data-cy="blip-new-submit"]').click()
    cy.get('[data-cy="blip-title"]').contains(blipTitle).should('exist')
  })

  it('removing one out of three blips', function () {
    cy.all(
      cy.get('@backend'),
      cy.fixture('blips'),
      cy.get('@radarId')
    )
      .spread((backend, blipsFix, radarId) => {
        return Promise.all(blipsFix.blips.slice(0, 3).map(b => backend.test.addBlip(b)))
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
    cy.get('[data-cy="blip"]').then($blips => {
      cy.wrap($blips).should('have.length', 2)
      cy.wrap(blip0).should('exist')
      cy.wrap(blip1).should('not.exist')
      cy.wrap(blip2).should('exist')
    })
  })
})
