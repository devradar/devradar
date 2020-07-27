import init from './init'
import test from './test-calls'
import blips from './store/blips'
import user from './store/user'

export default {
  init,
  store: {
    blips,
    user
  },
  testUtils: test
}
