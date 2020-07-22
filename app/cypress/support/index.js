Cypress.Commands.add('getBackend', () => cy.window().its('backend'))

Cypress.Commands.add('clean', () => {
  cy.exec('node cypress/support/wipe-firestore.js')
})
Cypress.Commands.add('dropBlips', () => {
  cy.getBackend()
    .then(backend => backend.test.dropBlips())
})

Cypress.Commands.add('login', (user = 'rick', options = { }) => {
  cy.getBackend()
  .then(backend => backend.test.login(user))
  .as('userId')
  if (options.reroute === true) {
    cy.get('[data-cy="app-nav-radar"]').click() // navigate first to make sure login is finished
  }
  if (options.fetchRadarId === true) {
    cy.all(cy.getBackend(), cy.get('@userId'))
      .spread((backend, userId) => cy.wrap(backend.test.getRadarIdByUserId(userId)))
      .as('radarId')
  }
})

Cypress.Commands.add('gohome', () => {
  cy.visit('/')
  cy.get('[data-cy=cookie-banner] button').click()
})