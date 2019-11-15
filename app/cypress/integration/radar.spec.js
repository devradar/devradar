/// <reference types="Cypress" />

context('Radar View', () => {
  ['macbook-15', 'macbook-13', 'iphone-x'].forEach(device => {
    describe(`works on screensize ${device}`, () => {
      beforeEach(() => {
        cy.visit('/@anoff')
        cy.viewport(device)
      })
      it('radar svg is visible', () => {
        cy.get('[data-cy="radarSvg"]').should('be.visible')
        cy.get('[data-cy="loadingDialog"]').should('not.be.visible')
      })
      it('exactly one legend per side is visible', () => {
        cy.get('[data-cy="radar-legendwest"]:visible').should('have.length', 1)
        cy.get('[data-cy="radar-legendeast"]:visible').should('have.length', 1)
      })
    })
  })
})
