import { store } from '../store'
export default validatorFn => { // make authguard a curry for custom validations per route
  return (to, from, next) => {
    const user = store.getters.user
    if (validatorFn(user)) {
      next()
    } else {
      next('/login')
    }
  }
}
