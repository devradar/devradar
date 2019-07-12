// https://cookieconsent.insites.com/download/#
window.addEventListener('load', function () {
  console.log('INIT')
  window.cookieconsent.initialise({
    'palette': {
      'popup': {
        'background': '#0ddd0d'
      },
      'button': {
        'background': '#333'
      }
    }
  })
})
