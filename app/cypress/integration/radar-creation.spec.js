/// <reference types="Cypress" />
const getBackend = () => cy.window().its('backend')

context('Radar Upsert', () => {
  it ('login via backend', () => {

    cy.window().its('backend').then(backend => {
      console.log(backend)
    })
  })
})
