Cypress.Commands.add('getBackend', () => cy.window().its('backend'))

Cypress.Commands.add('clean', () => {
  cy.exec('node cypress/support/wipe-firestore.js')
})
