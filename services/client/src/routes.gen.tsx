// Generouted, changes to this file will be overridden
import { Fragment } from 'react'
import { Outlet, RouterProvider, createLazyRoute, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'

import App from './pages/_app'
import NoMatch from './pages/404'

const root = createRootRoute({ component: App || Outlet })
const _404 = createRoute({ getParentRoute: () => root, path: '*', component: NoMatch || Fragment })
const index = createRoute({ getParentRoute: () => root, path: '/' }).lazy(() =>
           import('./pages/index').then((m) => createLazyRoute('/')({ component: m.default }))
         )
const profile = createRoute({ getParentRoute: () => root, path: 'profile' }).lazy(() =>
           import('./pages/profile').then((m) => createLazyRoute('/profile')({ component: m.default }))
         )

const config = root.addChildren([
  index,profile,
  _404,
])

const router = createRouter({ routeTree: config })
export const routes = config
export const Routes = () => <RouterProvider router={router} />

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
