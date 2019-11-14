/// <reference types="Cypress" />

context('Radar View', () => {
  it('radar shows a svg', () => {
    cy.visit('/@anoff')
    // cy.get('[data-cy=loadingDialog]').should('be.visible')
    cy.get('[data-cy=radarSvg]').should('be.visible')
    cy.get('[data-cy=loadingDialog]').should('not.be.visible')
  })
})
