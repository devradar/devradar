/// <reference types="Cypress" />
require('../support/cy-all')

const devices = ['macbook-15', 'macbook-13', 'iphone-x']
context('Radar', () => {
  before(() => {
    cy.clean()
  })
  beforeEach(() => {
    cy.gohome()
  })

  it('login should happen in less than 10s', () => {
    cy.viewport('macbook-13')
    cy.get('header').contains('Me').should('not.exist')
    cy.login('rick')
    cy.get('header').contains('Me', { timeout: 10e3 }).should('be.visible')
  })

  it('does not show settings button to anonymous users', () => {
    cy.visit('/logout')
    cy.visit('/@rick')
    cy.get('[data-cy="app-nav-toggle"]').click({ force: true })
    cy.get('[data-cy="app-nav-settings"]').should('not.be.visible')
  })

  it('shows radar + legend responsively', () => {
    cy.login('rick', { reroute: true })
    devices.forEach(device => {
      cy.viewport(device)
      cy.get('[data-cy="radarSvg"]').should('be.visible')
      cy.get('[data-cy="loadingDialog"]').should('not.be.visible')
      cy.get('[data-cy="radar-legendwest"]:visible').should('have.length', 1)
      cy.get('[data-cy="radar-legendeast"]:visible').should('have.length', 1)
      cy.get('[data-cy="radar-tab-diary"]').should('be.visible')
      cy.get('[data-cy="radar-tab-radar"]').should('be.visible')
      cy.get('[data-cy="radar-tab-settings"]').should('be.visible')
    })
  })

  it('allows navigation from radar to history view by clicking blip', () => {
    cy.login('rick', { reroute: true })
    cy.getBackend()
      .then(backend => backend.test.dropBlips())
    cy.all(
      cy.getBackend()
      cy.fixture('blips')
    )
      .spread((backend, blipsFix) => backend.test.addBlip(blipsFix.blips[0]))
    cy.get('[data-cy="radarSvg"]').should('be.visible') // verify that we start on the radar chart view
    cy.get('.blip').then($blips => {
      cy.wrap($blips).should('have.length', 1)
      cy.wrap($blips[0]).click() // navigate to history view
    })
    cy.get('[data-cy="radarSvg"]').should('not.be.visible')
    cy.get('[data-cy="blipsList"]').should('be.visible') // verify we end up on the list view
  })
})
