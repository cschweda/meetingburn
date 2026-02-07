import type { RouterConfig } from '@nuxt/schema'

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top on navigation
    // Exception: if navigating to a hash anchor (e.g., /about#privacy), scroll to that element
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 0,
      }
    }
    
    // If using browser back/forward, use saved position
    if (savedPosition) {
      return savedPosition
    }
    
    // Otherwise, scroll to top
    return { top: 0, left: 0 }
  },
}
