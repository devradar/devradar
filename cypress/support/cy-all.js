// @see https://github.com/cypress-io/cypress/issues/915#issuecomment-475862672
// Modified due to changes to `cy.queue` https://github.com/cypress-io/cypress/pull/17448
// Note: this does not run Promises in parallel like native `Promise.all` due to the nature
// of Cypress commands being promise-like/reactive streams. This only makes it convenient to use the same
// API but runs the commands sequentially.

const chainStart = "___CY_ALL_CHAIN_START___"
cy.all = function (...commands) {
  const _ = Cypress._
  // eslint-disable-next-line
  const chain = cy.wrap(null, {
    log: false
  })
  const stopCommand = _.find(cy.queue.get(), {
    attributes: {
      chainerId: chain.chainerId
    },
  })
  const startCommand = _.find(cy.queue.get(), {
    attributes: {
      chainerId: commands[0].chainerId
    },
  })
  const p = chain.then(() => {
    return (
      _(commands)
      .map(cmd => {
        return cmd[chainStart] ?
          cmd[chainStart].attributes :
          _.find(cy.queue.get(), {
            attributes: {
              chainerId: cmd.chainerId
            },
          }).attributes
      })
      .concat(stopCommand.attributes)
      .slice(1)
      .flatMap(cmd => {
        return cmd.prev.get("subject")
      })
      .value()
    )
  })
  p[chainStart] = startCommand
  return p
}
