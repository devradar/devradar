Cypress.Commands.add('getBackend', () => cy.window().its('backend'))

Cypress.Commands.add('getTestUtils', () => cy.window().its('testUtils'))

Cypress.Commands.add('clean', () => {
  cy.exec('node cypress/support/wipe-firestore.js')
})
Cypress.Commands.add('dropBlips', () => {
  cy.getTestUtils()
    .then(utils => utils.dropBlips())
})

Cypress.Commands.add('login', (user = 'rick', options = { setAlias: true }) => {
  cy.getTestUtils()
    .then(utils => utils.login(user))
    .as('userId')
  if (options.reroute === true) {
    cy.get('[data-cy="app-nav-radar"]').click() // navigate first to make sure login is finished
  }
  if (options.fetchRadarId === true) {
    cy.all(cy.getTestUtils(), cy.get('@userId'))
      .spread((utils, userId) => cy.wrap(utils.getRadarIdByUserId(userId)))
      .as('radarId')
  }
  if (options.setAlias === false) {
    cy.all(cy.getTestUtils(), cy.get('@radarId'))
    cy.get('@radarId')
      .then(radarId => {
        store.dispatch('blips/setRadarAlias', { alias: 'rick', radarId: radarId })
      })
  }
})

Cypress.Commands.add('gohome', () => {
  cy.visit('/')
  cy.get('[data-cy=cookie-banner] button')
    .scrollIntoView()
    .click()
})
