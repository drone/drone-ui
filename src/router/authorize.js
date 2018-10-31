/**
 * Authorizer returns a router gate that requires user
 * authentication to access restricted routes. If the
 * user is not authenticated, they are redirected to
 * the login page.
 * 
 * @param {*} store
 * @param {*} window
 */
export const authorizer = (store, window) => (to, from, next) => {
    // require authentication to access certain
    // routes. If the user is not authenticated,
    // redirect to login.
    if (!store.state.user) {
      if (to.meta && to.meta.requiresAuth) {
        window.location.href='/login';
        return;
      }
    }
  
    // proceed to the next guard.
    next();
}
