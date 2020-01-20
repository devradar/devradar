const chainStart = Symbol('start of promise chain') // based on https://github.com/cypress-io/cypress/issues/915#issuecomment-568037175
cy.all = function (...commands) {
  const _ = Cypress._
  const chain = cy.wrap(null, { log: false })
  const stopCommand = _.find(cy.queue.commands, {
    attributes: { chainerId: chain.chainerId }
  })
  const startCommand = _.find(cy.queue.commands, {
    attributes: { chainerId: commands[0].chainerId }
  })
  const p = chain.then(() => {
    return _(commands)
      .map(cmd => {
        return cmd[chainStart]
          ? cmd[chainStart].attributes
          : _.find(cy.queue.commands, {
            attributes: { chainerId: cmd.chainerId }
          }).attributes
      })
      .concat(stopCommand.attributes)
      .slice(1)
      .flatMap(cmd => {
        return cmd.prev.get('subject')
      })
      .value()
  })
  p[chainStart] = startCommand
  return p
}
