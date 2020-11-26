Cypress.Commands.add('getBackend', () => cy.window().its('backend'))

Cypress.Commands.add('getTestUtils', () => cy.window().its('testUtils'))

Cypress.Commands.add('clean', () => {
  cy.exec('node cypress/support/wipe-firestore.js')
})
Cypress.Commands.add('dropBlips', () => {
  cy.getTestUtils()
    .then(utils => utils.dropBlips())
})

Cypress.Commands.add('login', (user = 'rick', options = { setAlias: true, waitForLogin: false }) => {
  cy.getTestUtils()
    .then(utils => utils.login(user))
    .as('userId')
  cy.get('[data-cy="app-nav-login"]', { timeout: 10e3 }).should('not.be.visible') // wait for login to propagate (in case of firebase takes a while)
  cy.get('[data-cy="app-nav-radar"]').should('be.visible')
  if (options.reroute === true) {
    cy.get('[data-cy="app-nav-radar"]', { timeout: 10e3 }).click() // navigate first to make sure login is finished
  }
  if (options.fetchRadarId === true || options.setAlias === true) {
    cy.all(cy.getTestUtils(), cy.get('@userId'))
      .spread((utils, userId) => cy.wrap(utils.getRadarIdByUserId(userId)))
      .as('radarId')
  }
  if (options.setAlias === true) {
    cy.all(cy.window().its('app'), cy.get('@radarId'))
      .spread((app, radarId) => {
        app.$store.dispatch('blips/setRadarAlias', { alias: 'rick', radarId: radarId })
      })
  }
})

Cypress.Commands.add('gohome', () => {
  cy.visit('/')
  cy.window()
    .then(window => {
      const cookieIsSet = window.localStorage.getItem('cookie:accepted') === 'true'
      if (!cookieIsSet) {
        cy.get('[data-cy=cookie-banner] button')
          .scrollIntoView()
          .click({ force: true })
      }
    })
})
