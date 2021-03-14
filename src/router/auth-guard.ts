import { store } from '../store'
export default (validatorFn : any) => { // make authguard a curry for custom validations per route
  return (to : any, from : any, next : any) : void => {
    const user = store.getters['user/user']
    if (validatorFn(user)) {
      next()
    } else {
      next('/login')
    }
  }
}
