/// <reference types="Cypress" />
const devices = ['macbook-15', 'macbook-13', 'iphone-x']
context('Radar View', () => {
  it('shows radar + legend responsively', () => {
    cy.visit('/@anoff')
    devices.forEach(device => {
      cy.viewport(device)
      cy.get('[data-cy="radarSvg"]').should('be.visible')
      cy.get('[data-cy="loadingDialog"]').should('not.be.visible')
      cy.get('[data-cy="radar-legendwest"]:visible').should('have.length', 1)
      cy.get('[data-cy="radar-legendeast"]:visible').should('have.length', 1)
    })
  })
})
